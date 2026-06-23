# Kefalo Bot

## Python verzija (bot.py) — PREPORUČENO

Instalacija:
  pip install -r requirements.txt

Pokretanje:
  export DISCORD_BOT_TOKEN=tvoj_token
  python bot.py

## Docker
  docker build -t kefalo-bot .
  docker run -e DISCORD_BOT_TOKEN=tvoj_token kefalo-bot

## Prefix komande (-)
  -kaladont        Kaladont (lančanje reči), 1075 reči
  -kaladont stop   Zaustavi igru
  -wordle          Pogodi reč od 5 slova (6 pokušaja)
  -toplo           Pogodi broj 1-100 (Toplo/Klanno)
  -quiz            Kviz pitanje (30 pitanja, A/B/C/D)
  -slots [iznos]   Slot mašina
  -slots sve       All-in
  -pare            Provjeri balans
  -novcanik        Isto kao -pare
  -lestvica        Top 10 igrača
  -status          Aktivne igre u kanalu
  -pomoc           Lista svih komandi

## Slash komande (samo admini)
  /set kanal   igra:#kanal   Postavi kanal za igru
  /set ukloni  igra:#kanal   Ukloni kanal
  /set resetuj igra          Ukloni sva ograničenja
  /set prikazi               Prikaži podešavanja

  Igre: kaladont | wordle | toplo | quiz | slots | sve

## Nagrade
  Kaladont pobeda  500 💵
  Wordle 1. pokušaj 250 💵 (manje sa više pokušaja)
  Toplo/Klanno     150 💵
  Kviz             100-300 💵
  Slots            zavisi od uloga i sreće

## Fajlovi koji se kreiraju automatski
  economy.json         — balanse igrača
  channel_config.json  — podešavanja kanala
