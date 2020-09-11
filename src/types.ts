import { FirefoxBrowser, ChromiumBrowser, WebKitBrowser } from 'playwright'

export enum Browsers {
  Firefox = 'firefox',
  Chromium = 'chromium',
  Webkit = 'webkit',
}

type Platform = 'ps_4' | 'pc' | 'xbox_one' | 'nintendo_switch'

type RawgParentPlatform =
  | { id: 1; name: 'PC'; slug: 'pc' }
  | { id: 3; name: 'Xbox'; slug: 'xbox' }
  | { id: 2; name: 'PlayStation'; slug: 'playstation' }
  | { id: 7; name: 'Nintendo'; slug: 'nintendo' }

type RawgPlatform =
  | {
      games_count: number
      id: 187
      image: null
      image_background: 'https://media.rawg.io/media/games/84d/84da2ac3fdfc6507807a1808595afb12.jpg'
      name: 'PlayStation 5'
      slug: 'playstation5'
      year_end: null
      year_start: 2020
    }
  | {
      games_count: number
      id: 186
      image: null
      image_background: 'https://media.rawg.io/media/games/6fa/6fa8b2653502a9c134ec40c573d5d0cb.jpg'
      name: 'Xbox Series X'
      slug: 'xbox-series-x'
      year_end: null
      year_start: 2020
    }
  | {
      games_count: number
      id: 18
      image: null
      image_background: 'https://media.rawg.io/media/games/d82/d82990b9c67ba0d2d09d4e6fa88885a7.jpg'
      name: 'PlayStation 4'
      slug: 'playstation4'
      year_end: null
      year_start: null
    }
  | {
      games_count: number
      id: 1
      image: null
      image_background: 'https://media.rawg.io/media/games/9fa/9fa63622543e5d4f6d99aa9d73b043de.jpg'
      name: 'Xbox One'
      slug: 'xbox-one'
      year_end: null
      year_start: null
    }
  | {
      games_count: number
      id: 4
      image: null
      image_background: 'https://media.rawg.io/media/games/7fa/7fa0b586293c5861ee32490e953a4996.jpg'
      name: 'PC'
      slug: 'pc'
      year_end: null
      year_start: null
    }
  | {
      games_count: number
      id: 7
      image: null
      image_background: 'https://media.rawg.io/media/games/8d6/8d69eb6c32ed6acfd75f82d532144993.jpg'
      name: 'Nintendo Switch'
      slug: 'nintendo-switch'
      year_end: null
      year_start: null
    }

type RawgStoreObject =
  | {
      domain: 'microsoft.com'
      games_count: number
      id: 2
      image_background: 'https://media.rawg.io/media/games/b45/b45575f34285f2c4479c9a5f719d972e.jpg'
      name: 'Xbox Store'
      slug: 'xbox-store'
    }
  | {
      domain: 'store.playstation.com'
      games_count: number
      id: 3
      image_background: 'https://media.rawg.io/media/games/d82/d82990b9c67ba0d2d09d4e6fa88885a7.jpg'
      name: 'PlayStation Store'
      slug: 'playstation-store'
    }
  | {
      domain: 'nintendo.com'
      games_count: number
      id: 6
      image_background: 'https://media.rawg.io/media/games/25c/25c4776ab5723d5d735d8bf617ca12d9.jpg'
      name: 'Nintendo Store'
      slug: 'nintendo'
    }
  | {
      domain: 'store.steampowered.com'
      games_count: number
      id: 1
      image_background: 'https://media.rawg.io/media/games/b7b/b7b8381707152afc7d91f5d95de70e39.jpg'
      name: 'Steam'
      slug: 'steam'
    }
  | {
      domain: 'epicgames.com'
      games_count: number
      id: 11
      image_background: 'https://media.rawg.io/media/games/0af/0af85e8edddfa55368e47c539914a220.jpg'
      name: 'Epic Games'
      slug: 'epic-games'
    }
  | {
      domain: 'gog.com'
      games_count: 2704
      id: 5
      image_background: 'https://media.rawg.io/media/games/c89/c89ca70716080733d03724277df2c6c7.jpg'
      name: 'GOG'
      slug: 'gog'
    }

type RawgStore = {
  id: number
  store: RawgStoreObject
  url: string
}

interface Rawg {
  achievements_count: number
  added: number
  added_by_status: {
    owned: number
    toplay: number
    yet: number
  }
  additions_count: 0
  alternative_names: string[]
  background_image: string // Image URL
  background_image_additional: string // Image URL
  clip: {
    clip: string // Video URL
    clips: {
      320: string // Video URL
      640: string // Video URL
      full: string // Video URL
    }
    preview: string // Image URL
    video: string // YouTube Video Id
  }
  description: string
  description_raw: string
  developers: {
    id: number
    games_count: number
    image_background: string
    name: string
    slug: string
  }[]
  dominant_color: string // HEX color
  // TODO: Need ENUM for esrb_rating
  esrb_rating: {
    id: 1
    name: string
    slug: string
  }
  game_series_count: number
  // TODO: Need ENUM for genres
  genres: {
    id: number
    games_count: number
    image_background: string // Image URL
    name: string
    slug: string
  }[]
  metacritic: number
  metacritic_platforms: {
    metascore: number
    platform: {
      name: string
      platform: number
      slug: string
    }
    url: string // URL
  }[]
  metacritic_url: string // URL
  movies_count: number
  name: string
  name_original: string
  parent_achievements_count: number
  parent_platforms: { platform: RawgParentPlatform }[]
  parents_count: number
  platforms: {
    platform: RawgPlatform
    released_at: string
    requirements: null | string
  }[]
  playtime: number
  publishers: {
    games_count: number
    id: number
    image_background: string
    name: string
    slug: string
  }[]
  rating: number
  rating_top: number
  ratings: []
  ratings_count: number
  reactions: {}
  reddit_count: number
  reddit_description: string
  reddit_logo: string
  reddit_name: string
  reddit_url: string
  released: string
  reviews_count: number
  reviews_text_count: number
  saturated_color: string
  screenshots_count: number
  stores: RawgStore[]
  suggestions_count: number
  tags: []
  tba: boolean
  twitch_count: number
  updated: string
  user_game: null | boolean
  website: string
  youtube_count: number
}

export interface Game {
  id: number
  title: string
  description: string
  released: string
  release_id: number
  cover: string
  details_cover?: string
  site?: string
  trailer_url?: string
  metacritic_url?: string
  platforms: Platform[]
  width: number
}

export interface Store {
  link: string
  type: string
}

export interface GameDetails {
  id: number
  title: string
  description: string
  released: string
  release_id: number
  cover: string
  details_cover?: string
  site?: string
  trailer_url?: string
  metacritic_url?: string
  platforms: Platform[]
  width: number
  type: 'game'
  stores: Store[]
  rawg_io_fields: Rawg
}

export type StoreForScrapping = {
  game_id: number
  url: string
  type:
    | 'playstation-store'
    | 'gog'
    | 'epic-games'
    | 'steam'
    | 'xbox-store'
    | 'nintendo'
}

export type ScrappingResult = {
  game_id: number
  store: {
    price: string
    currency: string
    link: string
    type: string
  }
}[]

export type ResultToDB = {
  id: number
  stores: {
    price: string
    currency: string
    link: string
    type: string
  }[]
}[]

export type Browser = FirefoxBrowser | ChromiumBrowser | WebKitBrowser
