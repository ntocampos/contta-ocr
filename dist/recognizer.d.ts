import { Options } from './parseBill';
declare const recognizer: (imagePath: string, opts: Options) => Promise<string>;
export default recognizer;
