export const WORDLE_WORDS: string[] = [
  "vatra", "sunce", "trava", "kamen", "pesma", "crkva", "tabla", "bazen",
  "vrata", "narod", "zakon", "pismo", "radio", "sport", "mleko", "hotel",
  "tajna", "krava", "miris", "jutro", "ptica", "oblak", "klima", "pravo",
  "vlast", "draga", "cesta", "polje", "motor", "banka", "lampa", "traka",
  "petak", "senka", "slika", "okean", "jelen", "lopta", "trupa", "reket",
  "zmija", "griva", "proba", "grana", "korpa", "kanal", "papir", "krilo",
  "okvir", "duhan", "svila", "povod", "sabla", "letec", "metak", "pruga",
  "zemla", "metla", "rebra", "sabor", "jedro", "bunar", "pazar", "kofer",
  "plaza", "vetar", "zubac", "rumen", "snaga", "trzon", "nocat", "kucak",
  "blato", "crvak", "ormar", "priča", "sreca", "vlaga", "opeka", "volan",
  "tepih", "salon", "kanta", "ruban", "beton", "proba", "sapun", "medal",
  "novac", "pakao", "uzice", "lahor", "barut", "laser", "avion", "barka",
  "daska", "ekran", "forma", "gazda", "halva", "ikona", "jasen", "korak",
  "limar", "makar", "nikad", "orada", "patos", "rukav", "sulud", "torba",
  "udica", "viganj", "zlato", "ambis",
];

export const WORDLE_VALID_GUESSES: string[] = [
  ...WORDLE_WORDS,
  "abrak", "alarm", "balet", "celac", "dobro", "eager", "fabla", "gedan",
  "hlada", "inace", "jabuk", "kalem", "lonac", "marko", "nokat", "otrov",
  "pazar", "rujan", "sutra", "taman", "ubogi", "vazan", "wolga", "zapad",
  "zanos", "besan", "crven", "damar", "epoha", "fakir", "gonič", "humor",
  "imati", "jazav", "klada", "lisac", "mazga", "nikla", "obala", "piton",
  "rabat", "savez", "takac", "ubrus", "vedro", "wilma", "xenia", "yupik",
  "zanat", "basin", "carka", "decak", "elita", "faktu", "grdan", "hilom",
  "imela", "junak", "katan", "lupež", "mačka", "nubuk", "oglas", "plima",
  "rulet", "seoba", "talent", "uboda", "vajar", "zavet", "biser", "citav",
  "divot", "endem", "fanfa", "groza", "hired", "igman", "jarak", "kokon",
  "lenja", "medju", "nanoc", "okruz", "pokla", "rukva", "salto", "tovar",
  "udati", "vinov", "zrcal", "atlas",
];

export function normalizeForWordle(word: string): string {
  return word
    .toLowerCase()
    .trim()
    .replace(/č|ć/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/đ/g, "d");
}

export function isValidWordleGuess(word: string): boolean {
  const norm = normalizeForWordle(word);
  return (
    norm.length === 5 &&
    (WORDLE_WORDS.some((w) => normalizeForWordle(w) === norm) ||
      WORDLE_VALID_GUESSES.some((w) => normalizeForWordle(w) === norm))
  );
}

export function getRandomWordleWord(): string {
  return WORDLE_WORDS[Math.floor(Math.random() * WORDLE_WORDS.length)]!;
}
