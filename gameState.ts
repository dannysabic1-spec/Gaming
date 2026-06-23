import {
  SERBIAN_WORDS,
  normalizeWord,
  getLastLetters,
  countPossibleWords,
  isValidWord,
  wordStartsWith,
} from "./data/wordlist.js";

export interface GameSession {
  channelId: string;
  guildId: string;
  currentWord: string;
  currentSuffix: string;
  usedWords: Set<string>;
  scores: Map<string, number>;
  pointsToWin: number;
  possibleWordsLeft: number;
  startedBy: string;
  active: boolean;
}

const activeSessions = new Map<string, GameSession>();

function getRandomStartWord(): {
  word: string;
  suffix: string;
  possibleWords: number;
  pointsToWin: number;
} {
  const shuffled = [...SERBIAN_WORDS].sort(() => Math.random() - 0.5);

  for (const word of shuffled) {
    const suffix = getLastLetters(word, 2);
    const possible = countPossibleWords(suffix, new Set([normalizeWord(word)]));
    if (possible >= 5) {
      const pointsToWin = Math.max(1, Math.floor(possible / 40));
      return { word, suffix, possibleWords: possible, pointsToWin };
    }
  }

  const fallback = shuffled[0]!;
  const suffix = getLastLetters(fallback, 2);
  const possible = countPossibleWords(suffix, new Set([normalizeWord(fallback)]));
  return { word: fallback, suffix, possibleWords: possible, pointsToWin: 1 };
}

export function startGame(
  channelId: string,
  guildId: string,
  startedBy: string
): GameSession {
  const { word, suffix, possibleWords, pointsToWin } = getRandomStartWord();

  const session: GameSession = {
    channelId,
    guildId,
    currentWord: word,
    currentSuffix: suffix,
    usedWords: new Set([normalizeWord(word)]),
    scores: new Map(),
    pointsToWin,
    possibleWordsLeft: possibleWords,
    startedBy,
    active: true,
  };

  activeSessions.set(channelId, session);
  return session;
}

export function getSession(channelId: string): GameSession | undefined {
  return activeSessions.get(channelId);
}

export function stopGame(channelId: string): void {
  activeSessions.delete(channelId);
}

export type WordResultReason =
  | "already_used"
  | "wrong_start"
  | "not_a_word"
  | "winner";

export interface WordResult {
  valid: boolean;
  reason?: WordResultReason;
  winner?: string;
  newWord?: string;
  newSuffix?: string;
  possibleWords?: number;
  pointsToWin?: number;
  playerScore?: number;
}

export function processWord(
  channelId: string,
  userId: string,
  word: string
): WordResult {
  const session = activeSessions.get(channelId);
  if (!session || !session.active) {
    return { valid: false, reason: "not_a_word" };
  }

  const normalizedInput = normalizeWord(word);

  if (session.usedWords.has(normalizedInput)) {
    return { valid: false, reason: "already_used" };
  }

  if (!wordStartsWith(word, session.currentSuffix)) {
    return { valid: false, reason: "wrong_start" };
  }

  if (!isValidWord(word)) {
    return { valid: false, reason: "not_a_word" };
  }

  session.usedWords.add(normalizedInput);

  const currentScore = (session.scores.get(userId) ?? 0) + 1;
  session.scores.set(userId, currentScore);

  if (currentScore >= session.pointsToWin) {
    session.active = false;
    activeSessions.delete(channelId);
    return { valid: true, reason: "winner", winner: userId, playerScore: currentScore };
  }

  const newSuffix = getLastLetters(word, 2);
  const possibleWords = countPossibleWords(newSuffix, session.usedWords);
  const newPointsToWin = Math.max(1, Math.floor(possibleWords / 40));

  session.currentWord = word;
  session.currentSuffix = newSuffix;
  session.possibleWordsLeft = possibleWords;
  session.pointsToWin = newPointsToWin;

  return {
    valid: true,
    newWord: word,
    newSuffix,
    possibleWords,
    pointsToWin: newPointsToWin,
    playerScore: currentScore,
  };
}

export function getLeaderboard(
  channelId: string
): Array<{ userId: string; score: number }> {
  const session = activeSessions.get(channelId);
  if (!session) return [];

  return Array.from(session.scores.entries())
    .map(([userId, score]) => ({ userId, score }))
    .sort((a, b) => b.score - a.score);
}
