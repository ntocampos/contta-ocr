"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Jimp = require('jimp');
const parsePath = (path) => {
    const pathRegex = /(.+\/)([^\/]+)\.([^\/.]+)$/;
    const match = path.match(pathRegex);
    return {
        path: match === null || match === void 0 ? void 0 : match[1],
        filename: match === null || match === void 0 ? void 0 : match[2],
        extension: match === null || match === void 0 ? void 0 : match[3],
    };
};
const prepareForOcr = (imagePath) => __awaiter(void 0, void 0, void 0, function* () {
    const imageJimp = yield Jimp.read(imagePath);
    const { path, filename, extension } = parsePath(imagePath);
    const outputFilePath = `${path}${filename}-prepared.${extension}`;
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
        .write(outputFilePath);
    return outputFilePath;
});
exports.default = prepareForOcr;
//# sourceMappingURL=prepare.js.map