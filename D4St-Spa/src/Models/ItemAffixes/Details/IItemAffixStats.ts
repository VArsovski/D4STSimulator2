import { AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';

export interface IItemAffixStats {
    Amount:number;
    CategoryStats:AffixCategoryEnum;
    GetDescription():string;
}
