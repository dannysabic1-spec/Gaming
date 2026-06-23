import { Message, EmbedBuilder } from "discord.js";
import { getBalance, deductBalance, addBalance, formatMoney } from "../economy.js";

const SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "⭐", "7️⃣", "💎"];

function spin(): string[] {
  return [
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]!,
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]!,
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]!,
  ];
}

function getMultiplier(reels: string[]): { multiplier: number; label: string } {
  const [a, b, c] = reels;
  if (a === b && b === c) {
    if (a === "💎") return { multiplier: 50, label: "💎 DIJAMANTSKI DŽEKPOT 💎" };
    if (a === "7️⃣") return { multiplier: 20, label: "7️⃣ SEDMICE 7️⃣" };
    if (a === "⭐") return { multiplier: 10, label: "⭐ ZVEZDE ⭐" };
    return { multiplier: 5, label: "Tri ista! 🎉" };
  }
  if (a === b || b === c || a === c) {
    return { multiplier: 1.5, label: "Dva ista 👌" };
  }
  return { multiplier: 0, label: "Nema dobitka 😔" };
}

const DEFAULT_BET = 100;
const MAX_BET = 10000;

export async function handleSlots(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const balance = getBalance(userId);

  let bet = DEFAULT_BET;
  if (args[0]) {
    if (args[0].toLowerCase() === "sve" || args[0].toLowerCase() === "all") {
      bet = Math.min(balance, MAX_BET);
    } else {
      bet = parseInt(args[0], 10);
    }
  }

  if (isNaN(bet) || bet <= 0) {
    await message.reply("❌ Unesite validan iznos! Npr: `.slots 500`");
    return;
  }
  if (bet > MAX_BET) {
    await message.reply(`❌ Maksimalan ulog je ${formatMoney(MAX_BET)}!`);
    return;
  }
  if (balance < bet) {
    await message.reply(
      `❌ Nemate dovoljno novca! Vaš balans: ${formatMoney(balance)}`
    );
    return;
  }

  deductBalance(userId, bet);
  const reels = spin();
  const { multiplier, label } = getMultiplier(reels);

  let winAmount = 0;
  let color = 0x000000;
  let description: string;

  if (multiplier > 0) {
    winAmount = Math.floor(bet * multiplier);
    addBalance(userId, winAmount);
    const profit = winAmount - bet;
    color = profit > 0 ? 0x000000 : 0x000000;
    description =
      `${reels.join("  ┃  ")}\n\n` +
      `**${label}**\n\n` +
      `Dobitak: ${formatMoney(winAmount)}\n` +
      `Profit: ${profit >= 0 ? "+" : ""}${formatMoney(profit)}\n` +
      `Novi balans: ${formatMoney(getBalance(userId))}`;
  } else {
    description =
      `${reels.join("  ┃  ")}\n\n` +
      `**${label}**\n\n` +
      `Izgubili ste: ${formatMoney(bet)}\n` +
      `Novi balans: ${formatMoney(getBalance(userId))}`;
  }

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle("🎰 Slot Mašina")
    .setDescription(description)
    .setFooter({ text: `Ulog: ${bet} 💵 • ${message.author.username}` });

  await message.reply({ embeds: [embed] });
}
