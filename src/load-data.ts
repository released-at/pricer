import fetch from 'node-fetch'
import { endpoints } from './constants'
import { logger } from './utils'
import { Game, GameDetails } from './types'

export async function loadGames(): Promise<Game[] | void> {
  logger('Start load games', 'process')

  try {
    const response = await fetch(endpoints.GAMES)
    const json = await response.json()

    if (response.ok) {
      logger(`Games was loaded. All games: ${json.length}`, 'success')
      return json
    } else {
      throw new Error(`${endpoints.GAMES} ${JSON.stringify(json)}`)
    }
  } catch (e) {
    logger(`Can't loading games`, 'error')
    console.error(e)
    process.exit(1)
  }
}

export async function loadGame(
  id: string | number,
  attempts = 0,
): Promise<GameDetails | void> {
  logger(`Start load game with id: ${id}. Attempts: ${attempts}`, 'process')

  try {
    const response = await fetch(endpoints.GAME(id))
    const json = await response.json()

    if (response.ok) {
      logger(`${json.title} was loaded`, 'success')
      return json
    } else {
      throw new Error(`${endpoints.GAME(id)} ${JSON.stringify(json)}`)
    }
  } catch (e) {
    // Because sometimes we have error `invalid-json`
    if (attempts === 5) {
      logger(`Can't loading game with id: ${id}`, 'error')
      console.error(e)
      process.exit(1)
    }

    const game = await loadGame(id, attempts + 1)

    return game
  }
}
