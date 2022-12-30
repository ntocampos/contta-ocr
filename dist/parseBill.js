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
const recognizer_1 = require("./recognizer");
const utils_1 = require("./utils");
const prepare_1 = require("./prepare");
const parseBill = (imagePath, opts = {}) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const preparedImagePath = yield (0, prepare_1.default)(imagePath);
    // const _unpreparedText = await recognizer(imagePath, opts)
    const recognizedText = yield (0, recognizer_1.default)(preparedImagePath, opts);
    (_a = opts.logger) === null || _a === void 0 ? void 0 : _a.call(opts, { recognizedText });
    const textLength = recognizedText.length;
    const namesList = (0, utils_1.parseItemNames)(recognizedText, opts);
    const outliers = [];
    const items = namesList
        .map((titleMatch, index, list) => {
        var _a;
        const nextMatchIndex = ((_a = list[index + 1]) === null || _a === void 0 ? void 0 : _a.index) || textLength;
        const itemSection = recognizedText.slice(titleMatch.index, nextMatchIndex);
        const priceSection = recognizedText.slice(titleMatch.index + titleMatch.text.length, nextMatchIndex);
        const priceMatches = (0, utils_1.parseItemPrices)(priceSection, opts);
        if (priceMatches.length === 1) {
            return {
                name: titleMatch.text,
                amount: 1,
                unitPrice: undefined,
                total: priceMatches[0].decimal,
                itemSection,
                priceMatches,
            };
        }
        else if (priceMatches.length === 2) {
            return {
                name: titleMatch.text,
                amount: priceMatches[1].decimal / priceMatches[0].decimal,
                unitPrice: priceMatches[0].decimal,
                total: priceMatches[1].decimal,
                itemSection,
                priceMatches,
            };
        }
        else if (priceMatches.length > 2) {
            outliers.push({
                itemSection,
                priceMatches,
            });
        }
        return null;
    })
        .filter((item) => item !== null);
    return { items, outliers };
});
// parseBill('images/jabre-cropped.png').then((result) =>
//   console.log(JSON.stringify(result, null, 2))
// )
exports.default = parseBill;
//# sourceMappingURL=parseBill.js.map