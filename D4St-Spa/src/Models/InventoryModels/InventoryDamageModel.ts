import { IDoubleStatAffix } from './InventoryDetailModels/IDoubleStatAffixData';

export class InventoryDamageModel {
    Amount:number;
    Percentage: number;

    constructor() {
        this.Amount = 0;
        this.Percentage = 100;
    }
}

export class InventoryResistanceModel implements IDoubleStatAffix {
    Chance: number;
    Amount:number;
    Percentage: number;
    ReduceChance: number;
    ReduceAmount: number;
    ReducePercentage: number;

    constructor() {
        this.Chance = 0;
        this.Amount = 0;
        this.Percentage = 0;
        this.ReduceChance = 0;
        this.ReduceAmount = 0;
        this.ReducePercentage = 0;
    }
}
