import recognizer from './recognizer'
import { parseItemPrices, parseItemNames, PriceMatch } from './utils'
import prepareForOcr from './prepare'

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
  logger?: (message: string | object) => void
  errorHandler?: (error: unknown) => void
}

const parseBill = async (
  imagePath: string,
  opts: Options = {}
): Promise<{
  items: Item[]
  outliers: Outlier[]
}> => {
  const preparedImagePath = await prepareForOcr(imagePath)
  // const _unpreparedText = await recognizer(imagePath, opts)
  const recognizedText = await recognizer(preparedImagePath, opts)
  opts.logger?.({ recognizedText })

  const textLength = recognizedText.length

  const namesList = parseItemNames(recognizedText, opts)
  const outliers: Outlier[] = []

  const items = namesList
    .map((titleMatch, index, list) => {
      const nextMatchIndex = list[index + 1]?.index || textLength
      const itemSection = recognizedText.slice(titleMatch.index, nextMatchIndex)
      const priceSection = recognizedText.slice(
        titleMatch.index + titleMatch.text.length,
        nextMatchIndex
      )
      const priceMatches = parseItemPrices(priceSection, opts)

      if (priceMatches.length === 1) {
        return {
          name: titleMatch.text,
          amount: 1,
          unitPrice: undefined,
          total: priceMatches[0].decimal,
          itemSection,
          priceMatches,
        }
      } else if (priceMatches.length === 2) {
        return {
          name: titleMatch.text,
          amount: priceMatches[1].decimal / priceMatches[0].decimal,
          unitPrice: priceMatches[0].decimal,
          total: priceMatches[1].decimal,
          itemSection,
          priceMatches,
        }
      } else if (priceMatches.length > 2) {
        outliers.push({
          itemSection,
          priceMatches,
        })
      }

      return null
    })
    .filter((item) => item !== null) as Item[]

  return { items, outliers }
}

// parseBill('images/jabre-cropped.png').then((result) =>
//   console.log(JSON.stringify(result, null, 2))
// )

export default parseBill
