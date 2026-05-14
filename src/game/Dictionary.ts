import { dictionary, letter_dist } from "./constants/dictionary.json";
export abstract class Dictionary {
    static _dict: Map<string, number> = new Map();
    static _letterDistribution: Map<string, number> = new Map();

    private constructor() {}

    static load_dict(): void {
        for (const word of dictionary) {
            Dictionary.setDict(word, 0);
        }
    }

    static load_letter_dist(): void {
        for (const [key, value] of Object.entries(letter_dist)) {
            Dictionary.setLetterDistribution(key, Math.floor(value * 1000));
        }
    }

    static getDict(key: string): number | undefined {
        return Dictionary._dict.get(key) || -1;
    }

    static setDict(key: string, value: number): void {
        Dictionary._dict.set(key, value);
    }

    static getLetterDistribution(key: string): number | undefined {
        return Dictionary._letterDistribution.get(key);
    }

    static setLetterDistribution(key: string, value: number): void {
        Dictionary._letterDistribution.set(key, value);
    }

    static resetDict(): void {
        for (const word of dictionary) {
            Dictionary.setDict(word, 0);
        }
    }
}

