export const SERBIAN_WORDS: string[] = [
  "automobil", "avion", "autobus", "arhitektura", "ananas", "atom", "armija", "avet",
  "brod", "banka", "biblioteka", "bicikl", "burza", "bomba", "barut", "boja",
  "crkva", "cvet", "cigareta", "cipela", "centar", "crta", "cena", "cesar",
  "drvo", "dvorac", "dim", "dijamant", "duga", "drug", "duvan", "djubre",
  "elektricitet", "ekonomija", "ekran", "enercija", "era", "epoha",
  "fabrika", "film", "fudbal", "formula", "fenjer", "filozofija", "fizika",
  "grad", "gora", "grob", "guma", "glas", "gladijator", "galaksija", "gitara",
  "hrana", "hotel", "harmonika", "heroj", "hemija", "historija", "horizont",
  "igra", "internet", "injekcija", "instrument", "imitacija", "ideal",
  "jabuka", "jezik", "jaje", "junak", "jutro", "jedrilica", "jezer",
  "kuca", "knjiga", "kola", "kamen", "klima", "konjic", "krevet", "kupatilo",
  "lav", "lopta", "led", "luka", "lepeza", "letilica", "laboratorija", "litar",
  "more", "muzika", "motor", "mapa", "medal", "mama", "majmun", "metak",
  "nebo", "noga", "nafta", "novac", "noz", "nauka", "naziv", "norma",
  "ocean", "olovka", "okean", "oganj", "opera", "oblak", "osnova",
  "pesma", "park", "planina", "ptica", "pile", "planeta", "pekar", "pozoriste",
  "reka", "raketa", "robot", "radio", "rijeka", "rudar", "riba", "rana",
  "sport", "skola", "sunce", "svemir", "svesnost", "slika", "srebro", "staklo",
  "trava", "tabla", "toranj", "tramvaj", "tenk", "tenis", "tiganj", "terminal",
  "ulica", "umetnost", "ulje", "utakmica", "ukus", "uniform", "uragan",
  "voda", "vatrogasac", "voz", "vazduh", "vila", "vojnik", "vatra", "volkan",
  "zemlja", "zivot", "zvuk", "zvezda", "zdravlje", "zmija", "zrak", "zub",
  "akcija", "algebra", "algoritam", "amino", "amnezija",
  "bazen", "beton", "bezdan", "bioskop", "blast", "blato", "blazina",
  "cirkus", "clan", "clanstvo", "cigla", "cepelin", "celik",
  "данак", "daska", "deblo", "delfin", "demokratija", "detalj", "dijeta",
  "egzistencija", "element", "emisija", "energija", "esej", "evolucija",
  "fenomen", "festival", "figura", "fraza", "frizerka", "furija",
  "galerija", "geograf", "geolozi", "globus", "gorivo", "gospost", "grad",
  "heroin", "hobotnica", "hodnik", "hologram", "hormoni", "hospital",
  "ikona", "iluzija", "imovina", "informacija", "inhibitor", "instalacija",
  "jagoda", "jazbina", "jedrenje", "jedinica", "jelen", "jesenji",
  "kafana", "kanal", "kapija", "kapsula", "karate", "karton", "katapult",
  "ladja", "lahor", "lakat", "lampa", "lansiranje", "lavina", "lebdenje",
  "magnet", "mahovina", "maketa", "malter", "marmor", "masina", "matematika",
  "namestaj", "nanotehnologija", "natura", "navigacija", "nebo", "nit",
  "odbojka", "odelo", "odred", "oglas", "okvir", "oluja", "optika",
  "palata", "pancir", "papagaj", "parfem", "parkour", "pasta", "patka",
  "reakcija", "recept", "reflektor", "republika", "rezervat", "ritam",
  "sablja", "sajam", "saksija", "satelit", "savet", "sekunda", "semafor",
  "tačka", "talas", "tamnica", "tapiserija", "taxa", "tehnologija", "teleskop",
  "udar", "ugljenek", "ukras", "umivaonik", "uputstvo", "utisak",
  "vajar", "valuta", "vampir", "varijanta", "vatra", "vek", "velodrom",
  "zastava", "zavet", "zdravlje", "zenit", "zlato", "zoologija", "zrno",
  "atom", "bakar", "biser", "celik", "dijamant", "elektron", "fosfor",
  "gvozdje", "helij", "jodin", "kalcij", "litij", "magnezij", "nitrogen",
  "oksigen", "platina", "radijum", "selen", "titan", "uranij", "vanadij",
  "ksenon", "ytterbij", "zirkoni",
  "Afrika", "Amerika", "Antarktik", "Arktik", "Australija", "Azija",
  "Balkan", "Britanija", "Beograd", "Berlin", "Bogota", "Bruselas",
  "Crna", "Dalmacija", "Dunav", "Dubai",
  "Egipat", "Ekvador", "Etiopija",
  "Finska", "Francuska", "Frankfurt",
  "Genova", "Gibraltar", "Gruzija",
  "Havaji", "Helsinki", "Himalaji", "Hrvatska",
  "Indija", "Iran", "Irak", "Irska", "Italija", "Istanbul",
  "Japan", "Jordanija", "Jugoistok",
  "Kina", "Kongo", "Koreja", "Kosovo", "Kuba",
  "London", "Lisabon",
  "Madrid", "Malta", "Maroko", "Meksiko", "Moldavija", "Mongolija",
  "Nigerija", "Norveska", "Novi Sad",
  "Oman", "Oslo",
  "Pakistan", "Panama", "Pariz", "Peru", "Poljska", "Portugal",
  "Rim", "Rumunija", "Rusija",
  "Sarajevo", "Skoplje", "Slovenija", "Srbija", "Sudan", "Svedska", "Svicarska",
  "Tajvan", "Tajland", "Tanzanija", "Turska",
  "Ukrajna", "Urugvaj",
  "Vatikan", "Venecija", "Venecuela", "Vijetnam",
  "Zagreb", "Zanzibar", "Zimbabve",
];

export function normalizeWord(word: string): string {
  return word
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[čć]/g, "c")
    .replace(/[šš]/g, "s")
    .replace(/[žž]/g, "z")
    .replace(/[đd]/g, "d")
    .replace(/\s+/g, " ");
}

export function getLastLetters(word: string, count: number = 2): string {
  const normalized = normalizeWord(word).replace(/\s/g, "");
  return normalized.slice(-count);
}

export function wordStartsWith(word: string, prefix: string): boolean {
  const normalizedWord = normalizeWord(word).replace(/\s/g, "");
  const normalizedPrefix = normalizeWord(prefix);
  return normalizedWord.startsWith(normalizedPrefix);
}

export function countPossibleWords(suffix: string, usedWords: Set<string>): number {
  const normalizedSuffix = normalizeWord(suffix);
  return SERBIAN_WORDS.filter(w => {
    const norm = normalizeWord(w).replace(/\s/g, "");
    return norm.startsWith(normalizedSuffix) && !usedWords.has(normalizeWord(w));
  }).length;
}

export function isValidWord(word: string): boolean {
  const normalizedInput = normalizeWord(word);
  return SERBIAN_WORDS.some(w => normalizeWord(w) === normalizedInput);
}
