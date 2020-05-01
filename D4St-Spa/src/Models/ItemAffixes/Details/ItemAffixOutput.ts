import { AffixCategoryEnum, ItemAffixSTatsEnum } from 'src/_Enums/itemAffixEnums';
import { IItemAffixStats } from './IItemAffixStats';
import { IEquippableStat, IEquippableInventoryModel } from 'src/Models/InventoryDetailModels/IEquippableStat';
import { IItemAffix } from '../IItemAffix';

export class ItemAffixOutput implements IEquippableStat {
    CategoryStat?: AffixCategoryEnum;
    AffixData:any;
    SelectedAffixType:ItemAffixSTatsEnum;
    SelectedEquipStat:string;
    SelectedStat: string;

    constructor(category: AffixCategoryEnum, affixData:IItemAffixStats) {
        this.CategoryStat = category;
        this.AffixData = affixData;
        if (affixData) {
            this.SelectedEquipStat = affixData.SelectedEquipStat;
            this.updateEquippedStats = (this.AffixData as IEquippableStat).updateEquippedStats;
        }
    }
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;
}
