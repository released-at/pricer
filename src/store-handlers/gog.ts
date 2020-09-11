/* eslint-disable no-eval */
import { Page } from 'playwright'
import { sendMessage } from '../telegram-bot'
import { storeErrorMessage, logger } from '../utils'
import { Browser, StoreForScrapping, ScrappingResult } from '../types'

export async function gog(
  { page, browser }: { page: Page; browser: Browser },
  store: StoreForScrapping,
  result: ScrappingResult,
) {
  try {
    const el = await page.waitForSelector('button.cart-button')
    const data = await el.getAttribute('gog-track-event')
    result.push({
      game_id: store.game_id,
      store: {
        price: eval(`(${data})`).product_price,
        currency: 'RUB',
        link: store.url,
        type: store.type,
      },
    })

    logger(`Successfully scrap page: ${store.url}`, 'success')

    await browser.close()
  } catch (e) {
    logger(`Failed scrap page: ${store.url}`, 'error')
    sendMessage(storeErrorMessage(store.url, e))
    console.error(e)

    await browser.close()
  }
}
