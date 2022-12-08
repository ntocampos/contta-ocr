type TitleMatch = {
    text: string;
    index: number;
};
export type PriceMatch = {
    text: string;
    index: number;
    decimal: number;
};
export declare const parseItemNames: (input: string) => TitleMatch[];
export declare const parseItemPrices: (input: string) => PriceMatch[];
export {};
