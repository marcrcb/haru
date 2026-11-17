#!/usr/bin/env python3
"""Voix naturelles de Haru : synthèse, contrôle par reconnaissance vocale, encodage MP3.

  coréen   : MeloTTS (licence MIT), voix KR
  japonais : Kokoro-82M (licence Apache 2.0), voix jf_gongitsune

Chaque enregistrement est réécouté par Whisper (faster-whisper « medium ») : il n'est publié que si
ce qui est entendu correspond au texte (sinon l'application garde la voix du téléphone pour ce texte).
Relançable : les textes déjà traités (publiés ou écartés) sont sautés.
Deuxième écoute : Whisper entend mal les mots isolés très courts (밥 → 다). Si la première écoute échoue,
on réécoute en lui donnant le mot attendu comme indice ; les mêmes seuils s'appliquent.
RECHECK=1 : repasse une fois les textes écartés avant cette deuxième écoute.

Usage : node tools/audio-list.mjs > list.json
        python tools/make-audio.py ko list.json audio/ko [limite]
"""
import io, json, os, re, subprocess, sys, time, unicodedata
from pathlib import Path

import numpy as np
import soundfile as sf

course, list_path, out_dir = sys.argv[1], Path(sys.argv[2]), Path(sys.argv[3])
limit = int(sys.argv[4]) if len(sys.argv) > 4 else None
out_dir.mkdir(parents=True, exist_ok=True)
qa_path = out_dir / 'qa.json'
qa = json.loads(qa_path.read_text()) if qa_path.exists() else {}


def fnv1a(key: str) -> str:
    h = 0x811C9DC5
    for b in key.encode('utf-8'):
        h ^= b
        h = (h * 0x01000193) & 0xFFFFFFFF
    return f'{h:08x}'


# ---------- Synthèse ----------
if course == 'ko':
    from melo.api import TTS
    melo = TTS(language='KR', device='cpu')
    SR = melo.hps.data.sampling_rate

    def synth(text: str) -> np.ndarray:
        return melo.tts_to_file(text, 0, None, speed=0.9, quiet=True)
else:
    from kokoro import KPipeline
    kokoro = KPipeline(lang_code='j')
    SR = 24000

    def synth(text: str) -> np.ndarray:
        parts = [a.numpy() if hasattr(a, 'numpy') else a for _, _, a in kokoro(text, voice='jf_gongitsune', speed=0.9)]
        return np.concatenate(parts) if parts else np.zeros(1, dtype=np.float32)


def trim(a: np.ndarray, pad: float = 0.08) -> np.ndarray:
    """Retire les silences au début et à la fin (en gardant une courte marge)."""
    a = np.asarray(a, dtype=np.float32).flatten()
    loud = np.where(np.abs(a) > 0.01)[0]
    if not len(loud):
        return a
    p = int(SR * pad)
    return a[max(0, loud[0] - p): loud[-1] + p]


def to_mp3(a: np.ndarray, path: Path) -> None:
    buf = io.BytesIO()
    sf.write(buf, a, SR, format='WAV', subtype='PCM_16')
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', 'pipe:0', '-ac', '1', '-ar', '24000', '-b:a', '40k', str(path)],
                   input=buf.getvalue(), check=True)


# ---------- Contrôle par reconnaissance vocale ----------
from faster_whisper import WhisperModel
asr = WhisperModel('medium', device='cpu', compute_type='int8')

if course == 'ja':
    import pykakasi
    kks = pykakasi.kakasi()

    def norm(s: str) -> str:
        hira = ''.join(x['hira'] for x in kks.convert(unicodedata.normalize('NFKC', s)))
        return re.sub(r'[^ぁ-ゖ]', '', hira)
else:
    def norm(s: str) -> str:
        return re.sub(r'[^가-힣]', '', s)


def cer(a: str, b: str) -> float:
    if not a:
        return 1.0
    d = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        prev, d[0] = d[0], i
        for j, cb in enumerate(b, 1):
            prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (ca != cb))
    return d[len(b)] / len(a)


def listen(a: np.ndarray, say: str, hint: bool):
    a16 = a.astype(np.float32) if SR == 16000 else resample(a)
    a16 = np.concatenate([np.zeros(8000, np.float32), a16, np.zeros(8000, np.float32)])  # un peu de silence autour : Whisper entend mieux
    segs, _ = asr.transcribe(a16, language=course, beam_size=5, condition_on_previous_text=False, without_timestamps=True,
                             initial_prompt=say if hint else None)
    heard = ''.join(s.text for s in segs).strip()
    target, got = norm(say), norm(heard)
    e = cer(target, got)
    ok = (e == 0) if len(target) <= 2 else e <= (0.2 if course == 'ko' else 0.25)
    return ok, heard, round(e, 3)


def check(a: np.ndarray, say: str):
    first = listen(a, say, False)
    return first if first[0] else listen(a, say, True)


def resample(a: np.ndarray) -> np.ndarray:
    n = int(len(a) * 16000 / SR)
    return np.interp(np.linspace(0, len(a) - 1, n), np.arange(len(a)), a).astype(np.float32)


# ---------- Index : empreintes des enregistrements publiés (l'application ne demande que ceux-là) ----------
def write_index():
    valid = sorted(v['h'] for k, v in qa.items() if v.get('ok') and seen.get(v['h']) == k and (out_dir / f"{v['h']}.mp3").exists())
    (out_dir / 'index.json').write_text(json.dumps(valid))


# ---------- Boucle ----------
items = json.loads(list_path.read_text())[course]
seen, todo = {}, []
for it in items:
    h = fnv1a(it['key'])
    if h in seen and seen[h] != it['key']:
        print('collision ignorée :', it['key'], seen[h])
        continue
    seen[h] = it['key']
    q = qa.get(it['key'])
    if q is None or (os.environ.get('RECHECK') and not q.get('ok') and not q.get('rechecked')):
        todo.append((h, it))
if limit:
    todo = todo[:limit]
print(f'{course} : {len(todo)} à traiter, {len(qa)} déjà faits', flush=True)
t0 = time.time()
for n, (h, it) in enumerate(todo, 1):
    try:
        a = trim(synth(it.get('text') or it['say']))  # japonais : écriture d'origine ; contrôle sur la lecture (say)
        ok, heard, e = check(a, it['say'])
        if ok:
            to_mp3(a, out_dir / f'{h}.mp3')
        qa[it['key']] = {'h': h, 'say': it['say'], 'heard': heard, 'cer': e, 'ok': ok, **({'rechecked': True} if os.environ.get('RECHECK') else {})}
    except Exception as ex:  # un texte qui échoue ne bloque pas les autres
        qa[it['key']] = {'h': h, 'say': it['say'], 'error': str(ex)[:200], 'ok': False}
    if n % 25 == 0 or n == len(todo):
        qa_path.write_text(json.dumps(qa, ensure_ascii=False, indent=0))
        write_index()  # utilisable même si la génération est interrompue
        good = sum(1 for v in qa.values() if v.get('ok'))
        print(f'{n}/{len(todo)} · {good}/{len(qa)} validés · {(time.time() - t0) / n:.2f} s/texte', flush=True)

write_index()
print('index :', len(json.loads((out_dir / 'index.json').read_text())), 'enregistrements')
