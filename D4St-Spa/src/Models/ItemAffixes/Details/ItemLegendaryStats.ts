import { IItemAffixStats } from './IItemAffixStats';
import { LegendaryStatsEnum, AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';

export class ItemLegendaryStats implements IItemAffixStats {
    Amount: number;
    Type:LegendaryStatsEnum;

    constructor(category: AffixCategoryEnum, type:LegendaryStatsEnum, amount?:number) {
        this.Type = type;
        this.Amount = amount;
    }
    CategoryStats: AffixCategoryEnum;

    GetDescription(): string {
        return Helpers.getPropertyByValue(LegendaryStatsEnum, this.Type);
    }

}