import { firefox, chromium, webkit, LaunchOptions } from 'playwright'
import { sendMessage } from './telegram-bot'
import { BROWSER, HEADLESS } from './config'
import { Browser, Browsers } from './types'

export async function runBrowser(attempts = 0): Promise<Browser | void> {
  const options: LaunchOptions = { headless: HEADLESS }
  let browser

  try {
    switch (BROWSER) {
      case Browsers.Firefox:
        browser = await firefox.launch(options)
        break
      case Browsers.Chromium:
        browser = await chromium.launch(options)
        break
      case Browsers.Webkit:
        browser = await webkit.launch(options)
        break
    }

    return browser
  } catch (e) {
    if (attempts === 3) {
      console.error(e)
      sendMessage(e.message)
      return
    }

    const browser = (await runBrowser(attempts + 1)) as Browser

    return browser
  }
}
