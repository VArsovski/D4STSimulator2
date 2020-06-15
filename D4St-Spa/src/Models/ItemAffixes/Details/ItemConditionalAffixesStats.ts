import { IItemAffixStats, IItemAffixStatsMetadata, SimpleItemAffixStatsMetadata, SimpleAffixStats } from './IItemAffixStats';
import { AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { ItemTriggerStats } from './ItemTriggerStats';
import { Helpers } from 'src/_Helpers/helpers';
import { CCEffectTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { ItemBasicStats } from './ItemBasicStats';
import { IItemAffix } from '../IItemAffix';
import { IEquippableAffixStat } from 'src/Models/IEquippableStatDetails/IEquippableAffixStat';
import { ConditionalAffixEquippable } from 'src/Models/IEquippableStatDetails/ConditionalAffixEquippable';

export class ItemConditionalBasicStats implements IEquippableAffixStat {
    Amount: number;
    Level: number;
    PowerLevel: number;
    Duration: number;
    CategoryStats: AffixCategoryEnum;
    BasicStatsData: ItemBasicStats;
    TriggerData: ItemTriggerStats;
    SelectedStat: string;
    SelectedEquipStat: string;
    SelectedCategoryStat: string;
    EquippableStatData: IItemAffixStats;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;
    getZeroStats: (src: any) => any;

    constructor(level:number, powerLevel:number, basicData:ItemBasicStats, triggerData:ItemTriggerStats, duration:number) {
        this.Level = level;
        this.PowerLevel = powerLevel;
        this.BasicStatsData = basicData;
        this.TriggerData = triggerData;
        this.Duration = duration;

        this.EquippableStatData = new SimpleAffixStats();
        this.EquippableStatData.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.EquippableStatData.OutputMeta = this.BasicStatsData.EquippableStatData.OutputMeta;
        this.EquippableStatData.OutputMeta.SelectedCategoryStat = "ConditionalAffixStatsData";
        this.EquippableStatData.OutputMeta.SelectedEquipStat = this.TriggerData.EquippableStatData.OutputMeta.SelectedStat;

        // TODO: Define the methods for returning calculated Data for Triggers & ConditionalTriggers
        this.getZeroStats = (src) => { var stat = (src as ItemConditionalBasicStats); stat.Amount = 0; stat.Duration = 0;
            stat.BasicStatsData = stat.BasicStatsData.getZeroStats(stat.BasicStatsData); return stat;
            stat.TriggerData.Chance = 0;
            return stat;
        }

        this.updateEquippedStats = new ConditionalAffixEquippable().updateEquippedStats;
    }

    public GetDescription(): string {
        // console.log("When: ");
        var trigger1Str = this.TriggerData.GetTriggerTypeInfo();
        var trigger2Str = Helpers.getPropertyByValue(CCEffectTypesEnum, this.TriggerData[this.TriggerData.SpellEffect]);
        // console.log(trigger1Str);
        // console.log(trigger2Str);
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
    InputMeta: IItemAffixStatsMetadata;
    OutputMeta: IItemAffixStatsMetadata;

    constructor(level:number, powerLevel:number, basicData:ItemBasicStats, triggerData:ItemTriggerStats, duration:number) {
        this.Level = level;
        this.PowerLevel = powerLevel;
        this.BasicStatsData = basicData;
        this.TriggerData = triggerData;
        this.Duration = duration;

        this.InputMeta = new SimpleItemAffixStatsMetadata();
        this.OutputMeta = new SimpleItemAffixStatsMetadata();
        this.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.InputMeta.SelectedStat = Helpers.getPropertyByValue(AffixCategoryEnum, this.CategoryStats);
        this.OutputMeta.SelectedCategoryStat = "ConditionalAffixesData"; //"Conditional:TODO" + this.BasicStatsData.OutputMeta.SelectedCategoryStat + " - " + this.TriggerData.OutputMeta.SelectedCategoryStat;
        this.OutputMeta.SelectedStat = this.BasicStatsData.EquippableStatData.OutputMeta.SelectedStat; //"Conditional:TODO" + this.BasicStatsData.OutputMeta.SelectedStat + " - " + this.TriggerData.OutputMeta.SelectedStat;
        this.OutputMeta.SelectedEquipStat = this.BasicStatsData.EquippableStatData.OutputMeta.SelectedEquipStat; //"Conditional:TODO" + this.BasicStatsData.OutputMeta.SelectedEquipStat + " - " + this.TriggerData.OutputMeta.SelectedEquipStat;
    }

    public GetDescription(): string {
        // console.log("When: ");
        var trigger1Str = this.TriggerData.GetTriggerTypeInfo();
        var trigger2Str = Helpers.getPropertyByValue(CCEffectTypesEnum, this.TriggerData);
        // console.log(trigger1Str);
        // console.log(trigger2Str);
        return "Gain " + this.BasicStatsData.GetDescription() + " for " + this.Duration + "s when " + trigger1Str + " suffered";
    }
}

export class ItemConditionalCastStats implements IEquippableAffixStat {
    Amount: number;
    Level: number;
    PowerLevel: number;
    Duration: number;
    CategoryStats: AffixCategoryEnum;
    BasicStatsData: ItemBasicStats;
    TriggerData: ItemTriggerStats;
    EquippableStatData: IItemAffixStats;
    getZeroStats: (src: any) => any;
    updateEquippedStats: (src: any, affix: IItemAffix) => any;

    constructor(level:number, powerLevel:number, basicData:ItemBasicStats, triggerData:ItemTriggerStats, duration:number) {
        this.Level = level;
        this.PowerLevel = powerLevel;
        this.BasicStatsData = basicData;
        this.TriggerData = triggerData;
        this.Duration = duration;

        this.EquippableStatData = new SimpleAffixStats();
        this.EquippableStatData.InputMeta = new SimpleItemAffixStatsMetadata();
        this.EquippableStatData.OutputMeta = new SimpleItemAffixStatsMetadata();
        this.EquippableStatData.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.EquippableStatData.InputMeta.SelectedStat = this.BasicStatsData.EquippableStatData.InputMeta.SelectedStat + " - " + this.TriggerData.EquippableStatData.InputMeta.SelectedStat;
        this.EquippableStatData.InputMeta.SelectedEquipStat = this.BasicStatsData.EquippableStatData.InputMeta.SelectedEquipStat + " - " + this.TriggerData.EquippableStatData.InputMeta.SelectedEquipStat;
        this.EquippableStatData.OutputMeta.SelectedStat = "ItemConditionalStatsData";
        this.EquippableStatData.OutputMeta.SelectedStat = this.BasicStatsData.EquippableStatData.OutputMeta.SelectedStat;// + " - " + this.EquippableStatData.TriggerData.OutputMeta.SelectedStat;
        this.EquippableStatData.OutputMeta.SelectedEquipStat = this.TriggerData.EquippableStatData.OutputMeta.SelectedStat;
    }

    public GetDescription(): string {
        // console.log("When: ");
        var trigger1Str = this.TriggerData.GetTriggerTypeInfo();
        var trigger2Str = Helpers.getPropertyByValue(CCEffectTypesEnum, this.TriggerData[this.TriggerData.SpellEffect]);
        // console.log(trigger1Str);
        // console.log(trigger2Str);
        return "Gain " + this.BasicStatsData.GetDescription() + " for " + this.Duration + "s when " + trigger1Str + " suffered";
    }
}
