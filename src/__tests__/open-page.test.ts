import { Page } from 'playwright'
import { openPage } from '../open-page'
import { Browser } from '../types'

async function goto(url: string): Promise<Response | null> {
  const response = {} as Response | null

  return response
}

async function newPage(): Promise<Page> {
  const page = {
    goto,
  } as Page

  return page
}

let attempts = 0

async function newPageWith5Attempts(): Promise<Page> {
  const page = {
    goto,
  } as Page

  if (attempts === 5) {
    attempts = 0
    return page
  }

  attempts += 1
  throw new Error('Error')
}

async function newPageWithError(): Promise<Page> {
  throw new Error('Error')
}

const browser = {
  newPage,
} as Browser

const browserWith5Error = {
  newPage: newPageWith5Attempts,
} as Browser

const brokenBrowser = {
  newPage: newPageWithError,
} as Browser

test('open page correctly', async () => {
  await expect(openPage(browser, 'https://google.com')).resolves.toStrictEqual({
    goto,
  })
})

test('open page after 5 attempts', async () => {
  await expect(
    openPage(browserWith5Error, 'https://google.com'),
  ).resolves.toStrictEqual({
    goto,
  })
})

test('broken open page', async () => {
  await expect(
    openPage(brokenBrowser, 'https://google.com'),
  ).resolves.toBeUndefined()
})
