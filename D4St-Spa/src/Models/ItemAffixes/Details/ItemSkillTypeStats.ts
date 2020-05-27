import { SkillCategoryTypesEnum, SkillSpellStatsEnum } from 'src/_Enums/triggerAffixEnums';
import { IEquippableAffixStat } from 'src/Models/IEquippableStatDetails/IEquippableAffixStat';
import { IDescribable } from '../IDescribable';
import { IItemAffix } from '../IItemAffix';
import { IItemAffixStats, SimpleAffixStats } from './IItemAffixStats';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';

export class ItemSkillTypeStats implements IEquippableAffixStat, IDescribable {
    Level: number;
    PowerLevel: number;
    Type:SkillCategoryTypesEnum;
    Amount:number;
    Percentage:number;
    EquippableStatData: IItemAffixStats;
    getZeroStats: (src: any) => any;
    updateEquippedStats: (src: any, affix: IItemAffix) => any;
    SelectedType: SkillSpellStatsEnum;
    private statsCalculated: boolean;

    constructor(level:number, powerLevel:number, type:SkillCategoryTypesEnum, selectedType:SkillSpellStatsEnum, amount:number, percentage:number) {
        this.Level = level;
        this.PowerLevel = powerLevel;
        this.Type = type;
        this.SelectedType = selectedType;
        this.Amount = amount;
        this.Percentage = percentage;

        if (!this.statsCalculated) {
            this.Amount = this.Amount ? new CalculationsHelper().getEmpoweredValue(this.Amount, this.PowerLevel) : 0;
            this.Percentage = this.Percentage ? new CalculationsHelper().getEmpoweredValue(this.Percentage, this.PowerLevel) : 0;
            this.statsCalculated = true;
        }

        this.EquippableStatData = new SimpleAffixStats();
        this.EquippableStatData.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.EquippableStatData.InputMeta.SelectedStat = Helpers.getPropertyByValue(SkillCategoryTypesEnum, this.Type);
        this.EquippableStatData.OutputMeta.SelectedCategoryStat = "TriggerData";
        this.EquippableStatData.OutputMeta.SelectedStat = Helpers.getPropertyByValue(SkillCategoryTypesEnum, this.Type);
        this.EquippableStatData.OutputMeta.SelectedEquipStat = Helpers.getPropertyByValue(SkillSpellStatsEnum, this.SelectedType);
    }
    GetDescription(): string {
        var quantifier = this.Percentage ? this.Percentage + "%" : this.Amount;
        return "Skills of type " + Helpers.getPropertyByValue(SkillCategoryTypesEnum, this.Type) + " have their " + Helpers.getPropertyByValue(SkillSpellStatsEnum, this.SelectedType) + " by " + quantifier;
    }
}
