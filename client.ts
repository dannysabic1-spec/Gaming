import {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
} from "discord.js";
import { handleMessage } from "./messageHandler.js";
import { registerCommands } from "./registerCommands.js";
import { createPrefixHandler, PREFIX } from "./prefixHandler.js";
import { loadEconomy } from "./economy.js";
import { logger } from "../lib/logger.js";

let botClient: Client | null = null;

export async function startBot(): Promise<void> {
  const token = process.env["DISCORD_BOT_TOKEN"];
  if (!token) {
    logger.warn("DISCORD_BOT_TOKEN not set — Discord bot will not start");
    return;
  }

  loadEconomy();

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Message, Partials.Channel],
  });

  const handlePrefixCommand = createPrefixHandler(client);

  client.once(Events.ClientReady, async (readyClient) => {
    logger.info({ tag: readyClient.user.tag }, "Discord bot connected");
    await registerCommands();
  });

  client.on(Events.MessageCreate, async (message) => {
    try {
      if (message.author.bot) return;
      if (!message.guildId) return;

      if (message.content.startsWith(PREFIX)) {
        await handlePrefixCommand(message);
        return;
      }

      await handleMessage(message);
    } catch (err) {
      logger.error({ err }, "Error handling MessageCreate");
    }
  });

  client.on(Events.Error, (err) => {
    logger.error({ err }, "Discord client error");
  });

  await client.login(token);
  botClient = client;
}

export function getBot(): Client | null {
  return botClient;
}
