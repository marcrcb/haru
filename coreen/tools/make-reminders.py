#!/usr/bin/env python3
"""Génère les rappels d'agenda (fichiers .ics) : un événement quotidien à l'heure choisie, avec alerte, qui ouvre Haru.

Ce sont des fichiers statiques (un par heure et par langue) : un téléphone les ouvre directement
dans son agenda (iPhone compris), sans serveur ni notification. Usage : python3 tools/make-reminders.py
"""
from pathlib import Path

URL = 'https://marcrcb.github.io/haru/'
OUT = Path(__file__).resolve().parent.parent / 'rappels'
TEXT = {
    'fr': ('Haru · ta séance du jour', 'Quelques minutes de coréen ou de japonais : ton objectif du jour t’attend.'),
    'en': ('Haru · your daily session', 'A few minutes of Korean or Japanese: your daily goal is waiting.'),
}


def ics(lang: str, hour: int) -> str:
    title, body = TEXT[lang]
    lines = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Haru//Rappel quotidien//FR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        f'UID:haru-rappel-{lang}-{hour:02d}@marcrcb.github.io',
        'DTSTAMP:20261117T000000Z',
        f'DTSTART:20261118T{hour:02d}0000',  # heure locale du téléphone (sans fuseau)
        'DURATION:PT10M',
        'RRULE:FREQ=DAILY',
        f'SUMMARY:{title}',
        f'DESCRIPTION:{body} {URL}',
        f'URL:{URL}',
        'BEGIN:VALARM', 'ACTION:DISPLAY', f'DESCRIPTION:{title}', 'TRIGGER:PT0M', 'END:VALARM',
        'END:VEVENT', 'END:VCALENDAR',
    ]
    return '\r\n'.join(lines) + '\r\n'


def main() -> None:
    OUT.mkdir(exist_ok=True)
    for lang in TEXT:
        for hour in range(6, 24):
            (OUT / f'haru-{lang}-{hour:02d}.ics').write_bytes(ics(lang, hour).encode('utf-8'))
    print(f'{len(TEXT) * 18} rappels écrits dans {OUT}')


if __name__ == '__main__':
    main()
