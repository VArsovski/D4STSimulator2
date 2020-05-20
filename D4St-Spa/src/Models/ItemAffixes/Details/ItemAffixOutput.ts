import { AffixCategoryEnum, ItemAffixSTatsEnum } from 'src/_Enums/itemAffixEnums';
import { IItemAffixStats, IItemAffixStatsMetadata, SimpleItemAffixStatsMetadata, SimpleAffixStats } from './IItemAffixStats';
import { IItemAffix } from '../IItemAffix';
import { IEquippableAffixStat } from 'src/Models/IEquippableStatDetails/IEquippableAffixStat';

export class ItemAffixOutput implements IEquippableAffixStat {
    CategoryStat?: AffixCategoryEnum;
    AffixData:any;
    SelectedAffixType:ItemAffixSTatsEnum;
    Amount: number;
    CategoryStats: AffixCategoryEnum;
    EquippableStatData: IItemAffixStats;
    updateEquippedStats: (src:any, affix:IItemAffix) => any;
    getZeroStats: (src: any) => any;

    constructor(category: AffixCategoryEnum, affixData:IEquippableAffixStat) {
        this.CategoryStat = category;
        this.AffixData = affixData;
        this.EquippableStatData = new SimpleAffixStats();
        this.EquippableStatData.OutputMeta = affixData ? (affixData.EquippableStatData || { OutputMeta: new SimpleItemAffixStatsMetadata()}).OutputMeta : new SimpleItemAffixStatsMetadata();
        if (affixData) {
            this.EquippableStatData = new SimpleAffixStats();
            this.updateEquippedStats = (this.AffixData as IEquippableAffixStat).updateEquippedStats;
            this.getZeroStats = () => { this.Amount = 0; return this; }
        }
    }
}
