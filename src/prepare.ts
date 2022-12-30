const Jimp = require('jimp')

const parsePath = (path: string) => {
  const pathRegex = /(.+\/)([^\/]+)\.([^\/.]+)$/
  const match = path.match(pathRegex)

  return {
    path: match?.[1],
    filename: match?.[2],
    extension: match?.[3],
  }
}

const prepareForOcr = async (imagePath: string) => {
  const imageJimp = await Jimp.read(imagePath)
  const { path, filename, extension } = parsePath(imagePath)
  const outputFilePath = `${path}${filename}-prepared.${extension}`

  imageJimp
    .grayscale()
    .contrast(0.5)
    .brightness(0.5)
    .threshold({ max: 145, autoGrayScale: false })
    .invert()
    .normalize()
    // .posterize(2)
    // .sepia()
    // .gaussian(1)
    // .blur(1)
    // .unsharpMask(1, 1, 1)
    // .convolute([
    //   [-1, -1, -1],
    //   [-1, 8, -1],
    //   [-1, -1, -1],
    // ])
    .color([
      { apply: 'red', params: [50] },
      { apply: 'green', params: [50] },
      { apply: 'blue', params: [50] },
    ])
    .write(outputFilePath)

  return outputFilePath
}

export default prepareForOcr
