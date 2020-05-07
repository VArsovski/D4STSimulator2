import { IItemAffixStats, IItemAffixStatsMetadata, SimpleItemAffixStatsMetadata } from './IItemAffixStats';
import { LegendaryStatsEnum, AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { IEquippableStat } from 'src/Models/InventoryModels/InventoryDetailModels/IEquippableStat';
import { IItemAffix } from '../IItemAffix';

export class ItemLegendaryStats implements IItemAffixStats, IEquippableStat {
    Amount: number;
    Type:LegendaryStatsEnum;

    constructor(category: AffixCategoryEnum, type:LegendaryStatsEnum, amount?:number) {
        this.Type = type;
        this.Amount = amount;
        this.InputMeta = new SimpleItemAffixStatsMetadata();
        this.OutputMeta = new SimpleItemAffixStatsMetadata();
        this.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.InputMeta.SelectedStat = Helpers.getPropertyByValue(AffixCategoryEnum, this.CategoryStats);
        this.OutputMeta.SelectedCategoryStat = "LegendaryStat";
        this.OutputMeta.SelectedStat = Helpers.getPropertyByValue(LegendaryStatsEnum, this.Type);
        this.OutputMeta.SelectedEquipStat = "TODO:LegendaryStatDetail";
    }

    InputMeta: IItemAffixStatsMetadata;
    OutputMeta: IItemAffixStatsMetadata;
    SelectedCategoryStat: string;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    CategoryStats: AffixCategoryEnum;

    GetDescription(): string {
        return Helpers.getPropertyByValue(LegendaryStatsEnum, this.Type);
    }
}
