import { logger } from "../lib/logger.js";

export async function registerCommands(): Promise<void> {
  logger.info("Bot uses prefix commands (.) — no slash commands to register");
}
