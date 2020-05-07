import { IItemAffixStats, SimpleItemAffixStatsMetadata, IItemAffixStatsMetadata } from './IItemAffixStats';
import { AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { SkillVM } from 'src/Models/SkillVM';
import { IEquippableStat } from 'src/Models/InventoryModels/InventoryDetailModels/IEquippableStat';
import { IItemAffix } from '../IItemAffix';
import { Helpers } from 'src/_Helpers/helpers';

export class ItemSkillStats implements IItemAffixStats, IEquippableStat {
    Level: number;
    Amount: number;
    PowerLevel:number
    AffixData: SkillVM;
    CategoryStats: AffixCategoryEnum;
    InputMeta: IItemAffixStatsMetadata;
    OutputMeta: IItemAffixStatsMetadata;

    constructor(category:AffixCategoryEnum, affixData:SkillVM, level:number, powerLevel:number) {
        this.Level = level;
        this.CategoryStats = category;
        this.AffixData = affixData;
        this.PowerLevel = powerLevel;

        if (this.AffixData) {
            if (this.AffixData.level > this.Level / (this.AffixData.tier * 3)) {
                this.AffixData.level = Math.round(this.AffixData.tier * 3);
            }
        }

        this.InputMeta = new SimpleItemAffixStatsMetadata();
        this.OutputMeta = new SimpleItemAffixStatsMetadata();
        this.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.InputMeta.SelectedStat = Helpers.getPropertyByValue(AffixCategoryEnum, this.CategoryStats);
        this.OutputMeta.SelectedCategoryStat = "BasicStat";
        this.OutputMeta.SelectedStat = "SkillEmpower";
        this.OutputMeta.SelectedEquipStat = (this.AffixData || {name:"SkillNotSelected"}).name;
    }
    
    updateEquippedStats: (src: IItemAffix, affix: IItemAffix) => IItemAffix;

    GetDescription(): string {
        return this.AffixData ? "+ " + ((this.AffixData.level + this.PowerLevel) || 1) + " to " + this.AffixData.name + " (" + this.AffixData.className + " only)" : "";
    }
}
