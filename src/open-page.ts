import { Page } from 'playwright'
import { sendMessage } from './telegram-bot'
import { ENV, OPEN_PAGE_TIMEOUT } from './config'
import { logger } from './utils'
import { Browser } from './types'

export async function openPage(
  browser: Browser,
  url: string,
  attempts = 0,
): Promise<Page | undefined> {
  try {
    logger(`Open page ${url}. Attempts: ${attempts}`, 'process')

    const page = await browser.newPage()
    await page.goto(url, {
      waitUntil: 'load',
      timeout: OPEN_PAGE_TIMEOUT,
    })

    return page
  } catch (e) {
    if (attempts === 5) {
      console.error(e)
      sendMessage(e.message)
      return
    }

    const page = (await openPage(browser, url, attempts + 1)) as Page

    return page
  }
}
