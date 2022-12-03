import { createWorker } from "tesseract.js";
import fs from "fs";

const extensions = [".jpeg", ".jpg", ".png"];
const files = fs.readdirSync("./images/");

files
  .filter((filename) =>
    extensions.some((extension) => filename.includes(extension))
  )
  .forEach(async (filename) => {
    const name = stripExtension(filename);
    const outputName = `output/${name}_${new Date().getTime()}_output.txt`;
    const text = await recognize_worker(filename)
    
    fs.writeFile(outputName, text, () => console.log("file written"));
  });

async function recognize_worker(filename) {
  const worker = await createWorker();
  
  await worker.loadLanguage("por");
  await worker.initialize("por");
  // await worker.setParameters({ tessedit_char_whitelist: "0123456789AÁÃBCDEÉÊFGHIÍJKLMNOÃPQRSTUÚVWYXZ.,$ " });
  const {
    data: { text },
  } = await worker.recognize(`./images/${filename}`);

  await worker.terminate();

  return text
}

function stripExtension(filename) {
  const index = filename.lastIndexOf(".");
  return filename.slice(0, index);
}
