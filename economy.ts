import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { logger } from "../lib/logger.js";

const DATA_DIR = "./bot-data";
const ECONOMY_FILE = `${DATA_DIR}/economy.json`;
const STARTING_BALANCE = 1000;

let balances: Record<string, number> = {};

export function loadEconomy(): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    if (existsSync(ECONOMY_FILE)) {
      balances = JSON.parse(readFileSync(ECONOMY_FILE, "utf-8")) as Record<string, number>;
      logger.info({ users: Object.keys(balances).length }, "Economy loaded");
    }
  } catch (err) {
    logger.error({ err }, "Failed to load economy, starting fresh");
    balances = {};
  }
}

function save(): void {
  try {
    writeFileSync(ECONOMY_FILE, JSON.stringify(balances, null, 2));
  } catch (err) {
    logger.error({ err }, "Failed to save economy");
  }
}

export function getBalance(userId: string): number {
  if (!(userId in balances)) {
    balances[userId] = STARTING_BALANCE;
    save();
  }
  return balances[userId]!;
}

export function addBalance(userId: string, amount: number): number {
  const current = getBalance(userId);
  balances[userId] = Math.max(0, current + amount);
  save();
  return balances[userId]!;
}

export function deductBalance(userId: string, amount: number): boolean {
  const current = getBalance(userId);
  if (current < amount) return false;
  balances[userId] = current - amount;
  save();
  return true;
}

export function getTopBalances(limit = 10): Array<{ userId: string; balance: number }> {
  return Object.entries(balances)
    .map(([userId, balance]) => ({ userId, balance }))
    .sort((a, b) => b.balance - a.balance)
    .slice(0, limit);
}

export function formatMoney(amount: number): string {
  return `**${amount.toLocaleString("sr-RS")} 💵**`;
}
