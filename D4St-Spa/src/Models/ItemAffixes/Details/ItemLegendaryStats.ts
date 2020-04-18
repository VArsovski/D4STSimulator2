import { IItemAffixStats } from './IItemAffixStats';
import { LegendaryStatsEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';

export class ItemLegendaryStats implements IItemAffixStats {
    Amount: number;
    Type:LegendaryStatsEnum;

    constructor(type:LegendaryStatsEnum, amount?:number) {
        this.Type = type;
        this.Amount = amount;
    }

    GetDescription(): string {
        return Helpers.getPropertyByValue(LegendaryStatsEnum, this.Type);
    }

}