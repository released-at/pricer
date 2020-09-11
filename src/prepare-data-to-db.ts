import fs from 'fs'
import { logger } from './utils'
import { ScrappingResult, ResultToDB } from './types'

export async function prepareDataToDB(result: ScrappingResult) {
  logger(`Start preparing data to send DB`, 'process')

  fs.writeFileSync(`${Date.now()}.json`, JSON.stringify(result))
  const data: ResultToDB = []

  result.forEach(({ game_id, store }) => {
    const index = data.findIndex(resultItem => resultItem.id === game_id)

    if (index !== -1) {
      data[index].stores.push(store)
    } else {
      data.push({
        id: game_id,
        stores: [store],
      })
    }
  })

  logger(`Successfully preparing data to send DB`, 'success')

  return data
}
