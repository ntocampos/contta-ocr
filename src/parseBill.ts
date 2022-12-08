import recognizer from './recognizer'
import { parseItemPrices, parseItemNames, PriceMatch } from './utils'

type Item = {
  name: string
  amount: number
  unitPrice: number | undefined
  total: number
  itemSection: string
  priceMatches: PriceMatch[]
}

type Outlier = {
  itemSection: string
  priceMatches: PriceMatch[]
}

export type Options = {
  language?: 'por' | 'eng'
  logger?: (message: string) => void
  errorHandler?: (error: unknown) => void
}

const parseBill = async (
  imagePath: string,
  opts: Options
): Promise<{
  items: Item[]
  outliers: Outlier[]
}> => {
  const recognizedText = await recognizer(imagePath, opts)
  const textLength = recognizedText.length

  const namesList = parseItemNames(recognizedText)
  const outliers: Outlier[] = []

  const items = namesList
    .map((titleMatch, index, list) => {
      const nextMatchIndex = list[index + 1]?.index || textLength
      const itemSection = recognizedText.slice(titleMatch.index, nextMatchIndex)
      const priceSection = recognizedText.slice(
        titleMatch.index + titleMatch.text.length,
        nextMatchIndex
      )
      const priceMatches = parseItemPrices(priceSection)

      if (priceMatches.length === 1)
        return {
          name: titleMatch.text,
          amount: 1,
          unitPrice: undefined,
          total: priceMatches[0].decimal,
          itemSection,
          priceMatches,
        }
      else if (priceMatches.length === 0)
        return {
          name: titleMatch.text,
          amount: priceMatches[1].decimal / priceMatches[0].decimal,
          unitPrice: priceMatches[0].decimal,
          total: priceMatches[1].decimal,
          itemSection,
          priceMatches,
        }
      else {
        outliers.push({
          itemSection,
          priceMatches,
        })

        return null
      }
    })
    .filter((item) => item !== null) as Item[]

  return { items, outliers }
}

export default parseBill
