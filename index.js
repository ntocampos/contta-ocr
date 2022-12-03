import Tesseract from "tesseract.js";
import fs from "fs";

const extensions = [".jpeg", ".jpg", ".png"];
const files = fs.readdirSync("./images/");

files
  .filter((filename) =>
    extensions.some((extension) => filename.includes(extension))
  )
  .forEach((filename) => {
    recognize(
      `./images/${filename}`,
      ({ data: { text } }) => {
        const name = stripExtension(filename)
        fs.writeFile(`./output/${name}_output.txt`, text, () => console.log("file written"));
      },
      { logger: (m) => console.log(m) }
    );
  });

function recognize(filename, callback, config) {
  Tesseract.recognize(filename, "por", config).then(callback);
}

function stripExtension(filename) {
  const index = filename.lastIndexOf('.')
  return filename.slice(0, index)
}
