import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
} from "discord.js";
import {
  startGame,
  stopGame,
  getSession,
  getLeaderboard,
} from "../gameState.js";

export const data = new SlashCommandBuilder()
  .setName("kaladont")
  .setDescription("Komande za Kaladont igru")
  .addSubcommand((sub) =>
    sub.setName("start").setDescription("Pokreni novu igru Kaladonta")
  )
  .addSubcommand((sub) =>
    sub.setName("stop").setDescription("Zaustavi trenutnu igru")
  )
  .addSubcommand((sub) =>
    sub.setName("status").setDescription("Prikaži trenutno stanje igre")
  )
  .addSubcommand((sub) =>
    sub.setName("rezultati").setDescription("Prikaži rezultate igrača")
  );

export async function execute(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  const sub = interaction.options.getSubcommand();
  const channelId = interaction.channelId;
  const guildId = interaction.guildId ?? "dm";

  if (sub === "start") {
    const existing = getSession(channelId);
    if (existing?.active) {
      await interaction.reply({
        content: "❌ Igra već teče u ovom kanalu! Koristi `/kaladont stop` da je zaustaviš.",
        ephemeral: true,
      });
      return;
    }

    const session = startGame(channelId, guildId, interaction.user.id);
    const displayWord = session.currentWord.toUpperCase();
    const suffix = session.currentSuffix.toUpperCase();

    const embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle(`**${displayWord}**`)
      .setDescription(
        `Napiši reč koja počinje sa **${suffix}**\n\n` +
        `• **Mogućih reči:** ${session.possibleWordsLeft}\n` +
        `• **Za pobedu:** ${session.pointsToWin}`
      )
      .setFooter({ text: "Kaladont • Piši reči direktno u chat!" });

    await interaction.reply({ embeds: [embed] });
    return;
  }

  if (sub === "stop") {
    const session = getSession(channelId);
    if (!session?.active) {
      await interaction.reply({ content: "❌ Nema aktivne igre.", ephemeral: true });
      return;
    }

    const leaderboard = getLeaderboard(channelId);
    stopGame(channelId);

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
      .setColor(Colors.Red)
      .setTitle("🛑 Igra je zaustavljena")
      .addFields({ name: "Rezultati", value: scores })
      .setFooter({ text: "Kaladont • Koristi /kaladont start za novu igru" });

    await interaction.reply({ embeds: [embed] });
    return;
  }

  if (sub === "status") {
    const session = getSession(channelId);
    if (!session?.active) {
      await interaction.reply({
        content: "❌ Nema aktivne igre. Koristi `/kaladont start` da počneš.",
        ephemeral: true,
      });
      return;
    }

    const displayWord = session.currentWord.toUpperCase();
    const suffix = session.currentSuffix.toUpperCase();

    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle(`**${displayWord}**`)
      .setDescription(
        `Napiši reč koja počinje sa **${suffix}**\n\n` +
        `• **Mogućih reči:** ${session.possibleWordsLeft}\n` +
        `• **Za pobedu:** ${session.pointsToWin}\n` +
        `• **Iskorišćeno reči:** ${session.usedWords.size}`
      )
      .setFooter({ text: "Kaladont • Piši reči direktno u chat!" });

    await interaction.reply({ embeds: [embed] });
    return;
  }

  if (sub === "rezultati") {
    const leaderboard = getLeaderboard(channelId);

    if (leaderboard.length === 0) {
      await interaction.reply({
        content: "Još niko nije skupio poene u ovoj igri.",
        ephemeral: true,
      });
      return;
    }

    const scores = leaderboard
      .slice(0, 10)
      .map(
        (e, i) =>
          `${i + 1}. <@${e.userId}> — **${e.score}** ${e.score === 1 ? "poen" : "poena"}`
      )
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor(Colors.Gold)
      .setTitle("🏆 Tabela rezultata")
      .setDescription(scores)
      .setFooter({ text: "Kaladont • Trenutna igra" });

    await interaction.reply({ embeds: [embed] });
    return;
  }
}
