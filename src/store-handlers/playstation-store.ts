import { Page } from 'playwright'
import { sendMessage } from '../telegram-bot'
import { logger, storeErrorMessage, incorrectCurrency } from '../utils'
import { Browser, StoreForScrapping, ScrappingResult } from '../types'

export async function playstationStore(
  { page, browser }: { page: Page; browser: Browser },
  store: StoreForScrapping,
  result: ScrappingResult,
) {
  try {
    const el = await page.waitForSelector(
      'script[type="application/ld+json"].ember-view',
      {
        state: 'attached',
      },
    )
    const jsonString = (await el.textContent()) as string
    const json = JSON.parse(jsonString)

    if (!json.offers) {
      throw new Error(`Can't scrap price`)
    }

    const price = `${json.offers[0].price}`
    const currency = json.offers[0].priceCurrency

    if (Number.isNaN(+price) || price === '') {
      throw new Error(`Bad price: ${price}`)
    }

    if (incorrectCurrency(currency)) {
      throw new Error(`Bad currency: ${currency}`)
    }

    result.push({
      game_id: store.game_id,
      store: {
        price,
        currency,
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
