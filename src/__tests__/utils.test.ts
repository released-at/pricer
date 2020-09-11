import { datify, storeErrorMessage, incorrectCurrency } from '../utils'

test('convert date string to date object', () => {
  expect(datify('2020-09-03')).toStrictEqual(new Date('2020-09-03'))
})

test('create store error message (with throw new Error)', () => {
  const storeUrl =
    'https://www.epicgames.com/store/en-us/product/spellbreak/home?lang=en-us'

  expect(storeErrorMessage(storeUrl, { message: 'Bad price' })).toBe(
    `
Store ${storeUrl} has problem:

Bad price
`,
  )
})

test('create store error message (with JS object)', () => {
  const storeUrl =
    'https://www.epicgames.com/store/en-us/product/spellbreak/home?lang=en-us'

  expect(storeErrorMessage(storeUrl, { a: 1, b: 2 })).toBe(
    `
Store ${storeUrl} has problem:

{"a":1,"b":2}
`,
  )
})

test('check correct currency', () => {
  expect(incorrectCurrency('USD')).toBe(false)
})

test('check incorrect currency', () => {
  expect(incorrectCurrency('asdasdas')).toBe(true)
})
