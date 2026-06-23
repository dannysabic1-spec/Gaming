import { Message, EmbedBuilder } from "discord.js";
import {
  startToplo,
  getToploSession,
  stopToplo,
  processToploGuess,
} from "../toploState.js";
import { addBalance, formatMoney } from "../economy.js";

export async function handleToploStart(message: Message): Promise<void> {
  const existing = getToploSession(message.channelId);
  if (existing?.active) {
    await message.reply("❌ Toplo/Klanno već teče! Pogodite broj od 1 do 100.");
    return;
  }

  startToplo(message.channelId, message.guildId ?? "dm", message.author.id);

  const embed = new EmbedBuilder()
    .setColor(0x000000)
    .setTitle("🌡️ Toplo / Klanno")
    .setDescription(
      "Zamislio sam broj od **1 do 100**!\n\n" +
      "Pogodite koji je — pišite brojeve direktno u chat!\n\n" +
      "🔥🔥🔥 **VRELO** — razlika ≤ 3\n" +
      "🔥🔥 **Toplo** — razlika ≤ 7\n" +
      "🔥 **Malo toplo** — razlika ≤ 15\n" +
      "🌡️ **Neutralno** — razlika ≤ 25\n" +
      "❄️ **Hladno** — razlika ≤ 40\n" +
      "❄️❄️ **Veoma hladno** — razlika ≤ 60\n" +
      "🧊🧊🧊 **LEDENO** — razlika > 60"
    )
    .setFooter({ text: "Piši brojeve direktno u chat!" });

  await message.reply({ embeds: [embed] });
}

export async function handleToploStop(message: Message): Promise<void> {
  const session = getToploSession(message.channelId);
  if (!session?.active) {
    await message.reply("❌ Nema aktivne Toplo/Klanno igre.");
    return;
  }
  stopToplo(message.channelId);
  await message.reply(`Igra zaustavljena. Broj je bio: **${session.answer}**`);
}

export async function processToploMessage(message: Message): Promise<boolean> {
  const session = getToploSession(message.channelId);
  if (!session?.active) return false;

  const content = message.content.trim();
  if (!/^\d+$/.test(content)) return false;

  const result = processToploGuess(message.channelId, message.author.id, content);

  if (result.type === "invalid") return false;

  if (result.type === "win") {
    const reward = 150;
    addBalance(message.author.id, reward);

    const embed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle("🎯 Tačno pogodio!")
      .setDescription(
        `🔥🔥🔥 <@${message.author.id}> je pogodio/la broj **${result.answer}**!\n\n` +
        `Nagrada: ${formatMoney(reward)}\n\n` +
        `Ukupno pokušaja: **${session.guesses.length + 1}**`
      )
      .setFooter({ text: "Koristi .toplo za novu igru" });

    await message.reply({ embeds: [embed] });
    return true;
  }

  if (result.type === "hint") {
    const higher = result.guess !== undefined && session.answer > result.guess ? "⬆️ Više!" : "⬇️ Niže!";

    const embed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle(`${result.emoji} ${result.label}`)
      .setDescription(
        `<@${message.author.id}> je rekao **${result.guess}** — ${higher}\n\n` +
        `Opseg: **${session.minRange} — ${session.maxRange}**`
      );

    await message.reply({ embeds: [embed] });
    return true;
  }

  return false;
}
