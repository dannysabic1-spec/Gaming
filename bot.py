"""
Kefalo Bot — Discord bot sa igrama i ekonomijom
Zahteva: pip install discord.py

Pokretanje:
  export DISCORD_BOT_TOKEN=tvoj_token
  python bot.py

Komande (prefix: -):
  -kaladont          — Pokreni kaladont
  -kaladont stop     — Zaustavi kaladont
  -wordle            — Pokreni wordle
  -toplo             — Pokreni toplo/klanno
  -quiz              — Nasumično pitanje
  -slots [iznos]     — Slot mašina
  -pare              — Provjeri balans
  -lestvica          — Top 10 igrača
  -pomoc             — Lista komandi

Slash komande:
  /set igra kanal    — Postavi kanal za igru (admin)
  /set prikazi       — Prikaži trenutna podešavanja
  /set resetuj igra  — Ukloni ograničenje kanala za igru
"""

import os
import json
import random
import asyncio
from pathlib import Path

import discord
from discord.ext import commands

# ─────────────────────────────────────────────
# Konfiguracija
# ─────────────────────────────────────────────
TOKEN = os.environ.get("DISCORD_BOT_TOKEN", "")
PREFIX = "-"
ECONOMY_FILE = Path("economy.json")
CHANNEL_CONFIG_FILE = Path("channel_config.json")
STARTING_BALANCE = 1000
EMBED_COLOR = 0x000000  # crna crtica

GAME_NAMES = {
    "kaladont": "Kaladont",
    "wordle":   "Wordle",
    "toplo":    "Toplo/Klanno",
    "quiz":     "Kviz",
    "slots":    "Slots",
    "sve":      "Sve igre",
}

intents = discord.Intents.default()
intents.message_content = True
intents.guilds = True

bot = commands.Bot(command_prefix=PREFIX, intents=intents, help_command=None)

# ─────────────────────────────────────────────
# Konfiguracija kanala po igri
# ─────────────────────────────────────────────
# Struktura: { "guild_id": { "igra": [channel_id, ...] } }
_channel_config: dict[str, dict[str, list[int]]] = {}

def load_channel_config() -> None:
    global _channel_config
    if CHANNEL_CONFIG_FILE.exists():
        _channel_config = json.loads(CHANNEL_CONFIG_FILE.read_text())

def save_channel_config() -> None:
    CHANNEL_CONFIG_FILE.write_text(json.dumps(_channel_config, indent=2))

def get_allowed_channels(guild_id: int, game: str) -> list[int]:
    g = str(guild_id)
    return _channel_config.get(g, {}).get(game, [])

def is_channel_allowed(guild_id: int, channel_id: int, game: str) -> bool:
    allowed = get_allowed_channels(guild_id, game)
    if not allowed:
        return True  # nema ograničenja → sve ok
    return channel_id in allowed

def add_channel_to_game(guild_id: int, channel_id: int, game: str) -> None:
    g = str(guild_id)
    _channel_config.setdefault(g, {}).setdefault(game, [])
    if channel_id not in _channel_config[g][game]:
        _channel_config[g][game].append(channel_id)
    save_channel_config()

def remove_channel_from_game(guild_id: int, channel_id: int, game: str) -> bool:
    g = str(guild_id)
    channels = _channel_config.get(g, {}).get(game, [])
    if channel_id in channels:
        channels.remove(channel_id)
        save_channel_config()
        return True
    return False

def reset_game_channels(guild_id: int, game: str) -> None:
    g = str(guild_id)
    if g in _channel_config and game in _channel_config[g]:
        del _channel_config[g][game]
        save_channel_config()

# ─────────────────────────────────────────────
# Ekonomija
# ─────────────────────────────────────────────
_balances: dict[str, int] = {}

def load_economy() -> None:
    global _balances
    if ECONOMY_FILE.exists():
        _balances = json.loads(ECONOMY_FILE.read_text())

def save_economy() -> None:
    ECONOMY_FILE.write_text(json.dumps(_balances, indent=2))

def get_balance(user_id: str) -> int:
    if user_id not in _balances:
        _balances[user_id] = STARTING_BALANCE
        save_economy()
    return _balances[user_id]

def add_balance(user_id: str, amount: int) -> int:
    bal = get_balance(user_id)
    _balances[user_id] = max(0, bal + amount)
    save_economy()
    return _balances[user_id]

def deduct_balance(user_id: str, amount: int) -> bool:
    if get_balance(user_id) < amount:
        return False
    _balances[user_id] -= amount
    save_economy()
    return True

def fmt_money(amount: int) -> str:
    return f"**{amount:,} 💵**"

def top_balances(limit: int = 10) -> list[tuple[str, int]]:
    return sorted(_balances.items(), key=lambda x: x[1], reverse=True)[:limit]

# ─────────────────────────────────────────────
# Lista srpskih reči (kaladont)
# ─────────────────────────────────────────────
SERBIAN_WORDS = [
    # A
    "automobil","avion","autobus","arhitektura","ananas","atom","armija",
    "alatka","album","aleksa","aleja","alfabet","algebra","algoritam",
    "aluminij","ambasada","ambulanta","amerikan","amisija","amfora",
    "anketa","antena","aparat","apartman","aplauz","april","april",
    "aranzan","arhiva","arkan","arsenal","arterija","asistent","atmosfera",
    "auditorij","autoput","avlija","azot",
    # B
    "brod","banka","biblioteka","bicikl","burza","bomba","barut","boja",
    "bazen","balkon","balet","balon","banana","barbar","barka","barmen",
    "baron","bata","batina","bataljon","baterija","beba","bedem","bednja",
    "behar","belo","beton","biber","biljar","bioskop","biskvit","biser",
    "blato","bled","blok","boca","bodljika","bojler","bokal","bokor",
    "bolnica","bonton","borba","borov","bostan","brada","branilac",
    "brana","brat","brdo","briga","brod","bujica","bukvar","bunar",
    "bunda","bureg","but","buvar",
    # C
    "crkva","cvet","cigareta","cipela","centar","crta","cena",
    "caklja","carina","cediljka","celina","cement","cerada","cestar",
    "cigla","cimer","cinija","cirkus","cisterna","citara","civara",
    "cobani","cokoladna","cola","cvicek","cvrcak",
    # Č
    "cas","camac","celik","cep","cizme","cobani","cokorep",
    "canac","carda","carapa","carija","casopis","castan","cekic",
    "celo","cengen","cetka","cinija","cizma","cizmar",
    # D
    "drvo","dvorac","dim","dijamant","duga","drug","duvan",
    "daska","delfin","depo","dernek","dete","dijeta","diploma",
    "direktor","disk","divan","dizalo","djak","dlan","dlaka",
    "dodir","dolina","dom","domacin","donja","dorucak","doza",
    "drama","dresura","drum","drzava","dubina","dukat","duplja",
    # E
    "elektricitet","ekonomija","ekran","energija","era","epoha",
    "element","emisija","esej","etaza","evident",
    # F
    "fabrika","film","fudbal","formula","fenjer","filozofija","fizika",
    "fakultet","farma","fasada","faza","fenomen","festival","figura",
    "fioka","fitnes","fjord","flaster","flauta","flota","fond",
    "fontana","fosfat","fotografija","frizura","frula",
    # G
    "grad","gora","grob","guma","glas","gladijator","galaksija","gitara",
    "ganac","garaza","garnitura","gater","gavran","geograf","gips",
    "gladak","glava","glazba","glina","globus","gnezdo","gobar",
    "gomila","gorivo","gost","gozba","gracija","grana","granata",
    "granica","grb","greda","grlo","groblje","gruda","grudi","gruja",
    "gusle","gvozdje",
    # H
    "hrana","hotel","harmonika","heroj","hemija","historija","horizont",
    "hambar","hangar","harfa","hektar","helikopter","hladnjak",
    "hleb","hodnik","hram","hrast","hrtina","hvala",
    # I
    "igra","internet","injekcija","instrument","ideal",
    "ikona","iluzija","imovina","indeks","industrija","inflacija",
    "instalacija","interes","investicija","iskustvo","izlaz","izlog",
    "izmak","izvor",
    # J
    "jabuka","jezik","jaje","junak","jutro","jedrilica",
    "javor","jedrenje","jela","jelen","jelka","jesen","jezero",
    "jorgovan","juha","jurnjava",
    # K
    "kuca","knjiga","kola","kamen","klima","krevet","kupatilo",
    "kanal","kapija","kapsula","karate","karton","kasarna","kaskada",
    "katedrala","katun","kazaliste","kazna","kelner","kemija","keramika",
    "klan","klaonica","klesar","klinika","klizaliste","klupa","kobac",
    "kobra","kockanje","kofer","kola","kolega","kolobara","koloseum",
    "komada","komanda","komet","kompjuter","konac","konj","koplje",
    "korak","korito","korpa","kostur","kota","kotao","kovanica",
    "kovano","koverta","kozmos","kracun","krajina","krastavac","krava",
    "krema","krivina","krizaljka","krosna","krst","kruna","kuca",
    "kuhinja","kultura","kupola","kurs","kutak",
    # L
    "lav","lopta","led","luka","lepeza","letilica","laboratorija",
    "labud","lanac","latica","lavina","lazanja","lekar","lekarna",
    "lepota","letrak","lipa","lista","livada","lobanja","loncic",
    "lopata","lorber","lotus","lukavost","luna","lutka",
    # M
    "more","muzika","motor","mapa","medal","mama","majmun","metak",
    "magnet","mahovina","malter","mast","mecava","medved","megdan",
    "menija","metak","milje","ministar","miris","misija","mleko",
    "most","motika","mucanje","murva",
    # N
    "nebo","noga","nafta","novac","noz","nauka","naziv",
    "nadnica","napad","napredak","narod","nasip","nastava","natura",
    "navika","nocas","nocnik","nozic","nula","nusprodukt",
    # O
    "ocean","olovka","okean","oganj","opera","oblak",
    "odbojka","odelo","oluja","optika","okus",
    "obala","oblik","obrazac","obraz","oblast","obveza","ocas",
    "odaja","odaziv","okret","okrug","olako","olovo","omiljena",
    "opeka","orao","ormar","osnova","ostava","ostrvo","otisak",
    "otpad","otrov","ovca","oznaka",
    # P
    "pesma","park","planina","ptica","pile","planeta","pekar","pozoriste",
    "palata","papagaj","parfem","pasta","patka","reakcija",
    "papir","parabola","parcela","pas","pasulj","patos","patrik",
    "pazar","pecivo","pegla","pehar","penal","pesnik","peta",
    "pijesak","piknik","pirat","pisac","pismo","pitanje","pizza",
    "plafon","plamen","plasticna","ples","plitvice","plovak",
    "polje","poluga","ponos","popravljac","porta","posada","posjed",
    "posto","potok","povez","pravda","predio","priča","primjer",
    "pristajaliste","proba","prolaz","prolog","prometej","prsten",
    "pukovnik","punjenje","pusta","put","puzavac",
    # R
    "reka","raketa","robot","radio","rudar","riba","rana",
    "racun","radnja","raketni","rampa","ranac","ratnik","ravnica",
    "recept","republika","ritam","ronjenje","rucak","rujan","rulman",
    "rupa","rvanje",
    # S
    "sport","skola","sunce","svemir","slika","srebro","staklo",
    "sablja","sajam","saksija","satelit","savez","sabor","sacma",
    "sahat","sakupljac","salon","samaritan","sandale","sarma","sat",
    "sava","sedlo","seizmograf","sekira","semafor","senka","sezona",
    "sinagoga","sirup","sistem","skloniste","sklop","skuter","slagalica",
    "slama","slam","slap","slast","slatkis","slavan","slavuj","slovo",
    "sluz","snaga","sneg","sofra","sokak","sokolovi","solar","solin",
    "solista","sonar","sopstvo","spavaca","specijalist","spiral",
    "sprema","srpanj","stadion","stanica","stena","stit","stol",
    "stomak","struja","stubovi","staza","sudar","sudnica","sukob",
    "sultan","suma","sundjeria","super","suton","svecana","svinja",
    "svitac","svoboda",
    # Š
    "samar","sansa","sator","sekira","sema","sidro","sijeno","sikter",
    "siljezija","sinska","sipar","sipka","siroka","skola","sljuka",
    "sljunak","smigla","spilja",
    # T
    "trava","tabla","toranj","tramvaj","tenk","tenis","tiganj","terminal",
    "talas","tamnica","tehnologija","teleskop","taktika","talac",
    "tambura","tapeta","tapir","taraba","tarifa","tasner","tatami",
    "tegljac","tema","temelj","tepih","terminal","testam","tijesto",
    "tim","tinta","torba","totem","trabant","tradicija","trampa",
    "tranzit","trasa","trofej","trup","tucija","tunel","turbo","tur",
    # U
    "ulica","umetnost","ulje","utakmica","ukus","uragan",
    "ubojstvo","ucenik","uciliste","ugalj","ugao","ugijen","uhoda",
    "ukop","ulje","uloga","umivaonik","umorstvo","unakrst","upad",
    "uprava","urada","urna","usluga","uspon","usta","uteg","utor",
    # V
    "voda","vatrogasac","voz","vazduh","vila","vojnik","vatra","volkan",
    "vajar","valuta","vampir","varijanta","velodrom",
    "valcanje","vanbracni","vanbrod","vanred","varnice","varos",
    "vaterpolo","vecera","vetar","vikend","vino","violine","virtuelnost",
    "vizija","vlada","vladavina","vlak","volan","vrata","vrba","vrh",
    "vrtlog","vuk","vunen",
    # Z
    "zemlja","zivot","zvuk","zvezda","zdravlje","zmija","zrno",
    "zakon","zaloga","zamak","zanat","zapovjednik","zasada","zavet",
    "zbirka","zemlja","zenith","zglob","zlatara","zlatnik","zoologija",
    "zrno","zubac","zurba","zvanicnik","zvezda","zvirjak","zvono",
    # Ž
    "zaba","zar","zelja","zena","zerjavica","zica","zigica","zila",
    "zirafa","zito","zlica","zlijeb","zmajevit","znacka","zvakaci",
    # Dodatne reči
    "akcija","aktivnost","akademija","akrobat","akumulator","alarm",
    "balada","bambusa","bandana","barikada","bastion","batalja",
    "cigla","cimet","cinober","cipal","cista",
    "dalekovod","damar","darovit","debata","demon","denar",
    "fabular","faceta","fanfara","fantazija","farmerica","fascinacija",
    "galop","gamepad","garderoba","gavrilovic","glacijal","gladiola",
    "habitat","haljina","hamlet","heraldika","hijena","hipodrom",
    "iguana","ikebana","ilustracija","imenik","imperija","impuls",
    "jagoda","jalija","jamb","jantar","jastuci","jastreb","jazbina",
    "kabina","kaktus","kalem","kalibar","kampanja","kamuflaža",
    "kapetan","karavan","karizma","kazino","kibla","kimono","kiosk",
    "laboja","lacman","laguna","laktat","laminat","lancun","lantana",
    "magaza","maketa","malina","malta","mango","manija","mapa",
    "naslagano","necklace","negacija","nektar","neonski","neptun",
    "odlikovanje","oglas","ograda","oklopnik","olimpijada","omot",
    "padobran","palisada","paluba","pamuk","panceta","panda","paradoks",
    "rabota","racunalo","rafineria","rajcica","rakun","ramadan",
    "sabotaza","sagan","sakura","salata","samovar","sanduk","sangria",
    "tabor","taktika","tamjan","tango","tapija","taranta","tarlatan",
    "udarna","ugarnica","ugrizati","uhapsiti","ujak","ukidanje","ulazak",
    "vagon","vajarstvo","vakuum","valcer","valenki","valija","vanbrod",
    "zanimanje","zastor","zavesa","zavitak","zeljeznica","zemnik",
    # Dodatne do 1000+
    "abeceda","adresa","agencija","agentura","aglomerat","agrar","agresija",
    "barikada","barut","baština","bataljon","bataljun","becikl","begunac",
    "cedulja","celik","ceremonia","cifra","cimer","cinjenica","cipkar",
    "darivanje","daska","datulja","debljina","deklaracija","delegat",
    "egzamen","ekipa","ekspedicija","eksplozija","ekspres","ekstrem",
    "fenjercic","filijala","fjordovi","flamingo","fotelja","fragola",
    "garson","gavrilka","geometrija","geranija","gerlica","gimastika",
    "haiku","halva","haramba","hardver","havana","hazard","hibrid",
    "jablan","jadran","jagnjece","jamica","januarno","jaruga","jasika",
    "kadenca","kalkulator","kalup","kamata","kamilica","kandza","kaplar",
    "labela","lacuga","laganum","lajbek","lakmus","laktoza","lamela",
    "mačka","maglica","magnet","majstor","maler","mamuza","mandat",
    "nabavka","nacrt","nadzornik","nakit","nalog","namaz","namjera",
    "obaveza","obavijest","obedovanje","objasniti","obnoviti","obramba",
    "padobran","palinka","pamflet","pancir","pandur","panika","paradajz",
    "rabina","radilica","radionica","ragbi","raketoplav","rakija","raspon",
    "sabac","sadroj","safran","sagrada","sakupljanje","salama","salveta",
    "tabulator","takmicar","talog","tamburica","tapkanje","tarifa","tavan",
    "ubrzanje","ugriz","ulaznica","umiranje","umivanje","unitazija","uprava",
    "vapcenje","varivo","vaterpolo","vedrina","ventilacija","veresija",
    "zadruga","zaliv","zamjenik","zapaljenje","zaposlen","zarada","zaraza",
]

def normalize(word: str) -> str:
    return (word.lower().strip()
            .replace("č","c").replace("ć","c").replace("š","s")
            .replace("ž","z").replace("đ","d").replace(" ",""))

def get_suffix(word: str, n: int = 2) -> str:
    return normalize(word)[-n:]

def count_possible(suffix: str, used: set[str]) -> int:
    return sum(1 for w in SERBIAN_WORDS if normalize(w).startswith(suffix) and normalize(w) not in used)

def word_starts_with(word: str, prefix: str) -> bool:
    return normalize(word).startswith(normalize(prefix))

def is_valid_word(word: str) -> bool:
    n = normalize(word)
    return any(normalize(w) == n for w in SERBIAN_WORDS)

def random_start_word() -> tuple[str, str, int, int]:
    random.shuffle(SERBIAN_WORDS)
    for w in SERBIAN_WORDS:
        suf = get_suffix(w)
        possible = count_possible(suf, {normalize(w)})
        if possible >= 5:
            return w, suf, possible, max(1, possible // 40)
    w = SERBIAN_WORDS[0]
    suf = get_suffix(w)
    possible = count_possible(suf, {normalize(w)})
    return w, suf, possible, 1

# ─────────────────────────────────────────────
# Stanje igara po kanalu
# ─────────────────────────────────────────────
kaladont_sessions: dict[int, dict] = {}
wordle_sessions:   dict[int, dict] = {}
toplo_sessions:    dict[int, dict] = {}
quiz_sessions:     dict[int, dict] = {}

# ─────────────────────────────────────────────
# Wordle reči (5 slova)
# ─────────────────────────────────────────────
WORDLE_WORDS = [
    "vatra","sunce","trava","kamen","pesma","crkva","tabla","bazen",
    "vrata","narod","zakon","pismo","radio","sport","mleko","hotel",
    "tajna","krava","miris","jutro","ptica","oblak","klima","pravo",
    "vlast","draga","cesta","polje","motor","banka","lampa","traka",
    "petak","senka","slika","okean","jelen","lopta","trupa","reket",
    "zmija","griva","proba","grana","korpa","kanal","papir","krilo",
    "okvir","duhan","svila","kalem","lonac","marko","nokat","otrov",
    "sapun","medal","novac","pakao","uzice","laser","avion","barka",
    "daska","ekran","forma","gazda","ikona","jasen","korak","limar",
]

def norm_wordle(w: str) -> str:
    return (w.lower().strip()
            .replace("č","c").replace("ć","c").replace("š","s")
            .replace("ž","z").replace("đ","d"))

def check_wordle_guess(guess: str, answer: str) -> list[str]:
    g = list(norm_wordle(guess))
    a = list(norm_wordle(answer))
    result = ["⬛"] * 5
    used = [False] * 5
    for i in range(5):
        if g[i] == a[i]:
            result[i] = "🟩"
            used[i] = True
    for i in range(5):
        if result[i] == "🟩":
            continue
        for j in range(5):
            if not used[j] and g[i] == a[j]:
                result[i] = "🟨"
                used[j] = True
                break
    return result

# ─────────────────────────────────────────────
# Kviz pitanja
# ─────────────────────────────────────────────
QUESTIONS = [
    {"q":"Koji je glavni grad Srbije?","opts":["Novi Sad","Niš","Beograd","Kragujevac"],"a":2,"r":100,"cat":"Geografija"},
    {"q":"Na kojoj reci leži Beograd?","opts":["Morava","Drina","Sava i Dunav","Tisa"],"a":2,"r":150,"cat":"Geografija"},
    {"q":"Koja je najduža reka na svetu?","opts":["Amazon","Nil","Jangce","Misisipi"],"a":1,"r":100,"cat":"Geografija"},
    {"q":"Koji je najveći kontinent?","opts":["Afrika","Amerika","Azija","Evropa"],"a":2,"r":100,"cat":"Geografija"},
    {"q":"Koji je glavni grad Australije?","opts":["Sidnej","Melburn","Kanbera","Brizben"],"a":2,"r":150,"cat":"Geografija"},
    {"q":"Koliko planeta ima Sunčev sistem?","opts":["7","8","9","10"],"a":1,"r":150,"cat":"Nauka"},
    {"q":"Šta je H2O?","opts":["So","Voda","Alkohol","Kiselina"],"a":1,"r":100,"cat":"Nauka"},
    {"q":"Ko je otkrio gravitaciju?","opts":["Ajnštajn","Galileo","Njutn","Kopernik"],"a":2,"r":150,"cat":"Nauka"},
    {"q":"Koji element ima simbol Au?","opts":["Srebro","Aluminijum","Zlato","Gvožđe"],"a":2,"r":200,"cat":"Nauka"},
    {"q":"Koji je najtvrdji mineral?","opts":["Rubin","Safir","Dijamant","Kvarc"],"a":2,"r":150,"cat":"Nauka"},
    {"q":"Koliko igrača ima fudbalska ekipa?","opts":["10","11","12","9"],"a":1,"r":100,"cat":"Sport"},
    {"q":"Ko drži rekord u Grand Slam titulama (muški tenis)?","opts":["Federer","Nadal","Đoković","Sinner"],"a":2,"r":150,"cat":"Sport"},
    {"q":"Koliko minuta traje fudbalska utakmica?","opts":["80","90","100","85"],"a":1,"r":100,"cat":"Sport"},
    {"q":"Koliko poena vredi trojka u košarci?","opts":["2","3","4","1"],"a":1,"r":100,"cat":"Sport"},
    {"q":"Koji rok bend je snimio 'Bohemian Rhapsody'?","opts":["Led Zeppelin","Pink Floyd","Queen","Rolling Stones"],"a":2,"r":100,"cat":"Muzika"},
    {"q":"Ko je pevao 'Thriller'?","opts":["Prince","Michael Jackson","Whitney Houston","Marvin Gaye"],"a":1,"r":100,"cat":"Muzika"},
    {"q":"Ko je bio Napoleon Bonaparte?","opts":["Kralj","Vojskovođa i car","Predsednik","Princ"],"a":1,"r":150,"cat":"Istorija"},
    {"q":"Koje godine je Kolumbo otkrio Ameriku?","opts":["1488","1492","1498","1502"],"a":1,"r":150,"cat":"Istorija"},
    {"q":"Koliko boja ima duga?","opts":["5","6","7","8"],"a":2,"r":100,"cat":"Opšte"},
    {"q":"Ko je napisao 'Romeo i Julija'?","opts":["Čoser","Šekspir","Dikens","Hemingvej"],"a":1,"r":100,"cat":"Opšte"},
    {"q":"Koji je najbrži kopneni sisavac?","opts":["Lav","Gepard","Antilopa","Konj"],"a":1,"r":150,"cat":"Opšte"},
    {"q":"Ko je osnivač Apple?","opts":["Bil Gejts","Ilon Musk","Stiv Džobs","Jeff Bezos"],"a":2,"r":100,"cat":"Tehnologija"},
    {"q":"U kojoj godini je osnovan Google?","opts":["1995","1997","1998","2000"],"a":2,"r":150,"cat":"Tehnologija"},
    {"q":"Koji srpski igrač je poznat kao 'Nole'?","opts":["Viktor Troicki","Janko Tipsarević","Novak Đoković","Nenad Zimonjić"],"a":2,"r":100,"cat":"Sport"},
    {"q":"Od čega se pravi ajvar?","opts":["Paradajz","Paprika","Patlidžan","Tikvica"],"a":1,"r":100,"cat":"Hrana"},
    {"q":"Koji alkohol je karakterističan za Srbiju?","opts":["Viski","Votka","Rakija","Džin"],"a":2,"r":100,"cat":"Hrana"},
    {"q":"Koje godine je pao Berlinski zid?","opts":["1985","1989","1991","1993"],"a":1,"r":150,"cat":"Istorija"},
    {"q":"Ko je bio lider Prve srpske revolucije?","opts":["Miloš Obrenović","Karađorđe","Vuk Karadžić","Dositej"],"a":1,"r":200,"cat":"Istorija"},
    {"q":"Koji je hemijski simbol za natrijum?","opts":["N","Na","Nt","Nm"],"a":1,"r":200,"cat":"Nauka"},
    {"q":"Koliko igrača ima odbojkaška ekipa?","opts":["5","6","7","8"],"a":1,"r":100,"cat":"Sport"},
]

channel_used_questions: dict[int, set[int]] = {}

def get_random_question(channel_id: int) -> dict | None:
    used = channel_used_questions.setdefault(channel_id, set())
    available = [q for i, q in enumerate(QUESTIONS) if i not in used]
    if not available:
        channel_used_questions[channel_id] = set()
        available = QUESTIONS[:]
    q = random.choice(available)
    used.add(QUESTIONS.index(q))
    return q

# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────
def embed(title: str, desc: str = "", footer: str = "") -> discord.Embed:
    e = discord.Embed(title=title, description=desc, color=EMBED_COLOR)
    if footer:
        e.set_footer(text=footer)
    return e

# ─────────────────────────────────────────────
# Kaladont logika
# ─────────────────────────────────────────────
async def send_kaladont_word(channel: discord.TextChannel, word: str, suffix: str, possible: int, to_win: int) -> None:
    e = embed(
        f"**{word.upper()}**",
        f"• **Mogućih reči:** {possible}\n• **Za pobedu:** {to_win}",
        f"Napiši reč koja počinje sa {suffix.upper()}"
    )
    await channel.send(embed=e)

# ─────────────────────────────────────────────
# Slash/prefix komande
# ─────────────────────────────────────────────
# ─────────────────────────────────────────────
# /set slash komanda
# ─────────────────────────────────────────────
set_group = discord.app_commands.Group(name="set", description="Podesi kanale za igre (samo admini)")

@set_group.command(name="kanal", description="Dodaj kanal za određenu igru")
@discord.app_commands.describe(
    igra="Ime igre (kaladont/wordle/toplo/quiz/slots/sve)",
    kanal="Kanal koji dozvoljavaš za igru"
)
@discord.app_commands.checks.has_permissions(administrator=True)
async def set_kanal(interaction: discord.Interaction, igra: str, kanal: discord.TextChannel):
    igra = igra.lower()
    if igra not in GAME_NAMES:
        await interaction.response.send_message(
            f"❌ Nepoznata igra: **{igra}**\nDostupne: `kaladont`, `wordle`, `toplo`, `quiz`, `slots`, `sve`",
            ephemeral=True
        )
        return
    if igra == "sve":
        for g in ["kaladont","wordle","toplo","quiz","slots"]:
            add_channel_to_game(interaction.guild_id, kanal.id, g)
        e = embed("✅ Kanali postavljeni", f"Sve igre su dodijeljene kanalu {kanal.mention}", "Sve igre se sada mogu igrati samo tamo")
    else:
        add_channel_to_game(interaction.guild_id, kanal.id, igra)
        e = embed("✅ Kanal postavljen", f"**{GAME_NAMES[igra]}** se sada može igrati u {kanal.mention}", f"Koristi /set prikazi da vidiš sve kanale")
    await interaction.response.send_message(embed=e)

@set_group.command(name="ukloni", description="Ukloni kanal iz igre")
@discord.app_commands.describe(
    igra="Ime igre",
    kanal="Kanal koji uklanjаš"
)
@discord.app_commands.checks.has_permissions(administrator=True)
async def set_ukloni(interaction: discord.Interaction, igra: str, kanal: discord.TextChannel):
    igra = igra.lower()
    if igra not in GAME_NAMES:
        await interaction.response.send_message(f"❌ Nepoznata igra: **{igra}**", ephemeral=True)
        return
    ok = remove_channel_from_game(interaction.guild_id, kanal.id, igra)
    if ok:
        e = embed("✅ Kanal uklonjen", f"{kanal.mention} više nije dozvoljen za **{GAME_NAMES[igra]}**")
    else:
        e = embed("❌ Nije pronađeno", f"{kanal.mention} nije bio u listi za **{GAME_NAMES[igra]}**")
    await interaction.response.send_message(embed=e)

@set_group.command(name="resetuj", description="Ukloni sva ograničenja kanala za igru (igra dostupna svuda)")
@discord.app_commands.describe(igra="Ime igre (ili 'sve' za reset svega)")
@discord.app_commands.checks.has_permissions(administrator=True)
async def set_resetuj(interaction: discord.Interaction, igra: str):
    igra = igra.lower()
    if igra == "sve":
        for g in ["kaladont","wordle","toplo","quiz","slots"]:
            reset_game_channels(interaction.guild_id, g)
        e = embed("✅ Reset", "Sva ograničenja kanala su uklonjena.\nSvaka igra se može igrati u bilo kom kanalu.")
    elif igra in GAME_NAMES:
        reset_game_channels(interaction.guild_id, igra)
        e = embed("✅ Reset", f"**{GAME_NAMES[igra]}** se sada može igrati u bilo kom kanalu.")
    else:
        await interaction.response.send_message(f"❌ Nepoznata igra: **{igra}**", ephemeral=True)
        return
    await interaction.response.send_message(embed=e)

@set_group.command(name="prikazi", description="Prikaži koje igre su dozvoljene u kojim kanalima")
async def set_prikazi(interaction: discord.Interaction):
    g = str(interaction.guild_id)
    config = _channel_config.get(g, {})
    if not config:
        await interaction.response.send_message(embed=embed("📋 Podešavanja kanala", "Nema ograničenja — sve igre se mogu igrati u svim kanalima.\n\nKoristi `/set kanal` da dodaš ograničenje."), ephemeral=True)
        return
    e = embed("📋 Podešavanja kanala")
    for game_key, channel_ids in config.items():
        if not channel_ids:
            continue
        channels_str = " ".join(f"<#{cid}>" for cid in channel_ids)
        e.add_field(name=GAME_NAMES.get(game_key, game_key), value=channels_str, inline=False)
    if not e.fields:
        e.description = "Nema ograničenja — sve igre se mogu igrati u svim kanalima."
    await interaction.response.send_message(embed=e, ephemeral=True)

@set_group.error
async def set_error(interaction: discord.Interaction, error):
    if isinstance(error, discord.app_commands.MissingPermissions):
        await interaction.response.send_message("❌ Nemaš **Administrator** dozvolu za ovu komandu!", ephemeral=True)

bot.tree.add_command(set_group)

@bot.event
async def on_ready():
    load_economy()
    load_channel_config()
    try:
        synced = await bot.tree.sync()
        print(f"✅ Slash komande sinhronizovane: {len(synced)}")
    except Exception as e:
        print(f"⚠️  tree.sync greška: {e}")
    print(f"✅ Bot spreman: {bot.user} | Prefix: {PREFIX}")

@bot.event
async def on_message(message: discord.Message):
    if message.author.bot:
        return
    if not message.guild:
        return

    # Process prefix commands first
    await bot.process_commands(message)
    if message.content.startswith(PREFIX):
        return

    content = message.content.strip()
    channel_id = message.channel.id
    user_id = str(message.author.id)

    # Quiz odgovor (A/B/C/D)
    if channel_id in quiz_sessions:
        sess = quiz_sessions[channel_id]
        if content.upper() in ("A","B","C","D"):
            idx = "ABCD".index(content.upper())
            q = sess["question"]
            correct_text = q["opts"][q["a"]]
            if idx == q["a"]:
                reward = q["r"]
                add_balance(user_id, reward)
                del quiz_sessions[channel_id]
                e = embed("✅ Tačno!", f"{message.author.mention} je tačno odgovorio/la!\n\nOdgovor: **{correct_text}**\nZarada: {fmt_money(reward)}", "Koristi -quiz za sledeće pitanje")
                await message.reply(embed=e)
            else:
                del quiz_sessions[channel_id]
                e = embed("❌ Netačno!", f"{message.author.mention} nije pogodio/la.\n\nTačan odgovor: **{correct_text}**", "Koristi -quiz za sledeće pitanje")
                await message.reply(embed=e)
            return

    # Wordle guess (5 slova)
    if channel_id in wordle_sessions:
        sess = wordle_sessions[channel_id]
        nw = norm_wordle(content)
        if len(nw) == 5 and nw.isalpha():
            answer = sess["answer"]
            norm_ans = norm_wordle(answer)

            if nw in sess["guesses_norm"]:
                r = await message.reply("❌ Već si pogodio/la tu reč!")
                await asyncio.sleep(4)
                await r.delete()
                return

            result = check_wordle_guess(content, answer)
            sess["guesses"].append(content.upper())
            sess["guesses_norm"].append(nw)
            sess["results"].append(result)

            rows = "\n".join(
                f"{''.join(row)} {' '.join(list(g))}"
                for row, g in zip(sess["results"], sess["guesses"])
            )
            remaining = 6 - len(sess["guesses"])
            empty = "\n".join(["⬛⬛⬛⬛⬛"] * remaining)
            display = rows + ("\n" + empty if empty else "")

            if all(r == "🟩" for r in result):
                reward = max(50, 250 - (len(sess["guesses"]) - 1) * 40)
                add_balance(user_id, reward)
                del wordle_sessions[channel_id]
                e = embed("🎉 Tačno!", f"{display}\n\n{message.author.mention} pogodio/la za **{len(sess['guesses'])}** {'pokušaj' if len(sess['guesses'])==1 else 'pokušaja'}!\nNagrada: {fmt_money(reward)}", "Koristi -wordle za novu igru")
                await message.reply(embed=e)
                return

            if len(sess["guesses"]) >= 6:
                del wordle_sessions[channel_id]
                e = embed("💀 Niste pogodili!", f"{display}\n\nReč je bila: **{answer.upper()}**\n\nKoristi **-wordle** za novu igru!", "Srećom sledeći put!")
                await message.reply(embed=e)
                return

            e = embed("🟩 Wordle", f"{display}\n\n*Preostalo pokušaja: {remaining}*", "Nastavite da pogađate!")
            await message.reply(embed=e)
            return

    # Toplo/Klanno guess (broj)
    if channel_id in toplo_sessions:
        if content.isdigit():
            sess = toplo_sessions[channel_id]
            guess = int(content)
            if guess < 1 or guess > 100:
                return
            answer = sess["answer"]
            distance = abs(guess - answer)

            if guess == answer:
                reward = 150
                add_balance(user_id, reward)
                del toplo_sessions[channel_id]
                e = embed("🎯 Tačno pogodio!", f"🔥🔥🔥 {message.author.mention} je pogodio/la broj **{answer}**!\n\nNagrada: {fmt_money(reward)}\nUkupno pokušaja: **{len(sess['guesses'])+1}**", "Koristi .toplo za novu igru")
                await message.reply(embed=e)
                return

            sess["guesses"].append(guess)
            if guess < answer:
                sess["min_range"] = max(sess["min_range"], guess + 1)
            else:
                sess["max_range"] = min(sess["max_range"], guess - 1)

            if distance <= 3:   label, emoji = "VRELO!", "🔥🔥🔥"
            elif distance <= 7:  label, emoji = "Toplo", "🔥🔥"
            elif distance <= 15: label, emoji = "Malo toplo", "🔥"
            elif distance <= 25: label, emoji = "Neutralno", "🌡️"
            elif distance <= 40: label, emoji = "Hladno", "❄️"
            elif distance <= 60: label, emoji = "Veoma hladno", "❄️❄️"
            else:                label, emoji = "LEDENO!", "🧊🧊🧊"

            direction = "⬆️ Više!" if answer > guess else "⬇️ Niže!"
            e = embed(f"{emoji} {label}", f"{message.author.mention} je rekao **{guess}** — {direction}\n\nOpseg: **{sess['min_range']} — {sess['max_range']}**")
            await message.reply(embed=e)
            return

    # Kaladont reč
    if channel_id in kaladont_sessions:
        sess = kaladont_sessions[channel_id]
        word = content
        if word.startswith("-") or " " in word or not word:
            return

        norm = normalize(word)

        if norm in sess["used"]:
            await message.add_reaction("❌")
            r = await message.reply(f"**{word.upper()}** je već iskorišćena! Pokušaj drugu reč.")
            await asyncio.sleep(5)
            await r.delete()
            return

        if not word_starts_with(word, sess["suffix"]):
            await message.add_reaction("❌")
            r = await message.reply(f"Reč mora početi sa **{sess['suffix'].upper()}**!")
            await asyncio.sleep(5)
            await r.delete()
            return

        if not is_valid_word(word):
            await message.add_reaction("❌")
            r = await message.reply(f"**{word.upper()}** nije validna reč! Pokušajte neku drugu reč!")
            await asyncio.sleep(5)
            await r.delete()
            return

        sess["used"].add(norm)
        sess["scores"][user_id] = sess["scores"].get(user_id, 0) + 1
        await message.add_reaction("✅")

        if sess["scores"][user_id] >= sess["to_win"]:
            reward = 500
            add_balance(user_id, reward)
            del kaladont_sessions[channel_id]
            e = embed("🎉 Pobednik!", f"{message.author.mention} je pobedio/la sa rečju **{word.upper()}**!\n\nNagrada: {fmt_money(reward)}", "Kaladont • Koristi -kaladont za novu igru")
            await message.channel.send(embed=e)
            return

        new_suffix = get_suffix(word)
        possible = count_possible(new_suffix, sess["used"])
        new_to_win = max(1, possible // 40)
        sess["current"] = word
        sess["suffix"] = new_suffix
        sess["possible"] = possible
        sess["to_win"] = new_to_win

        score = sess["scores"][user_id]
        score_label = "poen" if score == 1 else "poena"
        e = embed(
            f"**{word.upper()}**",
            f"• **Mogućih reči:** {possible}\n• **Za pobedu:** {new_to_win}\n\n**{score} {score_label}**",
            f"Napiši reč koja počinje sa {new_suffix.upper()}"
        )
        await message.channel.send(embed=e)

# ─────────────────────────────────────────────
# Komande
# ─────────────────────────────────────────────
# Helper za provjeru kanala
# ─────────────────────────────────────────────
async def check_channel(ctx: commands.Context, game: str) -> bool:
    if not ctx.guild:
        return True
    if is_channel_allowed(ctx.guild.id, ctx.channel.id, game):
        return True
    allowed = get_allowed_channels(ctx.guild.id, game)
    channels_str = " ".join(f"<#{cid}>" for cid in allowed)
    e = embed(
        f"❌ Pogrešan kanal",
        f"**{GAME_NAMES.get(game, game)}** se može igrati samo u:\n{channels_str}",
        "Admin može promijeniti kanale sa /set kanal"
    )
    await ctx.reply(embed=e, delete_after=8)
    return False


@bot.command(name="kaladont", aliases=["k"])
async def cmd_kaladont(ctx: commands.Context, sub: str = ""):
    cid = ctx.channel.id

    if sub.lower() == "stop":
        if cid not in kaladont_sessions:
            await ctx.reply("❌ Nema aktivne igre.")
            return
        sess = kaladont_sessions.pop(cid)
        scores = sorted(sess["scores"].items(), key=lambda x: x[1], reverse=True)
        score_str = "\n".join(f"{i+1}. <@{uid}> — **{s}** poena" for i,(uid,s) in enumerate(scores[:5])) or "Niko nije skupio poene."
        e = embed("🛑 Igra zaustavljena", score_str, "Koristi -kaladont za novu igru")
        await ctx.reply(embed=e)
        return

    if sub.lower() == "status":
        if cid not in kaladont_sessions:
            await ctx.reply("❌ Nema aktivne igre.")
            return
        sess = kaladont_sessions[cid]
        e = embed(f"**{sess['current'].upper()}**", f"• **Mogućih reči:** {sess['possible']}\n• **Za pobedu:** {sess['to_win']}\n• **Iskorišćeno:** {len(sess['used'])}", f"Napiši reč koja počinje sa {sess['suffix'].upper()}")
        await ctx.reply(embed=e)
        return

    if not await check_channel(ctx, "kaladont"):
        return

    if cid in kaladont_sessions:
        sess = kaladont_sessions[cid]
        e = embed(f"**{sess['current'].upper()}**", f"Igra već teče! Napiši reč koja počinje sa **{sess['suffix'].upper()}**\n\n• **Mogućih reči:** {sess['possible']}\n• **Za pobedu:** {sess['to_win']}", "Kaladont • Piši reči direktno u chat!")
        await ctx.reply(embed=e)
        return

    word, suffix, possible, to_win = random_start_word()
    kaladont_sessions[cid] = {"current": word, "suffix": suffix, "possible": possible, "to_win": to_win, "used": {normalize(word)}, "scores": {}}
    e = embed(f"**{word.upper()}**", f"• **Mogućih reči:** {possible}\n• **Za pobedu:** {to_win}", f"Napiši reč koja počinje sa {suffix.upper()}")
    await ctx.reply(embed=e)


@bot.command(name="wordle", aliases=["w"])
async def cmd_wordle(ctx: commands.Context, sub: str = ""):
    cid = ctx.channel.id

    if sub.lower() == "stop":
        if cid not in wordle_sessions:
            await ctx.reply("❌ Nema aktivne Wordle igre.")
            return
        sess = wordle_sessions.pop(cid)
        await ctx.reply(f"Igra zaustavljena. Reč je bila: **{sess['answer'].upper()}**")
        return

    if not await check_channel(ctx, "wordle"):
        return

    if cid in wordle_sessions:
        await ctx.reply("❌ Wordle već teče! Pogodite reč od 5 slova.")
        return

    answer = random.choice(WORDLE_WORDS)
    wordle_sessions[cid] = {"answer": answer, "guesses": [], "guesses_norm": [], "results": []}
    grid = "\n".join(["⬛⬛⬛⬛⬛"] * 6)
    e = embed("🟩 Wordle — Pogodi reč!",
              f"Pogodite srpsku reč od **5 slova** u 6 pokušaja!\n\n{grid}\n\n"
              "🟩 Tačno slovo, tačna pozicija\n🟨 Tačno slovo, pogrešna pozicija\n⬛ Slovo nije u reči",
              "Pišite reči direktno u chat!")
    await ctx.reply(embed=e)


@bot.command(name="toplo", aliases=["t"])
async def cmd_toplo(ctx: commands.Context, sub: str = ""):
    cid = ctx.channel.id

    if sub.lower() == "stop":
        if cid not in toplo_sessions:
            await ctx.reply("❌ Nema aktivne igre.")
            return
        sess = toplo_sessions.pop(cid)
        await ctx.reply(f"Igra zaustavljena. Broj je bio: **{sess['answer']}**")
        return

    if not await check_channel(ctx, "toplo"):
        return

    if cid in toplo_sessions:
        await ctx.reply("❌ Toplo/Klanno već teče! Pogodite broj od 1 do 100.")
        return

    answer = random.randint(1, 100)
    toplo_sessions[cid] = {"answer": answer, "guesses": [], "min_range": 1, "max_range": 100}
    e = embed("🌡️ Toplo / Klanno",
              "Zamislio sam broj od **1 do 100**!\n\nPogodite koji je — pišite brojeve direktno u chat!\n\n"
              "🔥🔥🔥 **VRELO** — razlika ≤ 3\n🔥🔥 **Toplo** — razlika ≤ 7\n🔥 **Malo toplo** — razlika ≤ 15\n"
              "🌡️ **Neutralno** — razlika ≤ 25\n❄️ **Hladno** — razlika ≤ 40\n❄️❄️ **Veoma hladno** — razlika ≤ 60\n"
              "🧊🧊🧊 **LEDENO** — razlika > 60",
              "Piši brojeve direktno u chat!")
    await ctx.reply(embed=e)


@bot.command(name="quiz", aliases=["kviz"])
async def cmd_quiz(ctx: commands.Context):
    cid = ctx.channel.id

    if not await check_channel(ctx, "quiz"):
        return

    if cid in quiz_sessions:
        await ctx.reply("❌ Kviz već teče! Odgovorite sa A, B, C ili D.")
        return

    q = get_random_question(cid)
    if not q:
        await ctx.reply("✅ Prošli ste sva pitanja! Resetujem...")
        return

    quiz_sessions[cid] = {"question": q}
    opts = "\n".join(f"**{l}.** {o}" for l, o in zip("ABCD", q["opts"]))
    e = embed(f"❓ Kviz — {q['cat']}", f"**{q['q']}**\n\n{opts}\n\n💰 Nagrada: {fmt_money(q['r'])}", "Odgovorite sa A, B, C ili D • 30s")

    async def timeout():
        await asyncio.sleep(30)
        if cid in quiz_sessions and quiz_sessions[cid]["question"] is q:
            del quiz_sessions[cid]
            e2 = embed("⏰ Vreme isteklo!", f"Tačan odgovor: **{q['opts'][q['a']]}**", "Koristi -quiz za novo pitanje")
            await ctx.channel.send(embed=e2)

    asyncio.create_task(timeout())
    await ctx.reply(embed=e)


SLOT_SYMBOLS = ["🍒","🍋","🍊","🍇","⭐","7️⃣","💎"]

@bot.command(name="slots", aliases=["slot","aparat"])
async def cmd_slots(ctx: commands.Context, amount: str = "100"):
    if not await check_channel(ctx, "slots"):
        return

    user_id = str(ctx.author.id)
    balance = get_balance(user_id)

    if amount.lower() in ("sve","all"):
        bet = min(balance, 10000)
    else:
        try:
            bet = int(amount)
        except ValueError:
            await ctx.reply("❌ Nevalidan iznos! Npr: `-slots 500`")
            return

    if bet <= 0:
        await ctx.reply("❌ Ulog mora biti pozitivan!")
        return
    if bet > 10000:
        await ctx.reply(f"❌ Maksimalan ulog je {fmt_money(10000)}!")
        return
    if balance < bet:
        await ctx.reply(f"❌ Nemate dovoljno! Balans: {fmt_money(balance)}")
        return

    deduct_balance(user_id, bet)
    reels = [random.choice(SLOT_SYMBOLS) for _ in range(3)]
    a, b, c = reels

    if a == b == c:
        mult = {"💎":50,"7️⃣":20,"⭐":10}.get(a, 5)
        label = {"💎":"💎 DIJAMANTSKI DŽEKPOT 💎","7️⃣":"7️⃣ SEDMICE 7️⃣","⭐":"⭐ ZVEZDE ⭐"}.get(a,"Tri ista! 🎉")
    elif a==b or b==c or a==c:
        mult, label = 1.5, "Dva ista 👌"
    else:
        mult, label = 0, "Nema dobitka 😔"

    if mult > 0:
        win = int(bet * mult)
        add_balance(user_id, win)
        profit = win - bet
        desc = (f"{a}  ┃  {b}  ┃  {c}\n\n**{label}**\n\n"
                f"Dobitak: {fmt_money(win)}\nProfit: {'+' if profit>=0 else ''}{fmt_money(profit)}\n"
                f"Novi balans: {fmt_money(get_balance(user_id))}")
    else:
        desc = (f"{a}  ┃  {b}  ┃  {c}\n\n**{label}**\n\n"
                f"Izgubili ste: {fmt_money(bet)}\nNovi balans: {fmt_money(get_balance(user_id))}")

    e = embed("🎰 Slot Mašina", desc, f"Ulog: {bet} 💵 • {ctx.author.name}")
    await ctx.reply(embed=e)


@bot.command(name="pare", aliases=["novcanik","balans","balance"])
async def cmd_pare(ctx: commands.Context):
    bal = get_balance(str(ctx.author.id))
    e = embed(f"💰 Novčanik — {ctx.author.display_name}", f"Vaš trenutni balans:\n\n# {fmt_money(bal)}", "Zaradite više sa -quiz -slots -kaladont -wordle")
    e.set_thumbnail(url=ctx.author.display_avatar.url)
    await ctx.reply(embed=e)


@bot.command(name="lestvica", aliases=["top","leaderboard"])
async def cmd_lestvica(ctx: commands.Context):
    top = top_balances(10)
    if not top:
        await ctx.reply("Niko nema novca još!")
        return
    medals = ["🥇","🥈","🥉"]
    lines = [f"{medals[i] if i<3 else f'**{i+1}.**'} <@{uid}> — {fmt_money(bal)}" for i,(uid,bal) in enumerate(top)]
    e = embed("🏆 Tabela najbogatijih", "\n".join(lines), "Igraj igrice da zaradiš više!")
    await ctx.reply(embed=e)


@bot.command(name="pomoc", aliases=["help","komande"])
async def cmd_pomoc(ctx: commands.Context):
    e = embed("📖 Kefalo Bot — Sve komande")
    e.add_field(name="🎮 Igre", value=(
        "`-kaladont` — Kaladont (lančanje reči)\n"
        "`-kaladont stop` — Zaustavi\n"
        "`-wordle` — Pogodi reč od 5 slova\n"
        "`-toplo` — Pogodi broj 1-100\n"
        "`-quiz` — Kviz pitanje"
    ), inline=False)
    e.add_field(name="🎰 Kockanje", value=(
        "`-slots` — Slot mašina (ulog 100 💵)\n"
        "`-slots [iznos]` — Vlastiti ulog\n"
        "`-slots sve` — All-in!"
    ), inline=False)
    e.add_field(name="💰 Ekonomija", value=(
        "`-pare` / `-novcanik` — Provjeri balans\n"
        "`-lestvica` — Top 10 igrača"
    ), inline=False)
    e.add_field(name="⚙️ Admin", value=(
        "`/set kanal` — Postavi kanal za igru\n"
        "`/set ukloni` — Ukloni kanal iz igre\n"
        "`/set resetuj` — Ukloni sva ograničenja\n"
        "`/set prikazi` — Prikaži podešavanja"
    ), inline=False)
    e.add_field(name="💡 Nagrade", value=(
        "Kaladont pobeda = **500 💵**\n"
        "Wordle = **50–250 💵**\n"
        "Toplo/Klanno = **150 💵**\n"
        "Kviz = **100–300 💵**\n"
        "Slots = zavisi od uloga i sreće!"
    ), inline=False)
    await ctx.reply(embed=e)


@bot.command(name="status")
async def cmd_status(ctx: commands.Context):
    cid = ctx.channel.id
    lines = []
    if cid in kaladont_sessions:
        s = kaladont_sessions[cid]
        lines.append(f"🔠 **Kaladont** — aktivna (reč: {s['current'].upper()})")
    if cid in wordle_sessions:
        s = wordle_sessions[cid]
        lines.append(f"🟩 **Wordle** — aktivna ({len(s['guesses'])}/6 pokušaja)")
    if cid in toplo_sessions:
        lines.append("🌡️ **Toplo/Klanno** — aktivna")
    if cid in quiz_sessions:
        lines.append("❓ **Kviz** — čeka odgovor")
    if not lines:
        lines.append("Nema aktivnih igara u ovom kanalu.")
    await ctx.reply("\n".join(lines))


if __name__ == "__main__":
    if not TOKEN:
        print("❌ Nedostaje DISCORD_BOT_TOKEN environment varijabla!")
        print("   Postavi: export DISCORD_BOT_TOKEN=tvoj_token")
        exit(1)
    bot.run(TOKEN)
