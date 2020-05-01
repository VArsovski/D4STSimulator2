import { IItemAffixStats } from './IItemAffixStats';
import { AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { ItemTriggerStats } from './ItemTriggerStats';
import { Helpers } from 'src/_Helpers/helpers';
import { CCEffectTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { ItemBasicStats } from './ItemBasicStats';
import { IEquippableStat, IEquippableInventoryModel } from 'src/Models/InventoryDetailModels/IEquippableStat';
import { IItemAffix } from '../IItemAffix';

export class ItemConditionalBasicStats implements IItemAffixStats, IEquippableStat {
    Amount: number;
    Level: number;
    PowerLevel: number;
    Duration: number;
    CategoryStats: AffixCategoryEnum;
    BasicStatsData: ItemBasicStats;
    TriggerData: ItemTriggerStats;
    SelectedStat: string;
    SelectedEquipStat: string;

    constructor(level:number, powerLevel:number, basicData:ItemBasicStats, triggerData:ItemTriggerStats, duration:number) {
        this.Level = level;
        this.PowerLevel = powerLevel;
        this.BasicStatsData = basicData;
        this.TriggerData = triggerData;
        this.Duration = duration;

        this.SelectedStat = this.BasicStatsData.SelectedStat;
        this.SelectedEquipStat = this.BasicStatsData.SelectedEquipStat;
    }

    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    public GetDescription(): string {
        console.log("When: ");
        var trigger1Str = this.TriggerData.GetTriggerTypeInfo();
        var trigger2Str = Helpers.getPropertyByValue(CCEffectTypesEnum, this.TriggerData[this.TriggerData.SpellEffect]);
        console.log(trigger1Str);
        console.log(trigger2Str);
        return "Gain " + this.BasicStatsData.GetDescription() + " for " + this.Duration + "s when " + trigger1Str + " suffered";
    }
}

export class ItemConditionalTriggerStats implements IItemAffixStats {
    Amount: number;
    Level: number;
    PowerLevel: number;
    Duration: number;
    CategoryStats: AffixCategoryEnum;
    BasicStatsData: ItemBasicStats;
    TriggerData: ItemTriggerStats;
    SelectedEquipStat: string;

    constructor(level:number, powerLevel:number, basicData:ItemBasicStats, triggerData:ItemTriggerStats, duration:number) {
        this.Level = level;
        this.PowerLevel = powerLevel;
        this.BasicStatsData = basicData;
        this.TriggerData = triggerData;
        this.Duration = duration;
    }

    public GetDescription(): string {
        console.log("When: ");
        var trigger1Str = this.TriggerData.GetTriggerTypeInfo();
        var trigger2Str = Helpers.getPropertyByValue(CCEffectTypesEnum, this.TriggerData);
        console.log(trigger1Str);
        console.log(trigger2Str);
        return "Gain " + this.BasicStatsData.GetDescription() + " for " + this.Duration + "s when " + trigger1Str + " suffered";
    }
}

export class ItemConditionalCastStats implements IItemAffixStats {
    Amount: number;
    Level: number;
    PowerLevel: number;
    Duration: number;
    CategoryStats: AffixCategoryEnum;
    BasicStatsData: ItemBasicStats;
    TriggerData: ItemTriggerStats;
    SelectedEquipStat: string;

    constructor(level:number, powerLevel:number, basicData:ItemBasicStats, triggerData:ItemTriggerStats, duration:number) {
        this.Level = level;
        this.PowerLevel = powerLevel;
        this.BasicStatsData = basicData;
        this.TriggerData = triggerData;
        this.Duration = duration;
    }

    public GetDescription(): string {
        console.log("When: ");
        var trigger1Str = this.TriggerData.GetTriggerTypeInfo();
        var trigger2Str = Helpers.getPropertyByValue(CCEffectTypesEnum, this.TriggerData[this.TriggerData.SpellEffect]);
        console.log(trigger1Str);
        console.log(trigger2Str);
        return "Gain " + this.BasicStatsData.GetDescription() + " for " + this.Duration + "s when " + trigger1Str + " suffered";
    }
}
