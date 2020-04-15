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
    private statsCalculated:boolean;

    constructor(level:number, powerLevel:number, amount:number, duration:number, type:SecondaryTriggerStatsEnum, trigger:ItemTriggerStats) {
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
    }

    private SetCalculatedData()
    {
        var levelsToEmpower = this.Type == SecondaryTriggerStatsEnum.EmpowerBasicStat ? Helpers.getRandom(4, 5) : Helpers.getRandom(2, 4);
        this.Duration = new CalculationsHelper().getEmpoweredValue(this.Duration, levelsToEmpower);
        this.Amount += this.PowerLevel;

        if (this.Type == SecondaryTriggerStatsEnum.AllowSkillForUsage) {
            this.Trigger.SkillStat.level += this.PowerLevel;
            this.Trigger.AffixType = TriggerAffixTypesEnum.CastSpell;
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
            var statType = Helpers.getRandom(0, 5);
            var statData:ItemBasicStatsDetail = new ItemBasicStatsDetail(levelForBuff, this.PowerLevel, this.Amount, statType);
            var statPowers = statType == 0 ? new ItemBasicPowersDetail(levelForBuff, this.PowerLevel, amountForBuff, Helpers.getRandom(1,3)) : null;
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

            var statRes = statType == 5 ? new ItemBasicResistanceStatsDetail(levelForBuff, this.PowerLevel, amountForBuff, selectedRes) : null;

            this.BasicStat = new ItemBasicStats(levelForBuff, this.PowerLevel, statPowers, stat1, stat2, stat3, stat4, statRes);
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
            this.Trigger.Type = TriggerStatsEnum.Spellcast;
            this.Trigger.AffixType = TriggerAffixTypesEnum.CastSpell;
            str = "cast level " + (this.Trigger.SkillStat.level || 1) + " " + this.Trigger.SkillStat.name;
        }
        else {
            if (this.Type == SecondaryTriggerStatsEnum.AllowTrapsCast)
                str = " gain charge of level " + this.Level + " " + Helpers.getPropertyByValue(TrapsEnum, this.Trap);
            if (this.Type == SecondaryTriggerStatsEnum.AllowCurseCast)
                str = " gain charge of level " + this.Level + " " + Helpers.getPropertyByValue(CursesEnum, this.Curse);
            if (this.Type == SecondaryTriggerStatsEnum.EmpowerBasicStat)
                str = " gain " + this.BasicStat.GetDescription();
            str += " for " + this.Duration + " sec";
        }

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
    private statsCalculated:boolean;
    private LevelToBuff: number;
    private TriggerDetails:ItemSecondaryTriggerStatsDetail;

    constructor(level:number, powerLevel:number, amount:number, chance:number, duration:number, type:SecondaryTriggerStatsEnum, trigger:ItemTriggerStats) {
        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.Chance = chance;
        this.Duration = duration;
        this.Type = type;
        this.Trigger = trigger;
        
        if (!this.statsCalculated) {
            if (!this.Trigger)
                console.log(this);

            this.Chance = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getTriggerStatsForLevel(this.Amount, this.Level, this.PowerLevel, this.Trigger.Type), this.PowerLevel);
            this.Amount = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getTriggerStatsForLevel(this.Amount, this.Level, this.PowerLevel, this.Trigger.Type), this.PowerLevel);

            if (!this.LevelToBuff)
                this.LevelToBuff = Math.round(Helpers.getRandom(1, this.Level/4));
                
            this.TriggerDetails = new ItemSecondaryTriggerStatsDetail(this.LevelToBuff, this.PowerLevel, this.Amount, this.Duration, this.Type, this.Trigger)
            this.statsCalculated = true;
        }
    }

    public GetDescription():string {
        var secondaryTypeStr = this.TriggerDetails.GetDescription();
        return this.Trigger.GetTriggerTypeInfo() + " has a " + this.Chance + " % chance to " + secondaryTypeStr;// + " for " + this.Duration;
    }
}
