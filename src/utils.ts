import winston from 'winston'
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

const wnstn = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({
      filename: `logs/${format(new Date(), 'yyyy_MM_dd__HH_mm_ss')}_error.log`,
      level: 'error',
    }),
    new winston.transports.File({
      filename: `logs/${format(new Date(), 'yyyy_MM_dd__HH_mm_ss')}_info.log`,
      level: 'info',
    }),
  ],
})

export function logger(message: string, type: 'process' | 'success' | 'error') {
  if (ENV === 'test') return

  switch (type) {
    case 'process': {
      const text = `${chalk.cyan(`[${type}]`)} ${message} at ${chalk.gray(ts)}`
      console.log(text)
      wnstn.info(`[${ts}] ${message}`)
      break
    }
    case 'success': {
      const text = `${chalk.green(`[${type}]`)} ${message} at ${chalk.gray(ts)}`
      console.log(text)
      wnstn.info(`[${ts}] ${message}`)
      break
    }
    case 'error': {
      const text = `${chalk.red(`[${type}]`)} ${message} at ${chalk.gray(ts)}`
      console.log(text)
      wnstn.error(`[${ts}] ${message}`)
      break
    }
  }
}
