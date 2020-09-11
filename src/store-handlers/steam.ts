import { Page } from 'playwright'
import { sendMessage } from '../telegram-bot'
import { logger, storeErrorMessage, incorrectCurrency } from '../utils'
import { Browser, StoreForScrapping, ScrappingResult } from '../types'

export async function steam(
  { page, browser }: { page: Page; browser: Browser },
  store: StoreForScrapping,
  result: ScrappingResult,
) {
  try {
    const priceEl = await page.waitForSelector('meta[itemprop="price"]', {
      state: 'attached',
    })
    const currencyEl = await page.waitForSelector(
      'meta[itemprop="priceCurrency"]',
      {
        state: 'attached',
      },
    )
    const price = (await priceEl.getAttribute('content')) || ''
    const currency = (await currencyEl.getAttribute('content')) as string

    const finalResult = price.replace(',', '.')

    if (Number.isNaN(+finalResult) || finalResult === '') {
      throw new Error(`Всратая цена: ${finalResult}`)
    }

    if (incorrectCurrency(currency)) {
      throw new Error(`Всратая валюта: ${currency}`)
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
