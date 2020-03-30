import { IDescribable } from '../IDescribable';
import { IPowerUp } from '../IPowerUp';
import { ItemBasicPowersDetail, ItemBasicResistanceStatsDetail } from './ItemSimpleStats';
import { SkillVM } from 'src/Models/SkillVM';
import { PowerTypesEnum } from 'src/_Enums/powerTypesEnum';
import { BasicStatsEnum, ResistanceTypesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';

export class ItemBasicStats implements IDescribable, IPowerUp {
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

    constructor() {
        this.Socket = 0;
    }

    public SetPowers(amount:number, type:PowerTypesEnum) {
        this.PowerStats = new ItemBasicPowersDetail(amount, type);
        this.selectedStat = "PowerStats";
    }

    public SetBasicStat(amount:number, type:BasicStatsEnum) {
        this.StatNumbers = new ItemBasicStatsDetail(amount, type);
        this.selectedStat = "StatNumbers";
    }

    public SetBasicStatPercentage(amount:number, type:BasicStatsEnum) {
        this.StatPercentage = new ItemBasicStatsDetail(amount, type);
        this.selectedStat = "StatPercentage";
    }

    public SetRegenPercentage(amount:number, type:BasicStatsEnum) {
        this.StatPercentageRegen = new ItemBasicStatsDetail(amount, type);
        this.selectedStat = "StatPercentageRegen";
    }

    public SetResistance(amount:number, type:ResistanceTypesEnum) {
        this.Resistance = new ItemBasicResistanceStatsDetail(amount, type);
        this.selectedStat = "Resistance";
    }

    public SetSkill(skillData: SkillVM, levels?: number) {
        if (!levels) levels = 1;
        skillData.level = levels;
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
            descr7 += this.SkillEmpower.level + " to " + this.SkillEmpower.name + " (" + this.SkillEmpower.className + " only)";

        var descr8 = this.Socket != 0 ? "Socket": "";

        var descr = descr1 + descr2 + descr3 + descr4 + descr5 + descr6 + descr7 + descr8;
        if (descr.startsWith("NaN") || descr.startsWith("0"))
            console.log(this);

        return descr;
    }

    PowerUp() {
        this.PowerLevel++;
    }

    GetData() {
        var varianceToEmpower = (100 + Helpers.getRandom(120, 140))/100;
        if (this.selectedStat)
        {
            if (this.selectedStat == "PowerStats")
                this.PowerStats.Amount *= Math.pow(varianceToEmpower, this.PowerLevel);
            if (["StatNumbers", "StatRegen", "StatPercentage", "StatPercentageRegen" ].indexOf(this.selectedStat) != -1)
            {
                // Should contain only one, DW :P
                this[this.selectedStat].Amount *= Math.pow(varianceToEmpower, this.PowerLevel);
                this[this.selectedStat].AmountPercentage *= Math.pow(varianceToEmpower, this.PowerLevel);
            }
            if (this.selectedStat = "SkillEmpower")
                this.SkillEmpower.level += this.PowerLevel;
            if (this.selectedStat = "Socket")
                this.Socket++;
        }
        return this;
    }
    SetLevel(level: number) { this.Level = level; }
    Level: number;    
}

export class ItemBasicStatsDetail implements IDescribable {
    Amount: number;
    Type: BasicStatsEnum;

    constructor(amount:number, type:BasicStatsEnum) {
        this.Amount = amount;
        this.Type = type;
    }
    GetDescription(): string {
        return this.Amount + " " + Helpers.getPropertyByValue(BasicStatsEnum, this.Type);
    }
}
