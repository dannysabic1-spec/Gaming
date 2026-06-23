import { Message, EmbedBuilder } from "discord.js";
import { startQuiz, getOptionLetter, QUIZ_TIMEOUT_SECONDS } from "../quizState.js";
import { addBalance, formatMoney } from "../economy.js";
import type { TextChannel, NewsChannel } from "discord.js";

const channelUsedIds = new Map<string, Set<number>>();

async function sendTimeout(channelId: string, answer: string, client: import("discord.js").Client): Promise<void> {
  const ch = client.channels.cache.get(channelId);
  if (!ch || !("send" in ch)) return;
  const embed = new EmbedBuilder()
    .setColor(0x000000)
    .setTitle("⏰ Vreme je isteklo!")
    .setDescription(`Tačan odgovor je bio: **${answer}**`)
    .setFooter({ text: "Koristi .quiz za novo pitanje" });
  await (ch as TextChannel).send({ embeds: [embed] });
}

export function createQuizHandler(client: import("discord.js").Client) {
  return async function handleQuiz(message: Message): Promise<void> {
    const channelId = message.channelId;

    if (!channelUsedIds.has(channelId)) {
      channelUsedIds.set(channelId, new Set());
    }
    const usedIds = channelUsedIds.get(channelId)!;

    const result = startQuiz(channelId, usedIds, async (cid, ans) => {
      await sendTimeout(cid, ans, client);
    });

    if (!result) {
      channelUsedIds.set(channelId, new Set());
      await message.reply("✅ Prošli ste kroz sva pitanja! Resetujem bazu... Koristite `.quiz` ponovo.");
      return;
    }

    const { question } = result;
    const optionLetters = question.options.map(
      (opt, i) => `**${getOptionLetter(i)}.** ${opt}`
    );

    const embed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle(`❓ Kviz — ${question.category}`)
      .setDescription(
        `**${question.question}**\n\n` +
        optionLetters.join("\n") +
        `\n\n💰 Nagrada: ${formatMoney(question.reward)}`
      )
      .setFooter({ text: `Odgovorite sa A, B, C ili D • ${QUIZ_TIMEOUT_SECONDS}s` });

    await message.reply({ embeds: [embed] });
  };
}

export async function handleQuizAnswer(
  message: Message,
  answer: string
): Promise<boolean> {
  const { resolveQuiz } = await import("../quizState.js");
  const result = resolveQuiz(message.channelId, answer);
  if (!result) return false;

  const { correct, question } = result;
  const correctAnswer = question.options[question.answer];

  if (correct) {
    addBalance(message.author.id, question.reward);
    const embed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle("✅ Tačno!")
      .setDescription(
        `<@${message.author.id}> je tačno odgovorio/la!\n\n` +
        `Odgovor: **${correctAnswer}**\n` +
        `Zarada: ${formatMoney(question.reward)}`
      )
      .setFooter({ text: "Koristi .quiz za sledeće pitanje" });
    await message.reply({ embeds: [embed] });
  } else {
    const embed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle("❌ Netačno!")
      .setDescription(
        `<@${message.author.id}> nije pogodio/la.\n\n` +
        `Tačan odgovor: **${correctAnswer}**`
      )
      .setFooter({ text: "Koristi .quiz za sledeće pitanje" });
    await message.reply({ embeds: [embed] });
  }
  return true;
}
