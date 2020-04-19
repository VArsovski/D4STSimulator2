import { ItemBasicPowersDetail, ItemBasicResistanceStatsDetail, ItemSimpleStats } from './ItemSimpleStats';
import { SkillVM } from 'src/Models/SkillVM';
import { PowerTypesEnum } from 'src/_Enums/powerTypesEnum';
import { BasicStatsEnum, ResistanceTypesEnum, AffixCategoryEnum, BasicStatTypesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { IItemAffixStats } from './IItemAffixStats';
import { ItemSkillStats } from './ItemSkillStats';

export class ItemBasicStats implements IItemAffixStats {
    CategoryStats: AffixCategoryEnum;
    private PowerStats:ItemBasicPowersDetail;
    private StatNumbers:ItemBasicStatsDetail;
    private StatRegen:ItemBasicStatsDetail;
    private StatPercentage:ItemBasicStatsDetail;
    private StatPercentageRegen:ItemBasicStatsDetail;
    private Resistance:ItemBasicResistanceStatsDetail;
    private SkillEmpower:ItemSkillStats;
    private Socket:ItemSimpleStats;
    private selectedStat:BasicStatTypesEnum;
    private PowerLevel: any;
    private Level: number;
    private statsCalculated:boolean;
    Amount:number; //Just to check whether there is data in here (from outside method)

    constructor(category: AffixCategoryEnum, level:number, powerLevel?:number, powerStats?:ItemBasicPowersDetail
        , statNumbers?:ItemBasicStatsDetail, statRegen?:ItemBasicStatsDetail, statPercentage?:ItemBasicStatsDetail, statRegenPercentage?:ItemBasicStatsDetail
        , resistance?:ItemBasicResistanceStatsDetail, skillEmpower?:SkillVM, socket?:number, selectedStat?:BasicStatTypesEnum) {

        this.CategoryStats = category;
        this.Amount = -1; // Just make sure it's not 0, (again) for outside check
        this.Socket = new ItemSimpleStats(level, powerLevel, socket || 0, "Socket");
        this.PowerLevel = powerLevel;
        this.Level = level;
        this.PowerStats = powerStats;
        this.StatNumbers = statNumbers;
        this.StatRegen = statRegen;
        this.StatPercentage = statPercentage;
        this.Resistance = resistance;
        this.SkillEmpower = new ItemSkillStats(category, skillEmpower, level, powerLevel);
        this.selectedStat = selectedStat;

        if (!this.statsCalculated && this.selectedStat) {
            this.statsCalculated = true;
            var data = this.GetCalculatedData(this, this.selectedStat);
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
        this.selectedStat = BasicStatTypesEnum.PowerStats;
    }

    public SetBasicStat(level:number, powerLevel:number, amount:number, type:BasicStatsEnum) {
        this.StatNumbers = new ItemBasicStatsDetail(level, powerLevel, amount, BasicStatTypesEnum.StatNumbers, type);
        this.selectedStat = BasicStatTypesEnum.StatNumbers;
    }

    public SetStatRegen(level:number, powerLevel:number, amount:number, type:BasicStatsEnum) {
        this.StatRegen = new ItemBasicStatsDetail(level, powerLevel, amount, BasicStatTypesEnum.StatRegen, type);
        this.selectedStat = BasicStatTypesEnum.StatRegen;
    }

    public SetBasicStatPercentage(level:number, powerLevel:number, amount:number, type:BasicStatsEnum) {
        this.StatPercentage = new ItemBasicStatsDetail(level, powerLevel, amount, BasicStatTypesEnum.StatPercentage, type);
        this.selectedStat = BasicStatTypesEnum.StatPercentage;
    }

    public SetRegenPercentage(level:number, powerLevel:number, amount:number, type:BasicStatsEnum) {
        this.StatPercentageRegen = new ItemBasicStatsDetail(level, powerLevel, amount, BasicStatTypesEnum.StatPercentageRegen, type);
        this.selectedStat = BasicStatTypesEnum.StatPercentageRegen;
    }

    public SetResistance(level:number, powerLevel:number, amount:number, type:ResistanceTypesEnum) {
        this.Resistance = new ItemBasicResistanceStatsDetail(level, powerLevel, amount, type);
        this.selectedStat = BasicStatTypesEnum.Resistance;
    }

    public SetSkill(level:number, skillData: SkillVM, levels?: number) {
        if (!levels) levels = 0;
        this.PowerLevel = levels || 0;
        // skillData.level += levels;
        this.SkillEmpower.AffixData = skillData;
        this.selectedStat = BasicStatTypesEnum.SkillEmpower;
    }

    public SetSocket() {
        this.Socket.Amount++;
        this.selectedStat = BasicStatTypesEnum.Socket;
    }

    public GetDescription(): string {
        var selectedStatStr = Helpers.getPropertyByValue(BasicStatTypesEnum, this.selectedStat);
        var selectedStatValue = this[selectedStatStr] as IItemAffixStats;
        var descrStat = selectedStatValue.GetDescription();
        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
        return descrStat + empoweredStr;
    }

    private GetCalculatedData(data:ItemBasicStats, selectedStat:BasicStatTypesEnum) {
        // var data = new ItemBasicStats(this.Level, this.PowerLevel, this.PowerStats
        //     , this.StatNumbers, this.StatRegen, this.StatPercentage, this.StatPercentageRegen
        //     , this.Resistance, this.SkillEmpower, this.Socket, selectedStat);

        if (selectedStat && !this.statsCalculated)
        {
            var dict = Helpers.extractEnum(BasicStatTypesEnum);
            var selectedTypeNum:number[] = [];
            dict.forEach(d => {if (d.value == data.selectedStat) selectedTypeNum.push(d.value);});
            // var amount = new CalculationsHelper().getBasicStatForLevel(selectedTypeNum[0], data[data.selectedStat].Amount, data.Level);

            // if (data.selectedStat == "PowerStats" || data.selectedStat == "Resistance")
            //     data[data.selectedStat].Amount = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getArmorStatForLevel(data[data.selectedStat].Amount, data.Level), data.PowerLevel);
            if ([BasicStatTypesEnum.StatNumbers, BasicStatTypesEnum.StatRegen, BasicStatTypesEnum.StatPercentage, BasicStatTypesEnum.StatPercentageRegen].indexOf(data.selectedStat) != -1)
            {
                // Should contain only one, DW :P
                data[data.selectedStat].Amount = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getArmorStatForLevel(data[data.selectedStat].Amount, data.Level), data.PowerLevel);
                data[data.selectedStat].AmountPercentage = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getArmorStatForLevel(data[data.selectedStat].AmountPercentage, data.Level), data.PowerLevel);
                if (!this.statsCalculated) {
                    this[data.selectedStat].Amount = data[data.selectedStat].Amount;
                    this[data.selectedStat].AmountPercentage = data[data.selectedStat].AmountPercentage;
                }
            }
            if (data.selectedStat == BasicStatTypesEnum.SkillEmpower) {
                debugger;
                if (!data.SkillEmpower.AffixData.level)
                    data.SkillEmpower.AffixData.level = 1;
                data.SkillEmpower.AffixData.level += data.PowerLevel;
                if (!this.statsCalculated) {
                    this.SkillEmpower.AffixData.level = data.SkillEmpower.AffixData.level;
                }
            }
            if (data.selectedStat == BasicStatTypesEnum.Socket) {
                data.Socket.Amount++;
                if (!this.statsCalculated) {
                    this.Socket = data.Socket;
                }
            }
        }

        return data;
    }
}

export class ItemBasicStatsDetail implements IItemAffixStats {
    CategoryStats: AffixCategoryEnum;
    Amount: number;
    private StatType: BasicStatTypesEnum;
    private Type: BasicStatsEnum;
    private Level: number;
    private PowerLevel: number;
    private statsCalculated:boolean;

    constructor(level:number, powerLevel:number, amount:number, statType:BasicStatTypesEnum, type:BasicStatsEnum) {
        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.StatType = statType;
        this.Type = type;

        if (!this.statsCalculated) {
            this.Amount = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getBasicStatForLevel(this.StatType, amount, this.Level), powerLevel);
            this.statsCalculated = true;
        }
    }
    GetDescription(): string {
        var selectedType = Helpers.getPropertyByValue(BasicStatsEnum, this.Type);
        var isRegen = [BasicStatTypesEnum.StatRegen, BasicStatTypesEnum.StatPercentageRegen].includes(this.StatType);
        var isPercentage = [BasicStatTypesEnum.StatPercentage, BasicStatTypesEnum.StatPercentageRegen].includes(this.StatType);

        return "+ " + this.Amount + (isPercentage ? "%" : "") + " " + selectedType + (isRegen ? " regen " : "");
    }
}
