import { AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';

export interface IItemAffixStats {
    Amount:number;
    CategoryStats:AffixCategoryEnum;
    // SelectedStat:string;
    // SelectedEquipStat:string;
    // SelectedCategoryStat:string;
    InputMeta: IItemAffixStatsMetadata;
    OutputMeta: IItemAffixStatsMetadata;
    GetDescription():string;
}

export interface IItemAffixStatsMetadata {
    SelectedStat: string;
    SelectedEquipStat: string;
    SelectedCategoryStat: string;
}

export class SimpleItemAffixStatsMetadata implements IItemAffixStatsMetadata {
    SelectedStat: string;
    SelectedEquipStat: string;
    SelectedCategoryStat: string;
    constructor() { }
}
