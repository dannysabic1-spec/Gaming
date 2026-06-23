import { Message, Client } from "discord.js";
import { handleKaladontStart, handleKaladontStop, handleKaladontStatus } from "./commands/kaladontCmd.js";
import { handleWordleStart, handleWordleStop } from "./commands/wordleCmd.js";
import { handleToploStart, handleToploStop } from "./commands/toploCmd.js";
import { handleSlots } from "./commands/slots.js";
import { handleNovcanik, handleLestvica } from "./commands/novcanik.js";
import { handlePomoc } from "./commands/pomoc.js";
import { createQuizHandler } from "./commands/quizCmd.js";
import { getSession } from "./gameState.js";
import { getWordleSession } from "./wordleState.js";
import { getToploSession } from "./toploState.js";

export const PREFIX = ".";

export function createPrefixHandler(client: Client) {
  const handleQuiz = createQuizHandler(client);

  return async function handlePrefixCommand(message: Message): Promise<boolean> {
    if (!message.content.startsWith(PREFIX)) return false;
    if (message.author.bot) return false;

    const withoutPrefix = message.content.slice(PREFIX.length).trim();
    const [rawCmd, ...args] = withoutPrefix.split(/\s+/);
    const cmd = rawCmd?.toLowerCase() ?? "";

    switch (cmd) {
      case "kaladont": {
        const sub = args[0]?.toLowerCase();
        if (sub === "stop") {
          await handleKaladontStop(message);
        } else if (sub === "status") {
          await handleKaladontStatus(message);
        } else {
          await handleKaladontStart(message);
        }
        return true;
      }

      case "wordle": {
        const sub = args[0]?.toLowerCase();
        if (sub === "stop") {
          await handleWordleStop(message);
        } else {
          await handleWordleStart(message);
        }
        return true;
      }

      case "toplo":
      case "toplo-klanno":
      case "teploklanno": {
        const sub = args[0]?.toLowerCase();
        if (sub === "stop") {
          await handleToploStop(message);
        } else {
          await handleToploStart(message);
        }
        return true;
      }

      case "quiz":
      case "kviz": {
        await handleQuiz(message);
        return true;
      }

      case "slots":
      case "slot":
      case "aparat": {
        await handleSlots(message, args);
        return true;
      }

      case "pare":
      case "novcanik":
      case "balans":
      case "balance": {
        await handleNovcanik(message);
        return true;
      }

      case "lestvica":
      case "top":
      case "leaderboard": {
        await handleLestvica(message);
        return true;
      }

      case "pomoc":
      case "help":
      case "komande": {
        await handlePomoc(message);
        return true;
      }

      case "status": {
        const kaladont = getSession(message.channelId);
        const wordle = getWordleSession(message.channelId);
        const toplo = getToploSession(message.channelId);
        const lines: string[] = [];
        if (kaladont?.active) lines.push(`🔠 **Kaladont** — aktivna (reč: ${kaladont.currentWord.toUpperCase()})`);
        if (wordle?.active) lines.push(`🟩 **Wordle** — aktivna (${wordle.guesses.length}/${6} pokušaja)`);
        if (toplo?.active) lines.push(`🌡️ **Toplo/Klanno** — aktivna`);
        if (lines.length === 0) lines.push("Nema aktivnih igara u ovom kanalu.");
        await message.reply(lines.join("\n"));
        return true;
      }

      default:
        return false;
    }
  };
}
