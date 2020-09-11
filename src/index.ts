import fetch from 'node-fetch'
import format from 'date-fns/format'
import { scrap } from './scrap'
import { API_KEY } from './config'
import { endpoints } from './constants'
import { sendMessage } from './telegram-bot'
import { logger } from './utils'

async function main() {
  sendMessage(
    `Start scrapping ${format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")}`,
  )

  logger('Start scrapping', 'process')

  try {
    const data = await scrap()

    logger(`Start update stores`, 'process')

    const response = await fetch(endpoints.BATCH_UPDATE, {
      method: 'post',
      body: JSON.stringify({
        batch: data,
      }),
      headers: {
        'api-key': API_KEY,
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      console.log('Stores successfully updated')
      logger(`Stores successfully updated`, 'success')
    } else {
      throw new Error(
        `Can't update stores. Error ${response.status}: ${
          response.statusText
        } ${format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")}`,
      )
    }
  } catch (e) {
    logger(`Stores update was failed`, 'error')
    console.error(e)
    process.exit(1)
  }
}

main()
