import { IItemAffixStats } from './IItemAffixStats';
import { LegendaryStatsEnum, AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { IEquippableStat, IEquippableInventoryModel } from 'src/Models/InventoryDetailModels/IEquippableStat';
import { IItemAffix } from '../IItemAffix';

export class ItemLegendaryStats implements IItemAffixStats, IEquippableStat {
    Amount: number;
    Type:LegendaryStatsEnum;
    SelectedStat: string;
    SelectedEquipStat: string;

    constructor(category: AffixCategoryEnum, type:LegendaryStatsEnum, amount?:number) {
        this.Type = type;
        this.Amount = amount;
    }
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    CategoryStats: AffixCategoryEnum;

    GetDescription(): string {
        return Helpers.getPropertyByValue(LegendaryStatsEnum, this.Type);
    }

}