import { Page } from 'playwright'
import { sendMessage } from '../telegram-bot'
import { storeErrorMessage, logger } from '../utils'
import { Browser, StoreForScrapping, ScrappingResult } from '../types'

export async function epicGames(
  { page, browser }: { page: Page; browser: Browser },
  store: StoreForScrapping,
  result: ScrappingResult,
) {
  try {
    const el = await page.waitForSelector('[data-component="Price"]', {
      state: 'attached',
    })
    const price = (await el.textContent()) as string
    const formattedPrice = price.replace(/\D/g, '').slice(0, -2)

    if (Number.isNaN(+formattedPrice) || formattedPrice === '') {
      throw new Error(`Всратая цена: ${formattedPrice}`)
    }

    result.push({
      game_id: store.game_id,
      store: {
        price: formattedPrice,
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
