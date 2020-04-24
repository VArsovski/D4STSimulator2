import { AffixCategoryEnum, ItemAffixSTatsEnum } from 'src/_Enums/itemAffixEnums';
import { IItemAffixStats } from './IItemAffixStats';

export class ItemAffixOutput {
    CategoryStat?: AffixCategoryEnum;
    AffixData:IItemAffixStats
    SelectedAffixType:ItemAffixSTatsEnum;

    constructor(category: AffixCategoryEnum, affixData:IItemAffixStats) {
        this.CategoryStat = category;
        this.AffixData = affixData;
    }
}
