import { Page } from 'playwright'
import { sendMessage } from '../telegram-bot'
import { logger, storeErrorMessage, incorrectCurrency } from '../utils'
import { Browser, StoreForScrapping, ScrappingResult } from '../types'

// Pre-purchase page
async function tryGetPriceFromPrePurchasePage(page: Page) {
  try {
    const offersButton = await page.waitForSelector(
      '[aria-label="Просмотреть предложения"]',
      {
        state: 'visible',
      },
    )

    await offersButton.click()

    const offer = await page.waitForSelector(
      '.pi-dropdown-flyout.pi-flyout button:nth-child(2)',
    )
    const str = (await offer.textContent()) as string
    const strArr = str.split(' ')
    const priceStr = strArr[strArr.length - 1].slice(4)

    if (Number.isNaN(+priceStr) || priceStr === '') {
      throw new Error(`Всратая цена: ${priceStr}`)
    }

    return priceStr
  } catch (e) {
    return undefined
  }
}

// Usually page
async function tryGetPriceFromUsualPage(page: Page) {
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

    const finalResult = price.slice(4)

    if (Number.isNaN(+finalResult) || finalResult === '') {
      throw new Error(`Всратая цена: ${finalResult}`)
    }

    if (incorrectCurrency(currency)) {
      throw new Error(`Всратая валюта: ${currency}`)
    }

    return {
      price: finalResult,
      currency,
    }
  } catch (e) {
    return undefined
  }
}

export async function xboxStore(
  { page, browser }: { page: Page; browser: Browser },
  store: StoreForScrapping,
  result: ScrappingResult,
) {
  try {
    const priceObj = await tryGetPriceFromUsualPage(page)

    if (priceObj) {
      result.push({
        game_id: store.game_id,
        store: {
          ...priceObj,
          link: store.url,
          type: store.type,
        },
      })

      logger(`Successfully scrap page: ${store.url}`, 'success')

      await browser.close()
    } else {
      const price = await tryGetPriceFromPrePurchasePage(page)

      if (price) {
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
      } else {
        throw new Error("We can't get price")
      }
    }
  } catch (e) {
    logger(`Failed scrap page: ${store.url}`, 'error')
    sendMessage(storeErrorMessage(store.url, e))
    console.error(e)

    await browser.close()
  }
}
