import { Message, EmbedBuilder } from "discord.js";
import { getBalance, getTopBalances, formatMoney } from "../economy.js";

export async function handleNovcanik(message: Message): Promise<void> {
  const balance = getBalance(message.author.id);

  const embed = new EmbedBuilder()
    .setColor(0x000000)
    .setTitle(`💰 Novčanik — ${message.author.username}`)
    .setDescription(`Vaš trenutni balans:\n\n# ${formatMoney(balance)}`)
    .setThumbnail(message.author.displayAvatarURL())
    .setFooter({ text: "Zaradite više sa .quiz, .slots, .kaladont, .wordle" });

  await message.reply({ embeds: [embed] });
}

export async function handleLestvica(message: Message): Promise<void> {
  const top = getTopBalances(10);

  if (top.length === 0) {
    await message.reply("Još niko nema poena!");
    return;
  }

  const medals = ["🥇", "🥈", "🥉"];
  const list = top
    .map((entry, i) => {
      const medal = medals[i] ?? `**${i + 1}.**`;
      return `${medal} <@${entry.userId}> — ${formatMoney(entry.balance)}`;
    })
    .join("\n");

  const embed = new EmbedBuilder()
    .setColor(0x000000)
    .setTitle("🏆 Tabela najbogatijih")
    .setDescription(list)
    .setFooter({ text: "Igraj igrice da zaradiš više!" });

  await message.reply({ embeds: [embed] });
}
