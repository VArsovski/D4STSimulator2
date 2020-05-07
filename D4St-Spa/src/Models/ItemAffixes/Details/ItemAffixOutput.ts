import { AffixCategoryEnum, ItemAffixSTatsEnum } from 'src/_Enums/itemAffixEnums';
import { IItemAffixStats, IItemAffixStatsMetadata, SimpleItemAffixStatsMetadata } from './IItemAffixStats';
import { IEquippableStat } from 'src/Models/InventoryModels/InventoryDetailModels/IEquippableStat';
import { IItemAffix } from '../IItemAffix';

export class ItemAffixOutput implements IEquippableStat, IItemAffixStats {
    CategoryStat?: AffixCategoryEnum;
    AffixData:any;
    SelectedAffixType:ItemAffixSTatsEnum;
    Amount: number;
    CategoryStats: AffixCategoryEnum;
    InputMeta: IItemAffixStatsMetadata;
    OutputMeta: IItemAffixStatsMetadata;

    // SelectedEquipStat:string;
    // SelectedStat: string;

    constructor(category: AffixCategoryEnum, affixData:IItemAffixStats) {
        this.CategoryStat = category;
        this.AffixData = affixData;
        this.InputMeta = new SimpleItemAffixStatsMetadata();
        this.OutputMeta = affixData ? affixData.OutputMeta : new SimpleItemAffixStatsMetadata();
        if (affixData) {
            // this.SelectedEquipStat = affixData.SelectedEquipStat;
            // this.OutputMeta = new SimpleItemAffixStatsMetadata();
            this.updateEquippedStats = (this.AffixData as IEquippableStat).updateEquippedStats;
        }
    }
    GetDescription(): string {
        throw new Error("Method not implemented.");
    }
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;
}
