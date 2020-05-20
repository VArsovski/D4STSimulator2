import { AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';

export interface IItemAffixStats {
    Amount:number;
    CategoryStats:AffixCategoryEnum;
    InputMeta: IItemAffixStatsMetadata;
    OutputMeta: IItemAffixStatsMetadata;
    // SelectedCategoryStat:string;
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

export class SimpleAffixStats implements IItemAffixStats {
    Amount: number;
    CategoryStats: AffixCategoryEnum;
    InputMeta: IItemAffixStatsMetadata;
    OutputMeta: IItemAffixStatsMetadata;
    constructor() {
        this.InputMeta = new SimpleItemAffixStatsMetadata();
        this.OutputMeta = new SimpleItemAffixStatsMetadata();
    }
}
