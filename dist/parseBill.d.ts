import { PriceMatch } from './utils';
type Item = {
    name: string;
    amount: number;
    unitPrice: number | undefined;
    total: number;
    itemSection: string;
    priceMatches: PriceMatch[];
};
type Outlier = {
    itemSection: string;
    priceMatches: PriceMatch[];
};
export type Options = {
    language?: 'por' | 'eng';
    logger?: (message: string | object) => void;
    errorHandler?: (error: unknown) => void;
};
declare const parseBill: (imagePath: string, opts?: Options) => Promise<{
    items: Item[];
    outliers: Outlier[];
}>;
export default parseBill;
