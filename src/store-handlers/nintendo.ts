import { Page } from 'playwright'
import { sendMessage } from '../telegram-bot'
import { storeErrorMessage, logger } from '../utils'
import { Browser, StoreForScrapping, ScrappingResult } from '../types'

// 1 step: try get price from window object
// 2 step: try get sale price from markup
// 3 step: try get price from markup

async function tryGetPriceFromWindowObject(page: Page) {
  try {
    const gameData = await page.evaluate(() => (window as any).game)

    if (!gameData) throw new Error("Haven't window.game object")

    return gameData.msrp as string
  } catch (e) {
    return undefined
  }
}

async function tryGetSalePriceFromMarkup(page: Page) {
  try {
    const saleEl = await page.waitForSelector('span.sale-price', {
      state: 'attached',
    })
    const sale = await saleEl.textContent()
    const finalResult = (sale || '').slice(1)

    if (Number.isNaN(+finalResult) || finalResult === '') {
      throw new Error(`Bad price: ${finalResult}`)
    }

    return finalResult
  } catch (e) {
    return undefined
  }
}

async function tryGetPriceFromMarkup(page: Page) {
  try {
    const priceEl = await page.waitForSelector('span.msrp', {
      state: 'attached',
    })
    const price = await priceEl.textContent()
    const finalResult = (price || '').slice(1)

    if (Number.isNaN(+finalResult) || finalResult === '') {
      throw new Error(`Bad price: ${finalResult}`)
    }

    return finalResult
  } catch (e) {
    return undefined
  }
}

export async function nintendo(
  { page, browser }: { page: Page; browser: Browser },
  store: StoreForScrapping,
  result: ScrappingResult,
) {
  async function pushToResult(price: string) {
    result.push({
      game_id: store.game_id,
      store: {
        price,
        currency: 'USD',
        link: store.url,
        type: store.type,
      },
    })

    logger(`Successfully scrap page: ${store.url}`, 'success')

    await browser.close()
  }

  try {
    const priceFromWindow = await tryGetPriceFromWindowObject(page)

    if (priceFromWindow) {
      await pushToResult(priceFromWindow)
    } else {
      const sale = await tryGetSalePriceFromMarkup(page)

      if (sale) {
        await pushToResult(sale)
      } else {
        const priceFromMarkup = await tryGetPriceFromMarkup(page)

        if (priceFromMarkup) {
          await pushToResult(priceFromMarkup)
        } else {
          throw new Error("We can't get price")
        }
      }
    }
  } catch (e) {
    logger(`Failed scrap page: ${store.url}`, 'error')
    sendMessage(storeErrorMessage(store.url, e))
    console.error(e)

    await browser.close()
  }
}
