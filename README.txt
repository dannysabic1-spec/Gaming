# Kefalo Bot

## Python verzija (bot.py)

Instalacija:
  pip install -r requirements.txt

Pokretanje:
  export DISCORD_BOT_TOKEN=tvoj_token
  python bot.py

## Docker
  docker build -t kefalo-bot .
  docker run -e DISCORD_BOT_TOKEN=tvoj_token kefalo-bot

## Komande (prefix: .)
  .kaladont      - Kaladont igra (lancanje reci)
  .wordle        - Wordle (pogodi rec od 5 slova)
  .toplo         - Toplo/Klanno (pogodi broj 1-100)
  .quiz          - Kviz pitanje
  .slots [iznos] - Slot masina
  .pare          - Provjeri balans
  .lestvica      - Top 10 igraca
  .pomoc         - Lista svih komandi
