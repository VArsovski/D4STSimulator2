import { IItemAffixStats, IItemAffixStatsMetadata, SimpleItemAffixStatsMetadata, SimpleAffixStats } from './IItemAffixStats';
import { LegendaryStatsEnum, AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { IItemAffix } from '../IItemAffix';
import { IEquippableAffixStat } from 'src/Models/IEquippableStatDetails/IEquippableAffixStat';
import { LegendaryEquippableStat } from 'src/Models/IEquippableStatDetails/LegendaryEquippableStat';

export class ItemLegendaryStats implements IEquippableAffixStat {
    Amount: number;
    Type:LegendaryStatsEnum;
    SelectedCategoryStat: string;
    CategoryStats: AffixCategoryEnum;
    EquippableStatData: IItemAffixStats;
    getZeroStats: (src: any) => any;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    constructor(category: AffixCategoryEnum, type:LegendaryStatsEnum, amount?:number) {
        this.Type = type;
        this.Amount = amount;
        this.EquippableStatData = new SimpleAffixStats();
        this.EquippableStatData.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.EquippableStatData.InputMeta.SelectedStat = Helpers.getPropertyByValue(AffixCategoryEnum, this.CategoryStats);
        this.EquippableStatData.OutputMeta.SelectedCategoryStat = "LegendaryStatData";
        this.EquippableStatData.OutputMeta.SelectedStat = Helpers.getPropertyByValue(LegendaryStatsEnum, this.Type);
        this.EquippableStatData.OutputMeta.SelectedEquipStat = "TODO:LegendaryStatDetail";
        this.getZeroStats = (src) => {
            if (src)
             (src as ItemLegendaryStats).Amount = 0;
            return src;
        };
        this.updateEquippedStats = new LegendaryEquippableStat().updateEquippedStats;
    }

    GetDescription(): string {
        return Helpers.getPropertyByValue(LegendaryStatsEnum, this.Type);
    }
}
