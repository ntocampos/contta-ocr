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
const tesseract_js_1 = require("tesseract.js");
const recognizer = (imagePath, opts) => __awaiter(void 0, void 0, void 0, function* () {
    const worker = yield (0, tesseract_js_1.createWorker)({
        logger: (opts === null || opts === void 0 ? void 0 : opts.logger) || (() => undefined),
        errorHandler: (opts === null || opts === void 0 ? void 0 : opts.errorHandler) || (() => undefined),
    });
    const language = (opts === null || opts === void 0 ? void 0 : opts.language) || 'por';
    yield worker.loadLanguage(language);
    yield worker.initialize(language);
    const { data: { text }, } = yield worker.recognize(imagePath);
    yield worker.terminate();
    return text;
});
exports.default = recognizer;
//# sourceMappingURL=recognizer.js.map