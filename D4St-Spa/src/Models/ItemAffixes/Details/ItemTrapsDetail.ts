import { TrapsEnum } from 'src/_Enums/skillEnums';
import { IEquippableAffixStat } from 'src/Models/IEquippableStatDetails/IEquippableAffixStat';
import { IDescribable } from '../IDescribable';
import { IItemAffixStats, SimpleAffixStats } from './IItemAffixStats';
import { IItemAffix } from '../IItemAffix';
import { Helpers } from 'src/_Helpers/helpers';
import { TrapAndSummonStatsEnum } from 'src/_Enums/triggerAffixEnums';

export class ItemTrapsDetail implements IEquippableAffixStat, IDescribable {
    Level: number;
    PowerLevel: number;
    Type:TrapsEnum;
    SelectedStat: TrapAndSummonStatsEnum;
    Amount: number;
    Percentage: number;

    constructor(level:number, powerLevel:number, type:TrapsEnum, selectedStat:TrapAndSummonStatsEnum, amount:number, percentage: number) {
        this.Level = level;
        this.PowerLevel = powerLevel;
        this.Type = type;
        this.SelectedStat = selectedStat;
        this.Amount = amount;
        this.Percentage = percentage;
        this.EquippableStatData = new SimpleAffixStats();
        this.EquippableStatData.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.EquippableStatData.InputMeta.SelectedStat = Helpers.getPropertyByValue(TrapsEnum, this.Type);
        this.EquippableStatData.OutputMeta.SelectedCategoryStat = "TriggerData";
        this.EquippableStatData.OutputMeta.SelectedStat = Helpers.getPropertyByValue(TrapsEnum, this.Type);
        this.EquippableStatData.OutputMeta.SelectedEquipStat = Helpers.getPropertyByValue(TrapAndSummonStatsEnum, this.SelectedStat);;
    }
    GetDescription(): string {
        var isPercentage = this.Percentage;
        var quantifier = isPercentage ? this.Percentage + "%" : this.Amount;
        var trapsSummonsDescr = "Increase " + Helpers.getPropertyByValue(TrapAndSummonStatsEnum, this.SelectedStat) + " of Traps and Summons by " + quantifier;
        return trapsSummonsDescr;
    }

    EquippableStatData: IItemAffixStats;
    getZeroStats: (src: any) => any;
    updateEquippedStats: (src: any, affix: IItemAffix) => any;
}
