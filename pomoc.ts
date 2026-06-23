import { Message, EmbedBuilder } from "discord.js";

export async function handlePomoc(message: Message): Promise<void> {
  const embed = new EmbedBuilder()
    .setColor(0x000000)
    .setTitle("📖 Kefalo Bot — Sve komande")
    .addFields(
      {
        name: "🎮 Igre",
        value: [
          "`.kaladont` — Pokreni igru Kaladont (lančanje reči)",
          "`.kaladont stop` — Zaustavi igru",
          "`.wordle` — Pokreni Wordle (pogodi reč od 5 slova)",
          "`.toplo` — Pokreni igru Toplo/Klanno (pogodi broj 1-100)",
          "`.toplo stop` — Zaustavi igru",
          "`.quiz` — Dobij nasumično pitanje i osvoji novac",
        ].join("\n"),
        inline: false,
      },
      {
        name: "🎰 Kockanje",
        value: [
          "`.slots` — Zavrti slot mašinu (ulog: 100 💵)",
          "`.slots [iznos]` — Zavrti sa sopstvenim ulogom",
          "`.slots sve` — Sve na kockanje!",
        ].join("\n"),
        inline: false,
      },
      {
        name: "💰 Ekonomija",
        value: [
          "`.pare` ili `.novcanik` — Proveri svoj balans",
          "`.lestvica` — Top 10 najbogatijih igrača",
        ].join("\n"),
        inline: false,
      },
      {
        name: "📋 Opšte",
        value: [
          "`.pomoc` — Prikaži ovu poruku",
          "`.status` — Status aktivnih igara u kanalu",
        ].join("\n"),
        inline: false,
      },
      {
        name: "ℹ️ Kako funkcioniše ekonomija",
        value:
          "Svaki igrač počinje sa **1.000 💵**.\n" +
          "• Kviz: 100–300 💵 po tačnom odgovoru\n" +
          "• Kaladont pobeda: **500 💵**\n" +
          "• Wordle pobeda: **250 💵** (manje pogađanja = više 💵)\n" +
          "• Toplo/Klanno: **150 💵**\n" +
          "• Slots: zavisi od uloga i srece!",
        inline: false,
      }
    )
    .setFooter({ text: "Kefalo Bot • Kaladont Edition" });

  await message.reply({ embeds: [embed] });
}
