import compareDesc from 'date-fns/compareDesc'
import { map } from 'p-iteration'
import { loadGames, loadGame } from './load-data'
import { fixedStores } from './fixed-stores'
import { datify, logger } from './utils'

const availableStores = [
  'playstation-store',
  'gog',
  'epic-games',
  'steam',
  'xbox-store',
  'nintendo',
]

export async function prepareDataToScrap() {
  try {
    const games = await loadGames()

    if (!games) throw new Error(`Can't load games`)

    const copyGames = [...games]

    // Because we want update new games first and then old
    const sortedGames = copyGames.sort((a, b) =>
      compareDesc(datify(a.released), datify(b.released)),
    )

    // High-level games request don't contains rawg.io stores
    // Because we should request every game
    // TODO: change an approach
    const gamesWithDetails = await map(sortedGames, async ({ release_id }) => {
      const game = await loadGame(release_id)

      if (!game) throw new Error(`Can't load game with id: ${release_id}`)

      return game
    })

    // We need only games with rawg stores
    const gamesWithStores = gamesWithDetails.filter(
      game => game.rawg_io_fields?.stores?.length,
    )

    logger(
      `Filter games without stores: All games: ${games.length}, games with stores: ${gamesWithStores.length}`,
      'process',
    )

    // Create stores array for scrapping
    const stores = gamesWithStores
      .map(({ rawg_io_fields, id, title }) =>
        rawg_io_fields.stores
          // Only stores that we show on released.at site
          .filter(({ store }) => availableStores.includes(store.slug))
          .map(store => {
            const needFixStore = fixedStores.find(game => game.id === id)
            if (needFixStore) {
              const fixedStoreUrl = needFixStore.stores.find(
                st => st.type === store.store.slug,
              )?.url

              if (fixedStoreUrl) {
                logger(
                  `Patch ${store.store.slug} for ${title}. Incorrect link: ${store.url}. Patched link: ${fixedStoreUrl}`,
                  'success',
                )
              }

              return {
                game_id: id,
                url: fixedStoreUrl || store.url,
                type: store.store.slug,
              }
            }

            return {
              game_id: id,
              url: store.url,
              type: store.store.slug,
            }
          }),
      )
      .flat()

    logger(
      `Stores prepared for scrapping. All stores: ${stores.length}`,
      'success',
    )

    return stores
  } catch (e) {
    console.error(e)
  }
}
