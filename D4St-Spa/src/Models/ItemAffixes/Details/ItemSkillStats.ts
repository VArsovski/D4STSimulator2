import { SimpleItemAffixStatsMetadata, IItemAffixStatsMetadata, IItemAffixStats } from './IItemAffixStats';
import { AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { SkillVM } from 'src/Models/SkillVM';
import { IItemAffix } from '../IItemAffix';
import { Helpers } from 'src/_Helpers/helpers';
import { SkillStatEquippable } from 'src/Models/IEquippableStatDetails/SkillStatEquippable';
import { IEquippableAffixStat } from 'src/Models/IEquippableStatDetails/IEquippableAffixStat';
import { IDescribable } from '../IDescribable';

export class ItemSkillStats implements IEquippableAffixStat, IDescribable {
    Level: number;
    Amount: number;
    PowerLevel:number
    AffixData: SkillVM;
    CategoryStats: AffixCategoryEnum;
    InputMeta: IItemAffixStatsMetadata;
    OutputMeta: IItemAffixStatsMetadata;
    EquippableStatData: IItemAffixStats;
    updateEquippedStats: (src: IItemAffix, affix: IItemAffix) => IItemAffix;
    getZeroStats: (src: any) => any;

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
        this.OutputMeta.SelectedStat = "Skills";
        this.OutputMeta.SelectedEquipStat = (this.AffixData || {name:"SkillNotSelected"}).name;
        this.getZeroStats = (src) => { (src as ItemSkillStats).Amount = 0; return src }
        this.updateEquippedStats = new SkillStatEquippable(this.OutputMeta.SelectedStat, this.OutputMeta.SelectedEquipStat).updateEquippedStats;
    }

    GetDescription(): string {
        return this.AffixData ? "+ " + ((this.AffixData.level + this.PowerLevel) || 1) + " to " + this.AffixData.name + " (" + this.AffixData.className + " only)" : "";
    }
}
