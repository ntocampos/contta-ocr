import { std, mean } from 'mathjs'
import { Options } from './parseBill'

type Ocurrences = {
  [key: string]: number
}

type TitleMatch = {
  text: string
  index: number
}

export type PriceMatch = {
  text: string
  index: number
  decimal: number
}

const titleRegex =
  /(\b[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ0-9-]*(?: [a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ0-9-]*)*\b)/g

const priceRegex = /(\d+ ?(\.|,|\s)\d\d\b)/g

const toDecimal = (text: string): number => {
  const cleanMatch = text.replace(',', '.').replace(' ', '')
  return parseFloat(cleanMatch)
}

const removeSmallNames = (match: RegExpMatchArray) =>
  match && match[0].length > 2

const getOccurrences = (matchList: RegExpMatchArray[]): Ocurrences => {
  const output: Ocurrences = {}

  matchList.forEach((match) => {
    const term = match[0]
    output[term] = output[term] ? output[term] + 1 : 1
  })

  return output
}

export const parseItemNames = (input: string, opts: Options): TitleMatch[] => {
  opts.logger?.('Parsing item names')
  const matches = input.matchAll(titleRegex)
  const matchesArray = [...matches]
  opts.logger?.({ matchesArray })

  const occurrences = getOccurrences(matchesArray)
  const stdDeviation = std(Object.values(occurrences)) as unknown as number
  const meanValue = mean(Object.values(occurrences))

  const filteredMatches = matchesArray
    .filter(removeSmallNames)
    .filter((match) => {
      const frequency = occurrences[match[0]]
      const diff = Math.abs(frequency - meanValue)
      return diff <= stdDeviation
    })

  return filteredMatches.map((match) => ({
    text: match[0].toLowerCase(),
    index: match.index !== undefined ? match.index : -1,
  }))
}

export const parseItemPrices = (input: string, opts: Options): PriceMatch[] => {
  opts.logger?.('Parsing item prices')
  const matches = input.matchAll(priceRegex)
  const matchesArray = [...matches]
  opts.logger?.({ matchesArray })

  return matchesArray.map((match) => ({
    text: match[0],
    index: match.index !== undefined ? match.index : -1,
    decimal: toDecimal(match[0]),
  }))
}
