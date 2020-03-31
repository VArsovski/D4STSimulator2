import { IDescribable } from '../IDescribable';
import { IPowerUp } from '../IPowerUp';
import { ItemBasicPowersDetail, ItemBasicResistanceStatsDetail } from './ItemSimpleStats';
import { SkillVM } from 'src/Models/SkillVM';
import { PowerTypesEnum } from 'src/_Enums/powerTypesEnum';
import { BasicStatsEnum, ResistanceTypesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';

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
        this.PowerLevel = 0;
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
        var data = this.GetData();
        
        var descr1 = ""; if (this.PowerStats) descr1 = data.PowerStats.GetDescription();
        var descr2 = ""; if (this.StatNumbers) descr2 = data.StatNumbers.GetDescription();
        var descr3 = ""; if (this.StatRegen) descr3 = data.StatRegen.GetDescription();
        var descr4 = ""; if (this.StatPercentage) descr4 = data.StatPercentage.GetDescription();
        var descr5 = ""; if (this.StatPercentageRegen) descr5 = data.StatPercentageRegen.GetDescription();
        var descr6 = ""; if (this.Resistance) descr6 = data.Resistance.GetDescription();
        var descr7 = "";
        
        if (data.SkillEmpower)
            descr7 += data.SkillEmpower.level + " to " + data.SkillEmpower.name + " (" + data.SkillEmpower.className + " only)";

        var descr8 = data.Socket != 0 ? "Socket/s " + data.Socket: "";

        var descr = descr1 + descr2 + descr3 + descr4 + descr5 + descr6 + descr7 + descr8;

        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
        descr+= empoweredStr;

        if (descr.startsWith("NaN") || descr.startsWith("0"))
            console.log(this);

        return descr;
    }

    PowerUp() {
        this.PowerLevel++;
    }

    GetData() {
        if (this.selectedStat)
        {
            if (this.selectedStat == "PowerStats")
                this.PowerStats.Amount = new CalculationsHelper().getEmpoweredValue(this.PowerStats.Amount, this.PowerLevel);
            if (["StatNumbers", "StatRegen", "StatPercentage", "StatPercentageRegen" ].indexOf(this.selectedStat) != -1)
            {
                // Should contain only one, DW :P
                this[this.selectedStat].Amount = new CalculationsHelper().getEmpoweredValue(this[this.selectedStat].Amount, this.PowerLevel);
                this[this.selectedStat].AmountPercentage = new CalculationsHelper().getEmpoweredValue(this[this.selectedStat].AmountPercentage, this.PowerLevel);
            }
            if (this.selectedStat == "SkillEmpower")
                this.SkillEmpower.level += this.PowerLevel;
            if (this.selectedStat == "Socket")
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
