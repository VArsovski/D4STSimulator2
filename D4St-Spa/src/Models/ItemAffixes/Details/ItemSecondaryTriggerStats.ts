import { SecondaryTriggerStatsEnum, TriggerTypesEnum, SpellEffectTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { ItemTriggerStats } from './ItemTriggerStats';
import { Helpers } from 'src/_Helpers/helpers';
import { TrapsEnum, CursesEnum } from 'src/_Enums/skillEnums';
import { ItemBasicStats, ItemBasicStatsDetail } from './ItemBasicStats';
import { ItemBasicPowersDetail, ItemBasicResistanceStatsDetail } from './ItemSimpleStats';
import { ResistanceTypesEnum, AffixCategoryEnum, BasicStatTypesEnum } from 'src/_Enums/itemAffixEnums';
import { IItemAffixStats, SimpleAffixStats } from './IItemAffixStats';
import { IItemAffix } from '../IItemAffix';
import { IEquippableAffixStat } from 'src/Models/IEquippableStatDetails/IEquippableAffixStat';
import { SecondaryTriggerStatsEquippable } from 'src/Models/IEquippableStatDetails/SecondaryTriggerStatsEquippable';
import { IDescribable } from '../IDescribable';

export class ItemSecondaryTriggerStatsDetail implements IEquippableAffixStat, IDescribable {
    private Level: number;
    private PowerLevel: any;
    private statsCalculated:boolean;
    Amount: number;
    Type: SecondaryTriggerStatsEnum;
    Trigger: ItemTriggerStats;
    Duration: number;
    Trap: TrapsEnum;
    Curse: CursesEnum;
    BasicStat:ItemBasicStats;
    CategoryStats: AffixCategoryEnum;
    EquippableStatData: IItemAffixStats;
    getZeroStats: (src: any) => any;
    updateEquippedStats: (src: any, affix: IItemAffix) => any;

    constructor(level:number, powerLevel:number, amount:number, duration:number, type:SecondaryTriggerStatsEnum, trigger:ItemTriggerStats) {

        this.Amount = -1; // Just make sure it's not 0, (again) for outside check
        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.Duration = duration;
        this.Type = type;
        this.Trigger = trigger;
        if (!this.statsCalculated) {
            this.SetCalculatedData();
            this.statsCalculated = true;
        }

        this.EquippableStatData = new SimpleAffixStats();
        this.EquippableStatData.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.EquippableStatData.InputMeta.SelectedStat = Helpers.getPropertyByValue(AffixCategoryEnum, this.CategoryStats);
        this.EquippableStatData.OutputMeta.SelectedCategoryStat = "SecondaryBasicStat";
        this.EquippableStatData.OutputMeta.SelectedStat = Helpers.getPropertyByValue(SecondaryTriggerStatsEnum, this.Type);
        this.EquippableStatData.OutputMeta.SelectedEquipStat = "SecondaryTriggerStats";
    }

    private SetCalculatedData()
    {
        var levelsToEmpower = this.Type == SecondaryTriggerStatsEnum.EmpowerBasicStat ? Helpers.getRandom(4, 5) : Helpers.getRandom(2, 4);
        this.Duration = new CalculationsHelper().getEmpoweredValue(this.Duration, levelsToEmpower);
        this.Amount += this.PowerLevel;

        if (this.Type == SecondaryTriggerStatsEnum.AllowSkillForUsage) {
            this.Trigger.SkillStat.level += this.PowerLevel;
            this.Trigger.SpellEffect = SpellEffectTypesEnum.CastSpell;
            if (!this.statsCalculated) {
                this.Trigger = this.Trigger;
            }
        }
        if (this.Type == SecondaryTriggerStatsEnum.AllowTrapsCast) {
            this.Trap = Helpers.getRandom(0, 6);
            if (!this.statsCalculated)
                this.Trap = this.Trap;
        }
        if (this.Type == SecondaryTriggerStatsEnum.AllowCurseCast) {
            this.Curse = Helpers.getRandom(0, 9);
            if (!this.statsCalculated)
                this.Curse = this.Curse;
        }

        var levelForBuff = Math.round(Helpers.getRandom(1, this.Level/8));
        var amountForBuff = Math.round(Helpers.getRandom(1, this.Level/4));

        if (this.Type == SecondaryTriggerStatsEnum.EmpowerBasicStat) {
            // PowerStats= 1,      // StatRegen=3,           // StatPercentageRegen=5,      // SkillEmpower=7,
            // StatNumbers=2,      // StatPercentage=4,      // Resistance=6,               // Socket=8
            var basicStatCategory = Helpers.getRandom(2, 7); // BasicStatTypesEnum
            var basicStatType = Helpers.getRandom(1, 3);   // HP/Resource/Stamina
            var statData:ItemBasicStatsDetail = new ItemBasicStatsDetail(levelForBuff, this.PowerLevel, this.Amount, basicStatCategory, basicStatType);
            var statPowers = basicStatCategory == 1 ? new ItemBasicPowersDetail(levelForBuff, this.PowerLevel, amountForBuff, Helpers.getRandom(1,3)) : null;
            var stat1 = basicStatCategory == 2 ? statData : null;
            var stat2 = basicStatCategory == 3 ? statData : null;
            var stat3 = basicStatCategory == 4 ? statData : null;
            var stat4 = basicStatCategory == 5 ? statData : null;
            var stat5 = basicStatCategory == 6 ? statData : null;

            if (basicStatCategory == BasicStatTypesEnum.Resistance) {
                // Physical = 1,        // Lightning = 4,
                // Fire = 2,            // Poison = 5,
                // Cold = 3,            // All = 6
                var selectedRes = Helpers.getRandom(1, 6); // ResistanceTypesEnum
                if (selectedRes != 6)
                    amountForBuff += Math.round(amountForBuff* Helpers.getRandom(20, 40));
                else amountForBuff = Math.round(amountForBuff* Helpers.getRandom(60, 80));
            }

            // TODO: selectedStat should probably be called in Constructor but to avoid further complications, we'll call the method to init the Stats in Description down below
            var statRes = basicStatCategory == BasicStatTypesEnum.Resistance ? new ItemBasicResistanceStatsDetail(levelForBuff, this.PowerLevel, amountForBuff, selectedRes) : null;
            this.BasicStat = new ItemBasicStats(AffixCategoryEnum.IncreaseTriggerStat, levelForBuff, this.PowerLevel, statPowers, stat1, stat2, stat3, stat4, stat5, statRes, this.Trigger.SkillStat, 0, basicStatCategory);
        }
        // TODO: Empower Ofense/Defense effects.. (SKIP for now)
        // if (this.Type == SecondaryTriggerStatsEnum.EmpowerOfenseStat) {
        //     var statType = Helpers.getRandom(0, 5);
        // if (this.Type == SecondaryTriggerStatsEnum.EmpowerDefenseStat) {
        //     var statType = Helpers.getRandom(0, 5);
    }

    public GetDescription():string {
        var str = "";

        if (this.Type == SecondaryTriggerStatsEnum.AllowSkillForUsage) {
            this.Trigger.Type = TriggerTypesEnum.SpellEffect;
            this.Trigger.SpellEffect = SpellEffectTypesEnum.CastSpell;
            str = "cast level " + (this.Trigger.SkillStat.level || 1) + " " + this.Trigger.SkillStat.name;
        }
        else {
            if (this.Type == SecondaryTriggerStatsEnum.AllowTrapsCast)
                str = " gain charge of level " + this.Level + " " + Helpers.getPropertyByValue(TrapsEnum, this.Trap);
            if (this.Type == SecondaryTriggerStatsEnum.AllowCurseCast)
                str = " gain charge of level " + this.Level + " " + Helpers.getPropertyByValue(CursesEnum, this.Curse);
            if (this.Type == SecondaryTriggerStatsEnum.EmpowerBasicStat) {
                // TODO: This should never happen but just in case it Does.. ?
                if (!this.BasicStat.CategoryStats)
                    this.BasicStat.SetSelectedStat();
                // if (this.BasicStat == BasicStatTypesEnum.StatReturn)
                str = " gain " + this.BasicStat.GetDescription();
            }
            str += " for " + this.Duration + " sec";
        }

        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
        return str + empoweredStr;
    }
}

export class ItemSecondaryTriggerStats implements IEquippableAffixStat {
    Amount:number;
    Chance:number;
    Duration:number;
    Trigger:ItemTriggerStats;
    CategoryStats: AffixCategoryEnum;
    Type:SecondaryTriggerStatsEnum;
    private PowerLevel: number;
    private Level: number;
    private statsCalculated:boolean;
    private LevelToBuff: number;
    private TriggerDetails:ItemSecondaryTriggerStatsDetail;
    private DamageType:number;
    EquippableStatData: IItemAffixStats;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;
    getZeroStats: (src: any) => any;

    constructor(category:AffixCategoryEnum, level:number, powerLevel:number, amount:number, chance:number, duration:number, type:SecondaryTriggerStatsEnum, trigger:ItemTriggerStats, damageType?:ResistanceTypesEnum) {
        this.CategoryStats = category;
        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.Chance = chance;
        this.Duration = duration;
        this.Type = type;
        this.Trigger = trigger;
        this.DamageType = damageType || Helpers.getRandom(1, 5);
        
        if (!this.statsCalculated) {
            this.Chance = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getTriggerStatsForLevel(this.Amount, this.Level, this.PowerLevel, this.Trigger.Type), this.PowerLevel);
            this.Amount = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getTriggerStatsForLevel(this.Amount, this.Level, this.PowerLevel, this.Trigger.Type), this.PowerLevel);

            if (!this.LevelToBuff)
                this.LevelToBuff = Math.round(Helpers.getRandom(1, this.Level/4));
                
            this.TriggerDetails = new ItemSecondaryTriggerStatsDetail(this.LevelToBuff, this.PowerLevel, this.Amount, this.Duration, this.Type, this.Trigger)
            this.statsCalculated = true;
        }

        this.EquippableStatData = new SimpleAffixStats();
        this.EquippableStatData.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.EquippableStatData.InputMeta.SelectedStat = Helpers.getPropertyByValue(AffixCategoryEnum, this.CategoryStats);
        this.EquippableStatData.OutputMeta.SelectedCategoryStat = "SecondaryTriggerStats";
        this.EquippableStatData.OutputMeta.SelectedStat = Helpers.getPropertyByValue(SecondaryTriggerStatsEnum, this.Type);
        this.EquippableStatData.OutputMeta.SelectedEquipStat = Helpers.getPropertyByValue(SecondaryTriggerStatsEnum, this.Type);
        this.getZeroStats = (src) => { var stat = (src as ItemSecondaryTriggerStats);
            debugger;
            if (stat) {
                stat.Amount = 0; stat.Chance = 0; stat.Duration = 0; stat.Trigger.Chance = 0;
            }
            return stat;
        }
        this.updateEquippedStats = new SecondaryTriggerStatsEquippable().updateEquippedStats;
    }

    public GetDescription():string {
        var secondaryTypeStr = this.TriggerDetails.GetDescription();
        var withChanceStr = this.Trigger.GetTriggerTypeInfo() + " has a " + this.Chance + " % chance to " + secondaryTypeStr;
        var withoutChanceStr = this.Trigger.GetTriggerTypeInfo() + " does additional " + this.Amount + "% damage of type " + Helpers.getPropertyByValue(ResistanceTypesEnum, this.DamageType);
        return this.Chance ? withChanceStr : withoutChanceStr;
    }
}
