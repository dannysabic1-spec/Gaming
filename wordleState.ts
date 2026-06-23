import { getRandomWordleWord, normalizeForWordle } from "./data/words5.js";

const EMBED_COLOR = 0x000000;
const MAX_GUESSES = 6;

export interface WordleSession {
  channelId: string;
  guildId: string;
  answer: string;
  answerNorm: string;
  guesses: string[];
  guessResults: string[][];
  startedBy: string;
  active: boolean;
  playerScores: Map<string, number>;
}

const sessions = new Map<string, WordleSession>();

export function startWordle(channelId: string, guildId: string, startedBy: string): WordleSession {
  const answer = getRandomWordleWord();
  const session: WordleSession = {
    channelId,
    guildId,
    answer,
    answerNorm: normalizeForWordle(answer),
    guesses: [],
    guessResults: [],
    startedBy,
    active: true,
    playerScores: new Map(),
  };
  sessions.set(channelId, session);
  return session;
}

export function getWordleSession(channelId: string): WordleSession | undefined {
  return sessions.get(channelId);
}

export function stopWordle(channelId: string): void {
  sessions.delete(channelId);
}

export type WordleGuessResult = "win" | "lose" | "continue" | "invalid" | "already_guessed";

export interface WordleGuessResponse {
  result: WordleGuessResult;
  row: string[];
  display: string;
  guessCount: number;
  answer?: string;
}

export function processWordleGuess(
  channelId: string,
  userId: string,
  guess: string
): WordleGuessResponse | null {
  const session = sessions.get(channelId);
  if (!session?.active) return null;

  const guessNorm = normalizeForWordle(guess);

  if (guessNorm.length !== 5) return { result: "invalid", row: [], display: "", guessCount: session.guesses.length };

  if (session.guesses.map((g) => normalizeForWordle(g)).includes(guessNorm)) {
    return { result: "already_guessed", row: [], display: "", guessCount: session.guesses.length };
  }

  const answerNorm = session.answerNorm;
  const row: string[] = [];

  const answerChars = answerNorm.split("");
  const guessChars = guessNorm.split("");
  const used = new Array(5).fill(false);

  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === answerChars[i]) {
      row[i] = "🟩";
      used[i] = true;
    } else {
      row[i] = "⬛";
    }
  }

  for (let i = 0; i < 5; i++) {
    if (row[i] === "🟩") continue;
    for (let j = 0; j < 5; j++) {
      if (!used[j] && guessChars[i] === answerChars[j]) {
        row[i] = "🟨";
        used[j] = true;
        break;
      }
    }
  }

  session.guesses.push(guess.toUpperCase());
  session.guessResults.push(row);

  const displayRows = session.guessResults.map((r, idx) => {
    const letters = normalizeForWordle(session.guesses[idx]!).toUpperCase().split("").join(" ");
    return `${r.join("")} ${letters}`;
  });
  const display = displayRows.join("\n");

  const isWin = row.every((r) => r === "🟩");
  const guessCount = session.guesses.length;

  if (isWin) {
    session.active = false;
    sessions.delete(channelId);
    return { result: "win", row, display, guessCount, answer: session.answer };
  }

  if (guessCount >= MAX_GUESSES) {
    session.active = false;
    sessions.delete(channelId);
    return { result: "lose", row, display, guessCount, answer: session.answer };
  }

  return { result: "continue", row, display, guessCount };
}

export { MAX_GUESSES, EMBED_COLOR };
