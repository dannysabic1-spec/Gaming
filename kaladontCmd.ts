import { Message, EmbedBuilder, BaseGuildTextChannel } from "discord.js";
import {
  startGame,
  stopGame,
  getSession,
  getLeaderboard,
} from "../gameState.js";
import { addBalance, formatMoney } from "../economy.js";

export async function handleKaladontStart(message: Message): Promise<void> {
  const existing = getSession(message.channelId);
  if (existing?.active) {
    const displayWord = existing.currentWord.toUpperCase();
    const suffix = existing.currentSuffix.toUpperCase();
    const embed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle(`**${displayWord}**`)
      .setDescription(
        `Igra već teče! Napiši reč koja počinje sa **${suffix}**\n\n` +
        `• **Mogućih reči:** ${existing.possibleWordsLeft}\n` +
        `• **Za pobedu:** ${existing.pointsToWin}`
      )
      .setFooter({ text: "Kaladont • Piši reči direktno u chat!" });
    await message.reply({ embeds: [embed] });
    return;
  }

  const session = startGame(message.channelId, message.guildId ?? "dm", message.author.id);
  const displayWord = session.currentWord.toUpperCase();
  const suffix = session.currentSuffix.toUpperCase();

  const embed = new EmbedBuilder()
    .setColor(0x000000)
    .setTitle(`**${displayWord}**`)
    .setDescription(
      `Napiši reč koja počinje sa **${suffix}**\n\n` +
      `• **Mogućih reči:** ${session.possibleWordsLeft}\n` +
      `• **Za pobedu:** ${session.pointsToWin}`
    )
    .setFooter({ text: "Kaladont • Piši reči direktno u chat!" });

  await message.reply({ embeds: [embed] });
}

export async function handleKaladontStop(message: Message): Promise<void> {
  const session = getSession(message.channelId);
  if (!session?.active) {
    await message.reply({ content: "❌ Nema aktivne igre." });
    return;
  }

  const leaderboard = getLeaderboard(message.channelId);
  stopGame(message.channelId);

  const scores =
    leaderboard.length > 0
      ? leaderboard
          .slice(0, 5)
          .map(
            (e, i) =>
              `${i + 1}. <@${e.userId}> — **${e.score}** ${e.score === 1 ? "poen" : "poena"}`
          )
          .join("\n")
      : "Niko nije skupio poene.";

  const embed = new EmbedBuilder()
    .setColor(0x000000)
    .setTitle("🛑 Igra je zaustavljena")
    .addFields({ name: "Rezultati", value: scores })
    .setFooter({ text: "Kaladont • Koristi .kaladont za novu igru" });

  await message.reply({ embeds: [embed] });
}

export async function handleKaladontStatus(message: Message): Promise<void> {
  const session = getSession(message.channelId);
  if (!session?.active) {
    await message.reply({
      content: "❌ Nema aktivne igre. Koristi `.kaladont` da počneš.",
    });
    return;
  }

  const displayWord = session.currentWord.toUpperCase();
  const suffix = session.currentSuffix.toUpperCase();

  const embed = new EmbedBuilder()
    .setColor(0x000000)
    .setTitle(`**${displayWord}**`)
    .setDescription(
      `Napiši reč koja počinje sa **${suffix}**\n\n` +
      `• **Mogućih reči:** ${session.possibleWordsLeft}\n` +
      `• **Za pobedu:** ${session.pointsToWin}\n` +
      `• **Iskorišćeno reči:** ${session.usedWords.size}`
    )
    .setFooter({ text: "Kaladont • Piši reči direktno u chat!" });

  await message.reply({ embeds: [embed] });
}

export async function processKaladontWord(message: Message): Promise<boolean> {
  const { processWord } = await import("../gameState.js");
  const session = getSession(message.channelId);
  if (!session?.active) return false;

  const word = message.content.trim();
  if (!word || word.includes(" ") || word.startsWith(".")) return false;

  const result = processWord(message.channelId, message.author.id, word);

  if (!result.valid) {
    let replyText: string;
    if (result.reason === "already_used") {
      replyText = `**${word.toUpperCase()}** je već iskorišćena! Pokušaj drugu reč.`;
    } else if (result.reason === "wrong_start") {
      replyText = `Reč mora početi sa **${session.currentSuffix.toUpperCase()}**!`;
    } else {
      replyText = `**${word.toUpperCase()}** nije validna reč! Pokušajte neku drugu reč!`;
    }
    await message.react("❌");
    const reply = await message.reply(replyText);
    setTimeout(() => reply.delete().catch(() => {}), 5000);
    return true;
  }

  if (result.reason === "winner") {
    await message.react("✅");
    const reward = 500;
    addBalance(message.author.id, reward);

    const embed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle("🎉 Pobednik!")
      .setDescription(
        `<@${message.author.id}> je pobedio/la sa rečju **${word.toUpperCase()}**!\n\n` +
        `Nagrada: ${formatMoney(reward)}`
      )
      .setFooter({ text: "Kaladont • Koristi .kaladont za novu igru" });

    if (message.channel instanceof BaseGuildTextChannel) {
      await message.channel.send({ embeds: [embed] });
    }
    return true;
  }

  await message.react("✅");

  const displayWord = (result.newWord ?? word).toUpperCase();
  const suffix = (result.newSuffix ?? "").toUpperCase();
  const score = result.playerScore ?? 0;
  const scoreLabel = score === 1 ? "poen" : "poena";

  const embed = new EmbedBuilder()
    .setColor(0x000000)
    .setTitle(`**${displayWord}**`)
    .setDescription(
      `• **Mogućih reči:** ${result.possibleWords}\n` +
        `• **Za pobedu:** ${result.pointsToWin}\n\n` +
        `**${score} ${scoreLabel}**`
    )
    .setFooter({ text: `Napiši reč koja počinje sa ${suffix}` });

  if (message.channel instanceof BaseGuildTextChannel) {
    await message.channel.send({ embeds: [embed] });
  }
  return true;
}
