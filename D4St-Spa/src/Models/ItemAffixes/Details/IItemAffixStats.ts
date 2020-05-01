import { AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';

export interface IItemAffixStats {
    Amount:number;
    CategoryStats:AffixCategoryEnum;
    // SelectedStat:string;
    SelectedEquipStat:string;
    GetDescription():string;
}
