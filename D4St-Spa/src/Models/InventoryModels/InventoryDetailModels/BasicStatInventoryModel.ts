import { IBasicStatInventoryModel } from './IBasicStatInventoryModel';

export class BasicStatInventoryModel implements IBasicStatInventoryModel {
    Amount:number;
    Regen:number;
    Return:number;
    AmountPercentage:number;
    AmountPercentageRegen:number;

    constructor(amount?:number, regen?:number, amountP?:number, amountRP?:number, ret?:number) {
        this.Amount = amount || 0;
        this.Regen = regen || 0;
        this.AmountPercentage = amountP || 0;
        this.AmountPercentageRegen = amountRP || 0;
        this.Return = ret || 0;
    }
}
