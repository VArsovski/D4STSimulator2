import { IBasicStatInventoryModel } from './IBasicStatInventoryModel';

export class BasicStatInventoryModel implements IBasicStatInventoryModel {
    Amount:number;
    Regen:number;
    Return:number;
    AmountPercentage:number;
    AmountPercentageRegen:number;

    constructor(amount:number, regen:number, amountP:number, amountRP:number, ret:number) {
        this.Amount = amount;
        this.Regen = regen;
        this.AmountPercentage = amountP;
        this.AmountPercentageRegen = amountRP;
        this.Return = ret;
    }
}
