import { Message, EmbedBuilder } from "discord.js";
import {
  startWordle,
  getWordleSession,
  processWordleGuess,
  stopWordle,
  MAX_GUESSES,
} from "../wordleState.js";
import { isValidWordleGuess } from "../data/words5.js";
import { addBalance, formatMoney } from "../economy.js";

export async function handleWordleStart(message: Message): Promise<void> {
  const existing = getWordleSession(message.channelId);
  if (existing?.active) {
    await message.reply(
      "❌ Wordle već teče! Pogodite reč ili sačekajte da igra završi."
    );
    return;
  }

  const session = startWordle(message.channelId, message.guildId ?? "dm", message.author.id);

  const grid = Array(MAX_GUESSES)
    .fill("⬛⬛⬛⬛⬛")
    .join("\n");

  const embed = new EmbedBuilder()
    .setColor(0x000000)
    .setTitle("🟩 Wordle — Pogodi reč!")
    .setDescription(
      `Pogodite srpsku reč od **5 slova** u ${MAX_GUESSES} pokušaja!\n\n` +
      `${grid}\n\n` +
      `🟩 = Tačno slovo, tačna pozicija\n` +
      `🟨 = Tačno slovo, pogrešna pozicija\n` +
      `⬛ = Slovo nije u reči`
    )
    .setFooter({ text: "Pišite reči direktno u chat! Npr: vatra" });

  await message.reply({ embeds: [embed] });
}

export async function handleWordleStop(message: Message): Promise<void> {
  const session = getWordleSession(message.channelId);
  if (!session?.active) {
    await message.reply("❌ Nema aktivne Wordle igre.");
    return;
  }
  stopWordle(message.channelId);
  await message.reply(`Igra zaustavljena. Reč je bila: **${session.answer.toUpperCase()}**`);
}

export async function processWordleMessage(message: Message): Promise<boolean> {
  const session = getWordleSession(message.channelId);
  if (!session?.active) return false;

  const guess = message.content.trim().toLowerCase();

  if (guess.length !== 5) return false;
  if (!/^[a-zA-ZčćšžđČĆŠŽĐ]+$/.test(guess)) return false;

  if (!isValidWordleGuess(guess)) {
    const reply = await message.reply(`❌ **${guess.toUpperCase()}** nije poznata reč!`);
    setTimeout(() => reply.delete().catch(() => {}), 4000);
    return true;
  }

  const response = processWordleGuess(message.channelId, message.author.id, guess);
  if (!response) return false;

  const emptyRows = MAX_GUESSES - session.guesses.length - (response.result === "continue" ? 0 : 0);
  const remaining = Math.max(0, MAX_GUESSES - response.guessCount);
  const emptyGrid = Array(remaining).fill("⬛⬛⬛⬛⬛").join("\n");
  const fullDisplay = emptyGrid ? `${response.display}\n${emptyGrid}` : response.display;

  if (response.result === "win") {
    const reward = Math.max(50, 250 - (response.guessCount - 1) * 40);
    addBalance(message.author.id, reward);

    const embed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle("🎉 Tačno!")
      .setDescription(
        `${response.display}\n\n` +
        `<@${message.author.id}> je pogodio/la za **${response.guessCount}** ${response.guessCount === 1 ? "pokušaj" : "pokušaja"}!\n\n` +
        `Reč: **${response.answer?.toUpperCase()}**\n` +
        `Nagrada: ${formatMoney(reward)}`
      )
      .setFooter({ text: "Koristi .wordle za novu igru" });

    await message.reply({ embeds: [embed] });
    return true;
  }

  if (response.result === "lose") {
    const embed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle("💀 Niste pogodili!")
      .setDescription(
        `${response.display}\n\n` +
        `Reč je bila: **${response.answer?.toUpperCase()}**\n\n` +
        `Koristite **.wordle** za novu igru!`
      )
      .setFooter({ text: "Srećom sledeći put!" });

    await message.reply({ embeds: [embed] });
    return true;
  }

  const embed = new EmbedBuilder()
    .setColor(0x000000)
    .setTitle("🟩 Wordle")
    .setDescription(`${fullDisplay}\n\n*Preostalo pokušaja: ${remaining}*`)
    .setFooter({ text: "Nastavite da pogađate!" });

  await message.reply({ embeds: [embed] });
  return true;
}
