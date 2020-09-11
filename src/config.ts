import dotenv from 'dotenv'
import { Browsers } from './types'

dotenv.config()

export const ENV = process.env.NODE_ENV as 'test' | 'prod'
export const API_KEY = process.env.API_KEY as string
export const API_URL = process.env.API_URL as string
export const TELEGRAM_BOT_TOKEN = process.env.TG_BOT_TOKEN as string
export const TELEGRAM_CHAT_ID = Number(process.env.TG_CHAT_ID as string) // ID for https://t.me/released_prices
export const BROWSER = process.env.BROWSER as Browsers
export const HEADLESS = JSON.parse(process.env.HEADLESS as string) as boolean
export const OPEN_PAGE_TIMEOUT = Number(process.env.OPEN_PAGE_TIMEOUT as string)
