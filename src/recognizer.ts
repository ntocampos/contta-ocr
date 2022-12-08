import { createWorker } from 'tesseract.js'
import { Options } from './parseBill'

const recognizer = async (imagePath: string, opts: Options) => {
  const worker = await createWorker({
    logger: opts?.logger || (() => undefined),
    errorHandler: opts?.errorHandler || (() => undefined),
  })
  const language = opts?.language || 'por'

  await worker.loadLanguage(language)
  await worker.initialize(language)

  const {
    data: { text },
  } = await worker.recognize(imagePath)

  await worker.terminate()

  return text
}

export default recognizer
