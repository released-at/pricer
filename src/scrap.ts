import { forEachSeries } from 'p-iteration'
import { runBrowser } from './run-browser'
import { openPage } from './open-page'
import { prepareDataToScrap } from './prepare-data-to-scrap'
import { prepareDataToDB } from './prepare-data-to-db'
import {
  playstationStore,
  gog,
  epicGames,
  steam,
  nintendo,
  xboxStore,
} from './store-handlers'
import { sendMessage } from './telegram-bot'
import { logger } from './utils'
import { ScrappingResult } from './types'

export async function scrap() {
  try {
    const data = await prepareDataToScrap()

    if (!data) throw new Error("Haven't data for scrapping")

    const result: ScrappingResult = []

    logger('Start scrapping', 'process')

    await forEachSeries(data, async store => {
      try {
        const browser = await runBrowser()

        if (!browser) throw new Error("Can't open browser")

        const page = await openPage(browser, store.url)

        if (!page) {
          sendMessage(`Can't open page: ${store.url}`)
          throw new Error(`Can't open page: ${store.url}`)
        }

        logger(`Scrap page: ${store.url}`, 'process')

        if (store.type === 'playstation-store') {
          await playstationStore({ page, browser }, store, result)
        }

        if (store.type === 'gog') {
          await gog({ page, browser }, store, result)
        }

        if (store.type === 'epic-games') {
          await epicGames({ page, browser }, store, result)
        }

        if (store.type === 'steam') {
          await steam({ page, browser }, store, result)
        }

        if (store.type === 'xbox-store') {
          await xboxStore({ page, browser }, store, result)
        }

        if (store.type === 'nintendo') {
          await nintendo({ page, browser }, store, result)
        }
      } catch (e) {
        logger(`Can't scrap page`, 'error')
        console.error(e)
      }
    })

    const dataToDB = await prepareDataToDB(result)

    return dataToDB
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
