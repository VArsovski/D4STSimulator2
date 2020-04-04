import { IDescribable } from '../IDescribable';
import { ItemBasicPowersDetail, ItemBasicResistanceStatsDetail } from './ItemSimpleStats';
import { SkillVM } from 'src/Models/SkillVM';
import { PowerTypesEnum } from 'src/_Enums/powerTypesEnum';
import { BasicStatsEnum, ResistanceTypesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';

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

export class ItemBasicStats implements IDescribable {
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

    constructor(level:number, powerLevel?:number, powerStats?:ItemBasicPowersDetail
        , statNumbers?:ItemBasicStatsDetail, statRegen?:ItemBasicStatsDetail, statPercentage?:ItemBasicStatsDetail, statRegenPercentage?:ItemBasicStatsDetail
        , resistance?:ItemBasicResistanceStatsDetail, skillEmpower?:SkillVM, socket?:number, selectedStat?:string) {
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
        if (!levels) levels = 1;
        // TODO: Recalculate stuff here..
        skillData.level = levels;
        this.SkillEmpower = skillData;
        this.selectedStat = "SkillEmpower";
    }

    public SetSocket() {
        this.Socket++;
        this.selectedStat = "Socket";
    }

    GetDescription(): string {
        var data = this.GetData();
        var descr1 = ""; if (this.PowerStats) descr1 = data.PowerStats.GetDescription();
        var descr2 = ""; if (this.StatNumbers) descr2 = data.StatNumbers.GetDescription();
        var descr3 = ""; if (this.StatRegen) descr3 = data.StatRegen.GetDescription();
        var descr4 = ""; if (this.StatPercentage) descr4 = data.StatPercentage.GetDescription();
        var descr5 = ""; if (this.StatPercentageRegen) descr5 = data.StatPercentageRegen.GetDescription();
        var descr6 = ""; if (this.Resistance) descr6 = data.Resistance.GetDescription();
        var descr7 = "";
        
        if (this.SkillEmpower) {
            descr7 += (data.SkillEmpower.level || 1) + " to " + data.SkillEmpower.name + " (" + data.SkillEmpower.className + " only)";
        }

        var descr8 = this.Socket != 0 ? "Socket/s " + this.Socket: "";

        var descr = "+ " + descr1 + descr2 + descr3 + descr4 + descr5 + descr6 + descr7 + descr8;

        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
        descr+= empoweredStr;

        if (descr.startsWith("NaN") || descr.startsWith("0"))
            console.log(this);

        return descr;
    }

    GetData() {

        if (this.PowerStats)
            this.selectedStat = "PowerStats";
        if (this.StatNumbers)
            this.selectedStat = "StatNumbers";
        if (this.StatRegen)
            this.selectedStat = "StatRegen";
        if (this.StatPercentage)
            this.selectedStat = "StatPercentage";
        if (this.StatPercentageRegen)
            this.selectedStat = "StatPercentageRegen";
        if (this.SkillEmpower)
            this.selectedStat = "SkillEmpower";
        if (this.Resistance)
            this.selectedStat = "Resistance";

        if (this.selectedStat)
        {
            var data = new ItemBasicStats(this.Level, this.PowerLevel, this.PowerStats
                , this.StatNumbers, this.StatRegen, this.StatPercentage, this.StatPercentageRegen
                , this.Resistance, this.SkillEmpower, this.Socket, this.selectedStat);

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
            }
            if (data.selectedStat == "SkillEmpower") {
                if (!data.SkillEmpower.level)
                    data.SkillEmpower.level = 1;
                data.SkillEmpower.level += data.PowerLevel;
            }
            if (data.selectedStat == "Socket")
                data.Socket++;
        }
        
        return data;
    }
}

export class ItemBasicStatsDetail implements IDescribable {
    private Amount: number;
    private Type: BasicStatsEnum;
    private Level: number;
    private PowerLevel: number;

    constructor(level:number, powerLevel:number, amount:number, type:BasicStatsEnum) {
        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.Type = type;
    }

    GetData() {
        var data = new ItemBasicStatsDetail(this.Level, this.PowerLevel, this.Amount, this.Type);
        data.Amount = new CalculationsHelper().getBasicStatForLevel(this.Type, this.Amount, this.Level);
        return data;
    }

    GetDescription(): string {
        var data = this.GetData();
        return data.Amount + " " + Helpers.getPropertyByValue(BasicStatsEnum, this.Type);
    }
}
