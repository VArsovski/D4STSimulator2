import { IDescribable } from '../IDescribable';
import { SecondaryTriggerStatsEnum, TriggerAffixTypesEnum, TriggerStatsEnum } from 'src/_Enums/triggerAffixEnums';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { ItemTriggerStats } from './ItemTriggerStats';
import { Helpers } from 'src/_Helpers/helpers';
import { TrapsEnum, CursesEnum } from 'src/_Enums/skillEnums';
import { ItemBasicStats, ItemBasicStatsDetail } from './ItemBasicStats';
import { ItemBasicPowersDetail, ItemBasicResistanceStatsDetail } from './ItemSimpleStats';

export class ItemSecondaryTriggerStatsDetail implements IDescribable {
    private Level: number;
    private PowerLevel: any;
    Amount: number;
    Type: SecondaryTriggerStatsEnum;
    Trigger: ItemTriggerStats;
    Duration: number;
    Trap: TrapsEnum;
    Curse: CursesEnum;
    BasicStat:ItemBasicStats;
    // OfenseStat:ItemOfensiveStats;
    // DefenseStat:ItemDefenseStats;

    constructor(level:number, powerLevel:number, amount:number, duration:number, type:SecondaryTriggerStatsEnum, trigger:ItemTriggerStats) {
        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.Duration = duration;
        this.Type = type;
        this.Trigger = trigger;
    }

    public

    public GetData()
    {
        // AllowSkillForUsage = 1,       // EmpowerBasicStat = 4,
        // AllowTrapsCast = 2,           // EmpowerOfenseStat = 5,
        // AllowCurseCast = 3,           // EmpowerDefenseStat = 6,
    
        var data = new ItemSecondaryTriggerStatsDetail(this.Level, this.PowerLevel, this.Amount, this.Duration, this.Type, this.Trigger);
        if (this.Type == SecondaryTriggerStatsEnum.AllowSkillForUsage) {
            data.Trigger.SkillStat.level += data.PowerLevel;
            data.Duration += new CalculationsHelper().getEmpoweredValue(Helpers.getRandom(2, 4), data.PowerLevel);
        }
        if (this.Type == SecondaryTriggerStatsEnum.AllowTrapsCast) {
            data.Trap = Helpers.getRandom(0, 6);
            data.Amount += data.PowerLevel;
            data.Duration += new CalculationsHelper().getEmpoweredValue(Helpers.getRandom(2, 4), data.PowerLevel);
        }
        if (this.Type == SecondaryTriggerStatsEnum.AllowCurseCast) {
            data.Curse = Helpers.getRandom(0, 9);
            data.Amount += data.PowerLevel;
            data.Duration += new CalculationsHelper().getEmpoweredValue(Helpers.getRandom(2, 4), data.PowerLevel);
        }

        var levelForBuff = Math.round(Helpers.getRandom(1, data.Level/8));
        var amountForBuff = Math.round(Helpers.getRandom(1, data.Level/4));

        if (this.Type == SecondaryTriggerStatsEnum.EmpowerBasicStat) {
            var statType = Helpers.getRandom(0, 5);
            var statData:ItemBasicStatsDetail = new ItemBasicStatsDetail(levelForBuff, data.PowerLevel, data.Amount, statType);
            var statPowers = statType == 0 ? new ItemBasicPowersDetail(levelForBuff, data.PowerLevel, amountForBuff, Helpers.getRandom(1,3)) : null;
            var stat1 = statType == 1 ? statData : null;
            var stat2 = statType == 2 ? statData : null;
            var stat3 = statType == 3 ? statData : null;
            var stat4 = statType == 4 ? statData : null;
            var selectedRes = Helpers.getRandom(1, 6);
            if (statType == 5) {
                if (selectedRes != 6)
                    amountForBuff += Math.round(amountForBuff* Helpers.getRandom(20, 40));
                else amountForBuff = Math.round(amountForBuff* Helpers.getRandom(60, 80));
            }

            data.Duration += new CalculationsHelper().getEmpoweredValue(Helpers.getRandom(5, 8), data.PowerLevel);
            var statRes = statType == 5 ? new ItemBasicResistanceStatsDetail(levelForBuff, data.PowerLevel, amountForBuff, selectedRes) : null;

            data.BasicStat = new ItemBasicStats(levelForBuff, data.PowerLevel, statPowers, stat1, stat2, stat3, stat4, statRes);
        }
        // TODO: Empower Ofense/Defense effects.. (SKIP for now)
        // if (this.Type == SecondaryTriggerStatsEnum.EmpowerOfenseStat) {
        //     var statType = Helpers.getRandom(0, 5);
        // if (this.Type == SecondaryTriggerStatsEnum.EmpowerDefenseStat) {
        //     var statType = Helpers.getRandom(0, 5);
        return data;
    }

    public GetDescription():string {
        var data = this.GetData();
        var str = "";

        if (data.Type == SecondaryTriggerStatsEnum.AllowSkillForUsage) {
            data.Trigger.Type = TriggerStatsEnum.Spellcast;
            str = data.Trigger.GetTriggerTypeInfo();
        }
        if (this.Type == SecondaryTriggerStatsEnum.AllowTrapsCast) {
            str = " gain level " + data.Level + " " + Helpers.getPropertyByValue(TrapsEnum, data.Trap);
        }
        if (this.Type == SecondaryTriggerStatsEnum.AllowCurseCast) {
            str = " gain level " + data.Level + " " + Helpers.getPropertyByValue(CursesEnum, data.Curse);
        }
        if (this.Type == SecondaryTriggerStatsEnum.EmpowerBasicStat) {
            debugger;
            str = " gain " + data.BasicStat.GetDescription();
        }
        str += " for " + data.Duration + " sec";

        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
        return str + empoweredStr;
    }
}

export class ItemSecondaryTriggerStats implements IDescribable {
    Amount:number;
    Chance:number;
    Duration:number;
    Trigger:ItemTriggerStats;
    Type:SecondaryTriggerStatsEnum;
    private PowerLevel: number;
    private Level: number;

    constructor(level:number, powerLevel:number, amount:number, chance:number, duration:number, type:SecondaryTriggerStatsEnum, trigger:ItemTriggerStats) {
        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.Chance = chance;
        this.Duration = duration;
        this.Type = type;
        this.Trigger = trigger;
    }

    public GetDescription():string {
        var data = this.GetData();
        var levelToBuff = Math.round(Helpers.getRandom(1, this.Level/4));
        var secondaryTypeStr = new ItemSecondaryTriggerStatsDetail(levelToBuff, data.PowerLevel, data.Amount, data.Duration, data.Type, data.Trigger).GetDescription();
        return data.Trigger.GetTriggerTypeInfo() + " has a " + data.Chance + " % chance to " + secondaryTypeStr;// + " for " + data.Duration;
    }
    
    public GetData()
    {
        var data = new ItemSecondaryTriggerStats(this.Level, this.PowerLevel, this.Amount, this.Chance, this.Chance, this.Type, this.Trigger);
        data.Chance = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getTriggerStatsForLevel(this.Amount, this.Level, this.PowerLevel, this.Trigger.Type), this.PowerLevel);
        data.Amount = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getTriggerStatsForLevel(this.Amount, this.Level, this.PowerLevel, this.Trigger.Type), this.PowerLevel);
        return data;
    }
}
