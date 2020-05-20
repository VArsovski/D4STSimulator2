import { ICCEffectAffixData } from './ICCEffectDetailsInventoryModel';

export class SimpleCCEffectAffixData implements ICCEffectAffixData {
    ReduceChance: number;
    ReducePercentage: number;
    ReduceAmount: number;
    Chance: number;
    Percentage: number;
    Amount: number;

    constructor() {
        this.ReduceChance = 0;
        this.ReducePercentage = 0;
        this.ReduceAmount = 0;
        this.Chance = 0;
        this.Percentage = 0;
        this.Amount = 0;
    }
}
