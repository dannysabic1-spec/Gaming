import { type Question, getRandomQuestion } from "./data/questions.js";

const QUIZ_TIMEOUT_MS = 30_000;

export interface QuizSession {
  channelId: string;
  question: Question;
  active: boolean;
  usedIds: Set<number>;
  timeoutHandle: NodeJS.Timeout;
}

const sessions = new Map<string, QuizSession>();

export function startQuiz(
  channelId: string,
  usedIds: Set<number>,
  onTimeout: (channelId: string, answer: string) => void
): { session: QuizSession; question: Question } | null {
  const question = getRandomQuestion(usedIds);
  if (!question) return null;

  const existing = sessions.get(channelId);
  if (existing) {
    clearTimeout(existing.timeoutHandle);
    sessions.delete(channelId);
  }

  usedIds.add(question.id);

  const timeoutHandle = setTimeout(() => {
    sessions.delete(channelId);
    onTimeout(channelId, question.options[question.answer]);
  }, QUIZ_TIMEOUT_MS);

  const session: QuizSession = {
    channelId,
    question,
    active: true,
    usedIds,
    timeoutHandle,
  };

  sessions.set(channelId, session);
  return { session, question };
}

export function getQuizSession(channelId: string): QuizSession | undefined {
  return sessions.get(channelId);
}

export function resolveQuiz(channelId: string, answer: string): {
  correct: boolean;
  question: Question;
} | null {
  const session = sessions.get(channelId);
  if (!session?.active) return null;

  clearTimeout(session.timeoutHandle);
  sessions.delete(channelId);

  const correct =
    answer.trim().toLowerCase() ===
    session.question.options[session.question.answer].toLowerCase();

  return { correct, question: session.question };
}

export function getOptionLetter(index: number): string {
  return ["A", "B", "C", "D"][index] ?? "?";
}

export const QUIZ_TIMEOUT_SECONDS = QUIZ_TIMEOUT_MS / 1000;
