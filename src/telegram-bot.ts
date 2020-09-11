import TelegramBot from 'node-telegram-bot-api'
import { ENV, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from './config'

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true })

export function sendMessage(message: string): void {
  if (ENV === 'test') return

  bot.sendMessage(TELEGRAM_CHAT_ID, message)
}
