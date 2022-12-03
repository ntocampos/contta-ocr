import Tesseract from 'tesseract.js';

Tesseract.detect(
  './images/IMG_0291 Large.jpeg',
  'por',
  { logger: m => console.log(m) }
).then(({ data: { text } }) => {
  console.log(text);
})