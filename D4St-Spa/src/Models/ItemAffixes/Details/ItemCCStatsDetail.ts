import { CCEffectTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { IEquippableAffixStat } from 'src/Models/IEquippableStatDetails/IEquippableAffixStat';
import { IDescribable } from '../IDescribable';
import { Helpers } from 'src/_Helpers/helpers';
import { IItemAffixStats, SimpleAffixStats } from './IItemAffixStats';
import { IItemAffix } from '../IItemAffix';
import { CCEffectTypesEquippable } from 'src/Models/IEquippableStatDetails/CCEffectTypesEquippable';

export class ItemCCStatsDetail implements IEquippableAffixStat, IDescribable {
    Level: number;
    PowerLevel: number;
    Type:CCEffectTypesEnum;
    Amount:number;
    Percentage:number;

    constructor(level:number, powerLevel:number, amount:number, percentage: number, type:CCEffectTypesEnum) {
        this.Level = level;
        this.PowerLevel = powerLevel;
        this.Type = type;
        this.Amount = amount;
        this.Percentage = percentage;
        this.EquippableStatData = new SimpleAffixStats();
        this.EquippableStatData.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.EquippableStatData.InputMeta.SelectedStat = Helpers.getPropertyByValue(CCEffectTypesEnum, this.Type);
        this.EquippableStatData.OutputMeta.SelectedCategoryStat = "CCEffectsData";
        this.EquippableStatData.OutputMeta.SelectedStat = Helpers.getPropertyByValue(CCEffectTypesEnum, this.Type);
        this.EquippableStatData.OutputMeta.SelectedEquipStat = "ReducePercentage";
        this.updateEquippedStats = new CCEffectTypesEquippable().updateEquippedStats;
        this.getZeroStats = (src) => { console.log("Not implemented"); }
    }
    
    GetDescription(): string {
        var isPercentage = this.Percentage;
        var quantifier = isPercentage ? this.Percentage + "%" : this.Amount;
        var ccDescr = "Reduce CCEffects of type " + Helpers.getPropertyByValue(CCEffectTypesEnum, this.Type) + " by " + quantifier;
        return ccDescr;
    }

    EquippableStatData: IItemAffixStats;
    getZeroStats: (src: any) => any;
    updateEquippedStats: (src: any, affix: IItemAffix) => any;
}
