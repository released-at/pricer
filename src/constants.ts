import { API_URL } from './config'

export const endpoints = {
  GAMES: `${API_URL}/games`,
  GAME: (id: string | number) => `${API_URL}/releases/${id}`,
  BATCH_UPDATE: `${API_URL}/games/prices/batch_update`,
}
