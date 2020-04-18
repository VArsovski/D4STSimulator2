import { ItemBasicPowersDetail, ItemBasicResistanceStatsDetail } from './ItemSimpleStats';
import { SkillVM } from 'src/Models/SkillVM';
import { PowerTypesEnum } from 'src/_Enums/powerTypesEnum';
import { BasicStatsEnum, ResistanceTypesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { IItemAffixStats } from './IItemAffixStats';

export enum BasicStatTypesEnum {
    PowerStats= 1,
    StatNumbers=2,
    StatRegen=3,
    StatPercentage=4,
    StatPercentageRegen=5,
    Resistance=6,
    SkillEmpower=7,
    Socket=8
}

export class ItemBasicStats implements IItemAffixStats {
    private PowerStats:ItemBasicPowersDetail;
    private StatNumbers:ItemBasicStatsDetail;
    private StatRegen:ItemBasicStatsDetail;
    private StatPercentage:ItemBasicStatsDetail;
    private StatPercentageRegen:ItemBasicStatsDetail;
    private Resistance:ItemBasicResistanceStatsDetail;
    private SkillEmpower:SkillVM;
    private Socket:number;
    private selectedStat:string;
    private PowerLevel: any;
    private Level: number;
    private statsCalculated:boolean;
    Amount:number; //Just to check whether there is data in here (from outside method)

    constructor(level:number, powerLevel?:number, powerStats?:ItemBasicPowersDetail
        , statNumbers?:ItemBasicStatsDetail, statRegen?:ItemBasicStatsDetail, statPercentage?:ItemBasicStatsDetail, statRegenPercentage?:ItemBasicStatsDetail
        , resistance?:ItemBasicResistanceStatsDetail, skillEmpower?:SkillVM, socket?:number, selectedStat?:string) {

        this.Amount = -1; // Just make sure it's not 0, (again) for outside check
        this.Socket = 0;
        this.PowerLevel = powerLevel;
        this.Level = level;
        this.PowerStats = powerStats;
        this.StatNumbers = statNumbers;
        this.StatRegen = statRegen;
        this.StatPercentage = statPercentage;
        this.Resistance = resistance;
        this.SkillEmpower = skillEmpower;
        this.selectedStat = selectedStat;

        if (!this.statsCalculated && this.selectedStat) {
            this.statsCalculated = true;
            var selectedStat = this.GetSelectedStat();
            var data = this.GetCalculatedData(this, selectedStat);
            this.PowerStats = data.PowerStats;
            this.StatNumbers = data.StatNumbers;
            this.StatRegen = data.StatRegen;
            this.StatPercentage = data.StatPercentage;
            this.Resistance = data.Resistance;
            this.SkillEmpower = data.SkillEmpower;
        }
    }

    public SetPowers(level:number, powerLevel:number, amount:number, type:PowerTypesEnum) {
        this.PowerStats = new ItemBasicPowersDetail(level, powerLevel, amount, type);
        this.selectedStat = "PowerStats";
    }

    public SetBasicStat(level:number, powerLevel:number, amount:number, type:BasicStatsEnum) {
        this.StatNumbers = new ItemBasicStatsDetail(level, powerLevel, amount, type);
        this.selectedStat = "StatNumbers";
    }

    public SetBasicStatPercentage(level:number, powerLevel:number, amount:number, type:BasicStatsEnum) {
        this.StatPercentage = new ItemBasicStatsDetail(level, powerLevel, amount, type);
        this.selectedStat = "StatPercentage";
    }

    public SetRegenPercentage(level:number, powerLevel:number, amount:number, type:BasicStatsEnum) {
        this.StatPercentageRegen = new ItemBasicStatsDetail(level, powerLevel, amount, type);
        this.selectedStat = "StatPercentageRegen";
    }

    public SetResistance(level:number, powerLevel:number, amount:number, type:ResistanceTypesEnum) {
        this.Resistance = new ItemBasicResistanceStatsDetail(level, powerLevel, amount, type);
        this.selectedStat = "Resistance";
    }

    public SetSkill(level:number, skillData: SkillVM, levels?: number) {
        if (!levels) levels = 0;
        this.PowerLevel += levels || 0;
        // skillData.level += levels;
        this.SkillEmpower = skillData;
        this.selectedStat = "SkillEmpower";
    }

    public SetSocket() {
        this.Socket++;
        this.selectedStat = "Socket";
    }

    GetDescription(): string {
        var descr1 = ""; if (this.PowerStats) descr1 = this.PowerStats.GetDescription();
        var descr2 = ""; if (this.StatNumbers) descr2 = this.StatNumbers.GetDescription();
        var descr3 = ""; if (this.StatRegen) descr3 = this.StatRegen.GetDescription();
        var descr4 = ""; if (this.StatPercentage) descr4 = this.StatPercentage.GetDescription();
        var descr5 = ""; if (this.StatPercentageRegen) descr5 = this.StatPercentageRegen.GetDescription();
        var descr6 = ""; if (this.Resistance) descr6 = this.Resistance.GetDescription();
        var descr7 = "";
        
        if (this.SkillEmpower)
            descr7 += ((this.SkillEmpower.level + this.PowerLevel) || 1) + " to " + this.SkillEmpower.name + " (" + this.SkillEmpower.className + " only)";

        // TODO: Research when/Why Socket/s get added in middle of an affix
        var descr8 = this.Socket != 0 ? "Socket/s " + this.Socket: "";
        var allAffixDescr = ["+ " + descr1, "+ " + descr2, "+ " + descr3, "+ " + descr4, "+ " + descr5, "+ " + descr6, "+ " + descr7, "+ " + descr8];
        var descr = allAffixDescr.filter(f => (f.replace("+ ", "") || []).length != 0);
        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
        descr.forEach(d => { d += empoweredStr; });

        return descr.join('\n\n');
    }

    private GetSelectedStat():string {
        var selectedStat:string = null;
        if (this.PowerStats)
            selectedStat = "PowerStats";
        if (this.StatNumbers)
            selectedStat = "StatNumbers";
        if (this.StatRegen)
            selectedStat = "StatRegen";
        if (this.StatPercentage)
            selectedStat = "StatPercentage";
        if (this.StatPercentageRegen)
            selectedStat = "StatPercentageRegen";
        if (this.SkillEmpower)
            selectedStat = "SkillEmpower";
        if (this.Resistance)
            selectedStat = "Resistance";
        return selectedStat;
    }

    private GetCalculatedData(data:ItemBasicStats, selectedStat:string) {
        // var data = new ItemBasicStats(this.Level, this.PowerLevel, this.PowerStats
        //     , this.StatNumbers, this.StatRegen, this.StatPercentage, this.StatPercentageRegen
        //     , this.Resistance, this.SkillEmpower, this.Socket, selectedStat);

        if (selectedStat && !this.statsCalculated)
        {
            var dict = Helpers.extractEnum(BasicStatTypesEnum);
            var selectedTypeNum:number[] = [];
            dict.forEach(d => {if (d.name == data.selectedStat) selectedTypeNum.push(d.value);});
            // var amount = new CalculationsHelper().getBasicStatForLevel(selectedTypeNum[0], data[data.selectedStat].Amount, data.Level);

            // if (data.selectedStat == "PowerStats" || data.selectedStat == "Resistance")
            //     data[data.selectedStat].Amount = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getArmorStatForLevel(data[data.selectedStat].Amount, data.Level), data.PowerLevel);
            if (["StatNumbers", "StatRegen", "StatPercentage", "StatPercentageRegen" ].indexOf(data.selectedStat) != -1)
            {
                // Should contain only one, DW :P
                data[data.selectedStat].Amount = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getArmorStatForLevel(data[data.selectedStat].Amount, data.Level), data.PowerLevel);
                data[data.selectedStat].AmountPercentage = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getArmorStatForLevel(data[data.selectedStat].AmountPercentage, data.Level), data.PowerLevel);
                if (!this.statsCalculated) {
                    this[data.selectedStat].Amount = data[data.selectedStat].Amount;
                    this[data.selectedStat].AmountPercentage = data[data.selectedStat].AmountPercentage;
                }
            }
            if (data.selectedStat == "SkillEmpower") {
                if (!data.SkillEmpower.level)
                    data.SkillEmpower.level = 1;
                data.SkillEmpower.level += data.PowerLevel;
                if (!this.statsCalculated) {
                    this.SkillEmpower.level = data.SkillEmpower.level;
                }
            }
            if (data.selectedStat == "Socket") {
                data.Socket++;
                if (!this.statsCalculated) {
                    this.Socket = data.Socket;
                }
            }
        }

        return data;
    }
}

export class ItemBasicStatsDetail implements IItemAffixStats {
    Amount: number;
    private Type: BasicStatsEnum;
    private Level: number;
    private PowerLevel: number;
    private statsCalculated:boolean;

    constructor(level:number, powerLevel:number, amount:number, type:BasicStatsEnum) {
        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.Type = type;

        if (!this.statsCalculated) {
            this.Amount = new CalculationsHelper().getBasicStatForLevel(this.Type, amount, this.Level);
            this.statsCalculated = true;
        }
    }

    GetDescription(): string {
        return this.Amount + " " + Helpers.getPropertyByValue(BasicStatsEnum, this.Type);
    }
}
