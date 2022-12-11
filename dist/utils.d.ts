import { Options } from './parseBill';
type TitleMatch = {
    text: string;
    index: number;
};
export type PriceMatch = {
    text: string;
    index: number;
    decimal: number;
};
export declare const parseItemNames: (input: string, opts: Options) => TitleMatch[];
export declare const parseItemPrices: (input: string, opts: Options) => PriceMatch[];
export {};
