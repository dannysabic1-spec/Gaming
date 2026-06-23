import { Message } from "discord.js";
import { getSession } from "./gameState.js";
import { processKaladontWord } from "./commands/kaladontCmd.js";
import { processWordleMessage } from "./commands/wordleCmd.js";
import { processToploMessage } from "./commands/toploCmd.js";
import { getWordleSession } from "./wordleState.js";
import { getToploSession } from "./toploState.js";
import { getQuizSession } from "./quizState.js";
import { handleQuizAnswer } from "./commands/quizCmd.js";
import { logger } from "../lib/logger.js";

export async function handleMessage(message: Message): Promise<void> {
  if (message.author.bot) return;
  if (!message.guildId) return;
  if (message.content.startsWith(".")) return;

  const channelId = message.channelId;
  const content = message.content.trim();

  // Quiz answer: single letter A/B/C/D
  const quizSession = getQuizSession(channelId);
  if (quizSession?.active) {
    const upper = content.toUpperCase();
    if (["A", "B", "C", "D"].includes(upper)) {
      const answerText = quizSession.question.options[["A","B","C","D"].indexOf(upper)];
      if (answerText) {
        try {
          await handleQuizAnswer(message, answerText);
        } catch (err) {
          logger.error({ err }, "Error handling quiz answer");
        }
        return;
      }
    }
  }

  // Wordle guess: exactly 5 letters, wordle active
  const wordleSession = getWordleSession(channelId);
  if (wordleSession?.active && content.length === 5 && /^[a-zA-ZčćšžđČĆŠŽĐ]+$/.test(content)) {
    try {
      const handled = await processWordleMessage(message);
      if (handled) return;
    } catch (err) {
      logger.error({ err }, "Error handling wordle message");
    }
  }

  // Toplo/Klanno guess: a number
  const toploSession = getToploSession(channelId);
  if (toploSession?.active && /^\d+$/.test(content)) {
    try {
      const handled = await processToploMessage(message);
      if (handled) return;
    } catch (err) {
      logger.error({ err }, "Error handling toplo message");
    }
  }

  // Kaladont word
  const kaladontSession = getSession(channelId);
  if (kaladontSession?.active) {
    try {
      await processKaladontWord(message);
    } catch (err) {
      logger.error({ err }, "Error handling kaladont message");
    }
  }
}
