import { IItemAffixStats, IItemAffixStatsMetadata, SimpleItemAffixStatsMetadata } from './IItemAffixStats';
import { AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { ItemTriggerStats } from './ItemTriggerStats';
import { Helpers } from 'src/_Helpers/helpers';
import { CCEffectTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { ItemBasicStats } from './ItemBasicStats';
import { IEquippableStat } from 'src/Models/InventoryModels/InventoryDetailModels/IEquippableStat';
import { IItemAffix } from '../IItemAffix';

export class ItemConditionalBasicStats implements IItemAffixStats, IEquippableStat {
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
        this.InputMeta.SelectedStat = "Conditional:TODO" + this.BasicStatsData.InputMeta.SelectedStat;
        this.InputMeta.SelectedEquipStat = "Conditional:TODO" + this.BasicStatsData.InputMeta.SelectedEquipStat;
        this.OutputMeta.SelectedCategoryStat = "Conditional:TODO" + this.BasicStatsData.OutputMeta.SelectedCategoryStat;
        this.OutputMeta.SelectedStat = "Conditional:TODO" + this.BasicStatsData.OutputMeta.SelectedStat;
        this.OutputMeta.SelectedEquipStat = "Conditional:TODO" + this.BasicStatsData.OutputMeta.SelectedEquipStat;
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
        this.OutputMeta.SelectedCategoryStat = "Conditional:TODO" + this.BasicStatsData.OutputMeta.SelectedCategoryStat + " - " + this.TriggerData.OutputMeta.SelectedCategoryStat;
        this.OutputMeta.SelectedStat = "Conditional:TODO" + this.BasicStatsData.OutputMeta.SelectedStat + " - " + this.TriggerData.OutputMeta.SelectedStat;
        this.OutputMeta.SelectedEquipStat = "Conditional:TODO" + this.BasicStatsData.OutputMeta.SelectedEquipStat + " - " + this.TriggerData.OutputMeta.SelectedEquipStat;
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
        this.InputMeta.SelectedStat = "Conditional:TODO" + this.BasicStatsData.InputMeta.SelectedStat + " - " + this.TriggerData.InputMeta.SelectedStat;
        this.InputMeta.SelectedEquipStat = "Conditional:TODO" + this.BasicStatsData.InputMeta.SelectedEquipStat + " - " + this.TriggerData.InputMeta.SelectedEquipStat;
        this.OutputMeta.SelectedStat = "Conditional:TODO" + this.BasicStatsData.OutputMeta.SelectedCategoryStat + " - " + this.TriggerData.OutputMeta.SelectedStat;
        this.OutputMeta.SelectedStat = "Conditional:TODO" + this.BasicStatsData.OutputMeta.SelectedStat + " - " + this.TriggerData.OutputMeta.SelectedStat;
        this.OutputMeta.SelectedEquipStat = "Conditional:TODO" + this.BasicStatsData.OutputMeta.SelectedEquipStat + " - " + this.TriggerData.OutputMeta.SelectedStat;
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
