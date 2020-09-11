import chalk from 'chalk'
import format from 'date-fns/format'
import { ENV } from './config'

export function datify(str: string) {
  return new Date(str)
}

export function storeErrorMessage(url: string, error: any) {
  if (error.message) {
    return `
Store ${url} has problem:

${error.message}
`
  }

  return `
Store ${url} has problem:

${JSON.stringify(error)}
`
}

export function incorrectCurrency(curr?: string | null) {
  return curr !== 'RUB' && curr !== 'USD' && curr !== 'EUR'
}

const ts = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")

export function logger(message: string, type: 'process' | 'success' | 'error') {
  if (ENV === 'test') return

  switch (type) {
    case 'process':
      console.log(chalk.cyan(`${ts} ${message}`))
      break
    case 'success':
      console.log(chalk.green(`${ts} ${message}`))
      break
    case 'error':
      console.log(chalk.red(`${ts} ${message}`))
      break
  }
}
