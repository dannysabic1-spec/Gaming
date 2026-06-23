export interface Question {
  id: number;
  question: string;
  options: [string, string, string, string];
  answer: number;
  reward: number;
  category: string;
}

export const QUESTIONS: Question[] = [
  // GEOGRAFIJA
  { id: 1, question: "Koji je glavni grad Srbije?", options: ["Novi Sad", "Niš", "Beograd", "Kragujevac"], answer: 2, reward: 100, category: "Geografija" },
  { id: 2, question: "Na kojoj reci leži Beograd?", options: ["Morava", "Drina", "Sava i Dunav", "Tisa"], answer: 2, reward: 150, category: "Geografija" },
  { id: 3, question: "Koja je najduža reka na svetu?", options: ["Amazon", "Nil", "Jangce", "Misisipi"], answer: 1, reward: 100, category: "Geografija" },
  { id: 4, question: "Koji je najveći kontinent?", options: ["Afrika", "Amerika", "Azija", "Evropa"], answer: 2, reward: 100, category: "Geografija" },
  { id: 5, question: "Koliko zemalja ima Evropska unija (2024)?", options: ["25", "27", "28", "30"], answer: 1, reward: 200, category: "Geografija" },
  { id: 6, question: "Koji je glavni grad Australije?", options: ["Sidnej", "Melburn", "Kanbera", "Brizben"], answer: 2, reward: 150, category: "Geografija" },
  { id: 7, question: "Koja je najduža reka u Srbiji?", options: ["Sava", "Drina", "Morava", "Dunav"], answer: 3, reward: 150, category: "Geografija" },
  { id: 8, question: "Koji je najveći okean na svetu?", options: ["Atlantski", "Indijski", "Pacifički", "Arktički"], answer: 2, reward: 100, category: "Geografija" },
  { id: 9, question: "Koji je glavni grad Japana?", options: ["Osaka", "Kjoto", "Tokio", "Hirošima"], answer: 2, reward: 100, category: "Geografija" },
  { id: 10, question: "Koja planina je najviša u Srbiji?", options: ["Kopaonik", "Zlatibor", "Rtanj", "Midžur"], answer: 3, reward: 200, category: "Geografija" },
  { id: 11, question: "Koji je najmanji kontinent?", options: ["Evropa", "Australija", "Antarktik", "Južna Amerika"], answer: 1, reward: 150, category: "Geografija" },
  { id: 12, question: "Gdje se nalazi Eiffelov toranj?", options: ["London", "Rim", "Pariz", "Berlin"], answer: 2, reward: 100, category: "Geografija" },
  { id: 13, question: "Koji kanal spaja Sredozemno more i Crveno more?", options: ["Panamski kanal", "Suecki kanal", "Korintski kanal", "Kilski kanal"], answer: 1, reward: 200, category: "Geografija" },
  { id: 14, question: "Koja je prestonica Brazila?", options: ["Rio de Žaneiro", "Sao Paolo", "Brazilija", "Salvador"], answer: 2, reward: 150, category: "Geografija" },
  { id: 15, question: "Koji je najveći grad u Srbiji po broju stanovnika?", options: ["Novi Sad", "Niš", "Beograd", "Kragujevac"], answer: 2, reward: 100, category: "Geografija" },

  // ISTORIJA
  { id: 16, question: "Koje godine je počeo Drugi svetski rat?", options: ["1935", "1939", "1941", "1943"], answer: 1, reward: 150, category: "Istorija" },
  { id: 17, question: "Ko je bio prvi predsednik SAD-a?", options: ["Tomas Džeferson", "Džordž Vašington", "Abraham Linkoln", "Bendžamin Frenklin"], answer: 1, reward: 150, category: "Istorija" },
  { id: 18, question: "Koje godine je pao Berlinski zid?", options: ["1985", "1989", "1991", "1993"], answer: 1, reward: 150, category: "Istorija" },
  { id: 19, question: "Ko je Nikola Tesla?", options: ["Srpski pesnik", "Hrvatski fizičar i pronalazač", "Srpski vojvoda", "Nemački naučnik"], answer: 1, reward: 100, category: "Istorija" },
  { id: 20, question: "Koje godine je Srbija dobila nezavisnost od Osmanskog carstva?", options: ["1804", "1830", "1878", "1903"], answer: 2, reward: 250, category: "Istorija" },
  { id: 21, question: "Ko je bio lider Prve srpske revolucije?", options: ["Miloš Obrenović", "Karađorđe", "Vuk Stefanović Karadžić", "Dositej Obradović"], answer: 1, reward: 200, category: "Istorija" },
  { id: 22, question: "Koje je carstvo palo 1453. godine?", options: ["Rimsko", "Osmansko", "Vizantijsko", "Mongolsko"], answer: 2, reward: 200, category: "Istorija" },
  { id: 23, question: "Ko je bio Napoleon Bonaparte po zanimanju?", options: ["Kralj", "Vojskovođa i car", "Predsednik", "Princ"], answer: 1, reward: 150, category: "Istorija" },
  { id: 24, question: "Koje godine je Kolumbo otkrio Ameriku?", options: ["1488", "1492", "1498", "1502"], answer: 1, reward: 150, category: "Istorija" },
  { id: 25, question: "U kom gradu je ubijen Franz Ferdinand 1914?", options: ["Beograd", "Sarajevo", "Zagreb", "Ljubljana"], answer: 1, reward: 200, category: "Istorija" },

  // NAUKA
  { id: 26, question: "Koliko iznosi brzina svetlosti (zaokruženo)?", options: ["200.000 km/s", "300.000 km/s", "400.000 km/s", "500.000 km/s"], answer: 1, reward: 200, category: "Nauka" },
  { id: 27, question: "Koliko hromozoma ima čovek?", options: ["44", "46", "48", "42"], answer: 1, reward: 200, category: "Nauka" },
  { id: 28, question: "Koji gas biljke apsorbuju tokom fotosinteze?", options: ["Kiseonik", "Azot", "Ugljen-dioksid", "Vodonik"], answer: 2, reward: 150, category: "Nauka" },
  { id: 29, question: "Šta je H2O?", options: ["So", "Voda", "Alkohol", "Sirćetna kiselina"], answer: 1, reward: 100, category: "Nauka" },
  { id: 30, question: "Koliko planeta ima Sunčev sistem?", options: ["7", "8", "9", "10"], answer: 1, reward: 150, category: "Nauka" },
  { id: 31, question: "Ko je otkrio gravitaciju (po legendi sa jabukom)?", options: ["Ajnštajn", "Galileo", "Njutn", "Kopernik"], answer: 2, reward: 150, category: "Nauka" },
  { id: 32, question: "Koji element ima simbol Au?", options: ["Srebro", "Aluminijum", "Zlato", "Gvožđe"], answer: 2, reward: 200, category: "Nauka" },
  { id: 33, question: "Koliko kostiju ima odrasli čovek?", options: ["186", "206", "226", "246"], answer: 1, reward: 200, category: "Nauka" },
  { id: 34, question: "Koji je najtvrdji mineral na svetu?", options: ["Rubin", "Safir", "Dijamant", "Kvarc"], answer: 2, reward: 150, category: "Nauka" },
  { id: 35, question: "Šta proučava ornitologija?", options: ["Ribe", "Ptice", "Insekte", "Sisare"], answer: 1, reward: 200, category: "Nauka" },
  { id: 36, question: "Koliko sekundi ima jedan sat?", options: ["1800", "3600", "7200", "360"], answer: 1, reward: 100, category: "Nauka" },
  { id: 37, question: "Koji organ pumpa krv u ljudskom telu?", options: ["Pluća", "Jetra", "Srce", "Bubreg"], answer: 2, reward: 100, category: "Nauka" },
  { id: 38, question: "Koja je formula za površinu kruga?", options: ["2πr", "πr²", "πd", "2πr²"], answer: 1, reward: 250, category: "Nauka" },
  { id: 39, question: "Ko je izmislio telefon?", options: ["Edison", "Tesla", "Bel", "Markoni"], answer: 2, reward: 150, category: "Nauka" },
  { id: 40, question: "Koji element je najzastupljeniji u Zemljinoj atmosferi?", options: ["Kiseonik", "Argon", "Azot", "Ugljen-dioksid"], answer: 2, reward: 200, category: "Nauka" },

  // SPORT
  { id: 41, question: "Koliko igrača ima fudbalska ekipa na terenu?", options: ["10", "11", "12", "9"], answer: 1, reward: 100, category: "Sport" },
  { id: 42, question: "Koliko puta je Srbija osvajala Davis Cup?", options: ["0", "1", "2", "3"], answer: 1, reward: 200, category: "Sport" },
  { id: 43, question: "Ko drži rekord u broju Grand Slam titula (muški tenis)?", options: ["Federer", "Nadal", "Đoković", "Sinner"], answer: 2, reward: 150, category: "Sport" },
  { id: 44, question: "U kom sportu se koristi termin 'kik-aute'?", options: ["Košarka", "Fudbal", "Boks", "Ragbi"], answer: 1, reward: 100, category: "Sport" },
  { id: 45, question: "Koliko minuta traje fudbalska utakmica?", options: ["80", "90", "100", "85"], answer: 1, reward: 100, category: "Sport" },
  { id: 46, question: "Koji klub je najviše puta osvajao Champions League?", options: ["Barcelona", "Bayern München", "Real Madrid", "Manchester United"], answer: 2, reward: 150, category: "Sport" },
  { id: 47, question: "Gde su održane Olimpijske igre 2020 (letnje)?", options: ["Tokio", "Pariz", "London", "Rio"], answer: 0, reward: 150, category: "Sport" },
  { id: 48, question: "Koji srpski košarkaš ima rekord u broj poena na jednoj NBA utakmici (za tim)?", options: ["Vlade Divac", "Predrag Stojaković", "Nikola Jokić", "Nemanja Bjelica"], answer: 2, reward: 250, category: "Sport" },
  { id: 49, question: "Koliko poena vredi trojka u košarci?", options: ["2", "3", "4", "1"], answer: 1, reward: 100, category: "Sport" },
  { id: 50, question: "Koji srpski teniser je poznat kao 'Nole'?", options: ["Viktor Troicki", "Janko Tipsarević", "Novak Đoković", "Nenad Zimonjić"], answer: 2, reward: 100, category: "Sport" },

  // MUZIKA I KULTURA
  { id: 51, question: "Ko je napravio pesmu 'Despacito'?", options: ["Enrike Iglesijas", "Luis Fonsi", "Džastin Biber", "Maluma"], answer: 1, reward: 150, category: "Muzika" },
  { id: 52, question: "Koji srpski pevač je poznat kao 'Ceca'?", options: ["Lepa Brena", "Svetlana Ražnatović", "Dragana Mirković", "Jasna Milošević"], answer: 1, reward: 100, category: "Muzika" },
  { id: 53, question: "Koji rok bend je snimio 'Bohemian Rhapsody'?", options: ["Led Zeppelin", "Pink Floyd", "Queen", "Rolling Stones"], answer: 2, reward: 100, category: "Muzika" },
  { id: 54, question: "Ko je autor muzičke kompozicije 'Za Elizu'?", options: ["Mocart", "Betoven", "Bah", "Šopen"], answer: 1, reward: 150, category: "Muzika" },
  { id: 55, question: "Koji je žanr muzike poznat kao turbo-folk u Srbiji?", options: ["Pop", "Rok", "Mešavina narodne i dens muzike", "Hip-hop"], answer: 2, reward: 100, category: "Muzika" },
  { id: 56, question: "Ko je pevao 'Thriller'?", options: ["Prince", "Michael Jackson", "Whitney Houston", "Marvin Gaye"], answer: 1, reward: 100, category: "Muzika" },

  // FILMOVI I SERIJE
  { id: 57, question: "Kako se zove glavni junak Hajkera Piksareve igre 'Toy Story'?", options: ["Baz Lajter", "Vudy", "Džesi", "Hamm"], answer: 1, reward: 150, category: "Film" },
  { id: 58, question: "Ko je glumio Iron Mana u MCU filmovima?", options: ["Kris Evans", "Kris Pratt", "Robert Dauni Jr.", "Mark Rafalo"], answer: 2, reward: 100, category: "Film" },
  { id: 59, question: "U kom gradu se odvija serija 'Stranger Things'?", options: ["Hawkins", "Springfield", "Gotham", "Pawnee"], answer: 0, reward: 150, category: "Film" },
  { id: 60, question: "Koji film je zaradio najviše u istoriji bioskopa (nominalno)?", options: ["Titanic", "Avatar", "Avengers: Endgame", "The Lion King"], answer: 1, reward: 200, category: "Film" },
  { id: 61, question: "Ko je režirao film 'Pulp Fiction'?", options: ["Martin Skorseze", "Stiven Spilberg", "Kventin Tarantino", "Kristofer Nolan"], answer: 2, reward: 150, category: "Film" },
  { id: 62, question: "Kako se zove zmaj u Igri prestola Denaris Targarian?", options: ["Rhaegal", "Viserion", "Drogon", "Balerion"], answer: 2, reward: 200, category: "Film" },

  // OPŠTE ZNANJE
  { id: 63, question: "Koliko je boja u spektru duge?", options: ["5", "6", "7", "8"], answer: 2, reward: 100, category: "Opšte znanje" },
  { id: 64, question: "Koliko strana ima kocka?", options: ["4", "6", "8", "12"], answer: 1, reward: 100, category: "Opšte znanje" },
  { id: 65, question: "Koji broj je π (pi) zaokružen na 2 decimale?", options: ["3.12", "3.14", "3.16", "3.18"], answer: 1, reward: 150, category: "Opšte znanje" },
  { id: 66, question: "Koliko prstiju ima čovek na obe ruke?", options: ["8", "9", "10", "12"], answer: 2, reward: 100, category: "Opšte znanje" },
  { id: 67, question: "Koji se jezik govori u Brazilu?", options: ["Španski", "Engleski", "Portugalski", "Brazilski"], answer: 2, reward: 150, category: "Opšte znanje" },
  { id: 68, question: "Koja valuta se koristi u Japanu?", options: ["Yuan", "Won", "Jen", "Dolar"], answer: 2, reward: 100, category: "Opšte znanje" },
  { id: 69, question: "Koliko meseci ima jedna godina?", options: ["10", "11", "12", "13"], answer: 2, reward: 100, category: "Opšte znanje" },
  { id: 70, question: "Ko je napisao 'Romeo i Julija'?", options: ["Čoser", "Šekspir", "Dikens", "Hemingvej"], answer: 1, reward: 100, category: "Opšte znanje" },
  { id: 71, question: "Koliko nula ima milion?", options: ["5", "6", "7", "9"], answer: 1, reward: 100, category: "Opšte znanje" },
  { id: 72, question: "Koja životinja je simbol Australije?", options: ["Koala", "Kengur", "Emu", "Vombat"], answer: 1, reward: 150, category: "Opšte znanje" },
  { id: 73, question: "Koji je najbrži kopneni sisavac?", options: ["Lav", "Gepard", "Antilopа", "Konj"], answer: 1, reward: 150, category: "Opšte znanje" },
  { id: 74, question: "Koliko slova ima latinična abeceda?", options: ["24", "26", "28", "30"], answer: 1, reward: 100, category: "Opšte znanje" },
  { id: 75, question: "Koja je boja hlorofila?", options: ["Žuta", "Zelena", "Plava", "Crvena"], answer: 1, reward: 150, category: "Opšte znanje" },
  { id: 76, question: "Ko je izmislio pozorište?", options: ["Rimljani", "Grci", "Egipćani", "Kinezi"], answer: 1, reward: 200, category: "Opšte znanje" },
  { id: 77, question: "Koliko tona teži prosečni avion B747?", options: ["150", "200", "300", "412"], answer: 3, reward: 250, category: "Opšte znanje" },
  { id: 78, question: "U kom gradu se nalazi Akropolis?", options: ["Rim", "Atina", "Istanbul", "Solun"], answer: 1, reward: 150, category: "Opšte znanje" },
  { id: 79, question: "Koji je najduže vladajući monarh u istoriji?", options: ["Luj XIV", "Elizabeta II", "Luj XV", "Viktorija"], answer: 0, reward: 250, category: "Opšte znanje" },
  { id: 80, question: "Koji planet je najbliži Suncu?", options: ["Venera", "Zemlja", "Merkur", "Mars"], answer: 2, reward: 150, category: "Nauka" },
  { id: 81, question: "Od čega je napravljen Hadrijanov zid?", options: ["Drveta", "Kamena i betona", "Cigle i maltera", "Čelika"], answer: 2, reward: 200, category: "Istorija" },
  { id: 82, question: "Koji je hemijski simbol za natrijum?", options: ["N", "Na", "Nt", "Nm"], answer: 1, reward: 200, category: "Nauka" },
  { id: 83, question: "Koliko igrača ima odbojkaška ekipa na terenu?", options: ["5", "6", "7", "8"], answer: 1, reward: 100, category: "Sport" },
  { id: 84, question: "Ko je napisao roman '1984'?", options: ["Aldous Haksli", "Džordž Orvel", "Frenk Herbert", "Rejmond Braderi"], answer: 1, reward: 200, category: "Opšte znanje" },
  { id: 85, question: "Koji kompjuterski sistem je lansirao Microsoft 2001. godine?", options: ["Windows 98", "Windows ME", "Windows XP", "Windows Vista"], answer: 2, reward: 150, category: "Tehnologija" },
  { id: 86, question: "Ko je osnivač kompanije Apple?", options: ["Bil Gejts", "Ilon Musk", "Stiv Džobs", "Jeff Bezos"], answer: 2, reward: 100, category: "Tehnologija" },
  { id: 87, question: "Šta znači skraćenica 'DNS' u IT-u?", options: ["Data Network System", "Domain Name System", "Digital Name Server", "Direct Network Search"], answer: 1, reward: 200, category: "Tehnologija" },
  { id: 88, question: "Koja kompanija je napravila prvu konzolu PlayStation?", options: ["Nintendo", "Sega", "Sony", "Microsoft"], answer: 2, reward: 100, category: "Tehnologija" },
  { id: 89, question: "U kojoj godini je osnovan Google?", options: ["1995", "1997", "1998", "2000"], answer: 2, reward: 150, category: "Tehnologija" },
  { id: 90, question: "Koliko bajtova ima jedan gigabajt?", options: ["1.000.000", "1.024.000", "1.073.741.824", "1.000.000.000"], answer: 2, reward: 250, category: "Tehnologija" },
  { id: 91, question: "Koji je najzastupljeniji jezik na internetu?", options: ["Kinesk", "Španskii", "Engleski", "Hindi"], answer: 2, reward: 150, category: "Tehnologija" },
  { id: 92, question: "Šta je 'Bitcoin'?", options: ["Kompanija", "Kriptovaluta", "Banka", "Softver"], answer: 1, reward: 150, category: "Tehnologija" },
  { id: 93, question: "Ko je osnivač Twittera (danas X)?", options: ["Mark Zakerberg", "Ilon Musk (kupio ga)", "Džek Dorsi (osnivač)", "Bili Gejts"], answer: 2, reward: 200, category: "Tehnologija" },
  { id: 94, question: "Koja je srpska pita napravljena sa sirom?", options: ["Zeljanica", "Burek", "Gibanica", "Štrukla"], answer: 1, reward: 100, category: "Hrana" },
  { id: 95, question: "Od čega se pravi ajvar?", options: ["Paradajz", "Paprika", "Plavi patlidžan", "Tikvica"], answer: 1, reward: 100, category: "Hrana" },
  { id: 96, question: "Koji alkohol je karakterističan za Srbiju?", options: ["Viski", "Votka", "Rakija", "Džin"], answer: 2, reward: 100, category: "Hrana" },
  { id: 97, question: "Koliko kalorija ima 100g meda?", options: ["200", "304", "150", "400"], answer: 1, reward: 250, category: "Hrana" },
  { id: 98, question: "Koji napitak se pravi od grožđa?", options: ["Pivo", "Vino", "Votka", "Džin"], answer: 1, reward: 100, category: "Hrana" },
  { id: 99, question: "Kako se zove srpska supa sa mesom i povrćem?", options: ["Minestrone", "Čorba", "Gulaš", "Boršč"], answer: 1, reward: 100, category: "Hrana" },
  { id: 100, question: "Koji je najstariji grad u Srbiji?", options: ["Beograd", "Niš", "Novi Sad", "Sremska Mitrovica"], answer: 3, reward: 300, category: "Geografija" },
];

export function getRandomQuestion(used: Set<number>): Question | null {
  const available = QUESTIONS.filter((q) => !used.has(q.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)]!;
}
