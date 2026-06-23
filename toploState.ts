export interface ToploSession {
  channelId: string;
  guildId: string;
  answer: number;
  guesses: Array<{ userId: string; guess: number; distance: number }>;
  startedBy: string;
  active: boolean;
  minRange: number;
  maxRange: number;
}

const sessions = new Map<string, ToploSession>();

export function startToplo(channelId: string, guildId: string, startedBy: string): ToploSession {
  const answer = Math.floor(Math.random() * 100) + 1;
  const session: ToploSession = {
    channelId,
    guildId,
    answer,
    guesses: [],
    startedBy,
    active: true,
    minRange: 1,
    maxRange: 100,
  };
  sessions.set(channelId, session);
  return session;
}

export function getToploSession(channelId: string): ToploSession | undefined {
  return sessions.get(channelId);
}

export function stopToplo(channelId: string): void {
  sessions.delete(channelId);
}

export interface ToploGuessResult {
  type: "win" | "hint" | "invalid";
  label?: string;
  emoji?: string;
  distance?: number;
  guess?: number;
  answer?: number;
  userId?: string;
}

export function processToploGuess(
  channelId: string,
  userId: string,
  input: string
): ToploGuessResult {
  const session = sessions.get(channelId);
  if (!session?.active) return { type: "invalid" };

  const guess = parseInt(input, 10);
  if (isNaN(guess) || guess < 1 || guess > 100) return { type: "invalid" };

  const distance = Math.abs(guess - session.answer);
  session.guesses.push({ userId, guess, distance });

  if (guess === session.answer) {
    session.active = false;
    sessions.delete(channelId);
    return { type: "win", answer: session.answer, userId, guess };
  }

  let label: string;
  let emoji: string;

  if (distance <= 3) {
    label = "VRELO!";
    emoji = "🔥🔥🔥";
  } else if (distance <= 7) {
    label = "Toplo";
    emoji = "🔥🔥";
  } else if (distance <= 15) {
    label = "Malo toplo";
    emoji = "🔥";
  } else if (distance <= 25) {
    label = "Neutralno";
    emoji = "🌡️";
  } else if (distance <= 40) {
    label = "Hladno";
    emoji = "❄️";
  } else if (distance <= 60) {
    label = "Veoma hladno";
    emoji = "❄️❄️";
  } else {
    label = "LEDENO!";
    emoji = "🧊🧊🧊";
  }

  if (guess < session.answer) {
    session.minRange = Math.max(session.minRange, guess + 1);
  } else {
    session.maxRange = Math.min(session.maxRange, guess - 1);
  }

  return { type: "hint", label, emoji, distance, guess, userId };
}
