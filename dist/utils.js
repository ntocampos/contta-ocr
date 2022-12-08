"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseItemPrices = exports.parseItemNames = void 0;
const mathjs_1 = require("mathjs");
const titleRegex = /(\b[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ0-9-]*(?: [a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ0-9-]*)*\b)/g;
const priceRegex = /(\d+ ?(\.|,)\d\d\b)/g;
const toDecimal = (text) => {
    const cleanMatch = text.replace(',', '.').replace(' ', '');
    return parseFloat(cleanMatch);
};
const removeSmallNames = (match) => match && match[0].length > 2;
const getOccurrences = (matchList) => {
    const output = {};
    matchList.forEach((match) => {
        const term = match[0];
        output[term] = output[term] ? output[term] + 1 : 1;
    });
    return output;
};
const parseItemNames = (input) => {
    const matches = input.matchAll(titleRegex);
    const matchesArray = [...matches];
    const occurrences = getOccurrences(matchesArray);
    const stdDeviation = (0, mathjs_1.std)(Object.values(occurrences));
    const meanValue = (0, mathjs_1.mean)(Object.values(occurrences));
    const filteredMatches = matchesArray
        .filter(removeSmallNames)
        .filter((match) => {
        const frequency = occurrences[match[0]];
        const diff = Math.abs(frequency - meanValue);
        return diff < stdDeviation;
    });
    return filteredMatches.map((match) => ({
        text: match[0].toLowerCase(),
        index: match.index !== undefined ? match.index : -1,
    }));
};
exports.parseItemNames = parseItemNames;
const parseItemPrices = (input) => {
    const matches = input.matchAll(priceRegex);
    const matchesArray = [...matches];
    return matchesArray.map((match) => ({
        text: match[0],
        index: match.index !== undefined ? match.index : -1,
        decimal: toDecimal(match[0]),
    }));
};
exports.parseItemPrices = parseItemPrices;
//# sourceMappingURL=utils.js.map