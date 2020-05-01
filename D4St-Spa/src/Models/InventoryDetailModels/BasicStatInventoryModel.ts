import { IBasicStatInventoryModel } from './IBasicStatInventoryModel';
import { IEquippableInventoryModel } from './IEquippableStat';

export class BasicStatInventoryModel implements IBasicStatInventoryModel, IEquippableInventoryModel {
    Amount:number;
    Regen:number;
    AmountPercentage:number;
    AmountPercentageRegen:number;
    SelectedStat: string;
    SelectedEquipStat: string;

    constructor(amount:number, regen:number, amountP:number, amountRP:number) {
        this.Amount = amount;
        this.Regen = regen;
        this.AmountPercentage = amountP;
        this.AmountPercentageRegen = amountRP;
    }
}
