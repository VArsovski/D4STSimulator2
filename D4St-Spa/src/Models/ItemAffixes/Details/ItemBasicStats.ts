import { ItemBasicPowersDetail, ItemBasicResistanceStatsDetail, ItemSimpleStats } from './ItemSimpleStats';
import { SkillVM } from 'src/Models/SkillVM';
import { PowerTypesEnum } from 'src/_Enums/powerTypesEnum';
import { BasicStatsEnum, ResistanceTypesEnum, AffixCategoryEnum, BasicStatTypesEnum, ArmorTypesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { IItemAffixStats, IItemAffixStatsMetadata, SimpleItemAffixStatsMetadata } from './IItemAffixStats';
import { ItemSkillStats } from './ItemSkillStats';
import { IEquippableStat } from 'src/Models/InventoryModels/InventoryDetailModels/IEquippableStat';
import { BasicStatEquippable } from '../../IEquippableStatDetails/BasicStatEquippable';
import { IItemAffix } from '../IItemAffix';
import { PowerStatEquippable } from '../../IEquippableStatDetails/PowerStatEquippable';
import { ResistanceEquippable } from '../../IEquippableStatDetails/ResistanceEquippable';
import { SkillStatEquippable } from '../../IEquippableStatDetails/SkillStatEquippable';

export class ItemBasicStats implements IItemAffixStats, IEquippableStat {

    CategoryStats: AffixCategoryEnum;
    private PowerStats:ItemBasicPowersDetail;
    private StatNumbers:ItemBasicStatsDetail;
    private StatRegen:ItemBasicStatsDetail;
    private StatPercentage:ItemBasicStatsDetail;
    private StatPercentageRegen:ItemBasicStatsDetail;
    private StatReturn:ItemBasicStatsDetail;
    private Resistance:ItemBasicResistanceStatsDetail;
    private SkillEmpower:ItemSkillStats;
    private Socket:ItemSimpleStats;
    private selectedStat:BasicStatTypesEnum;
    private PowerLevel: any;
    private Level: number;
    private statsCalculated:boolean;
    Amount:number; //Just to check whether there is data in here (from outside method)
    InputMeta: IItemAffixStatsMetadata;
    OutputMeta: IItemAffixStatsMetadata;

    constructor(category: AffixCategoryEnum, level:number, powerLevel?:number, powerStats?:ItemBasicPowersDetail
        , statNumbers?:ItemBasicStatsDetail, statRegen?:ItemBasicStatsDetail, statPercentage?:ItemBasicStatsDetail, statRegenPercentage?:ItemBasicStatsDetail, statReturn?:ItemBasicStatsDetail
        , resistance?:ItemBasicResistanceStatsDetail, skillEmpower?:SkillVM, socket?:number, selectedStat?:BasicStatTypesEnum) {

        this.CategoryStats = category;
        this.Amount = -1; // Just make sure it's not 0, (again) for outside check
        this.Socket = new ItemSimpleStats(level, powerLevel, 0, socket || 0, "Socket");
        this.PowerLevel = powerLevel;
        this.Level = level;
        this.PowerStats = powerStats;
        this.StatNumbers = statNumbers;
        this.StatRegen = statRegen;
        this.StatPercentage = statPercentage;
        this.StatPercentageRegen = statRegenPercentage;
        this.StatReturn = statReturn;
        this.Resistance = resistance;
        this.SkillEmpower = new ItemSkillStats(category, skillEmpower, level, powerLevel);
        this.selectedStat = selectedStat;
        this.InputMeta = new SimpleItemAffixStatsMetadata();
        this.OutputMeta = new SimpleItemAffixStatsMetadata();

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

    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;;

    public SetPowers(level:number, powerLevel:number, amount:number, type:PowerTypesEnum) {
        this.PowerStats = new ItemBasicPowersDetail(level, powerLevel, amount, type);
        this.selectedStat = BasicStatTypesEnum.PowerStats;
        this.UpdateEquipEventMetadata();
    }

    public SetBasicStat(level:number, powerLevel:number, amount:number, type:BasicStatsEnum) {
        this.StatNumbers = new ItemBasicStatsDetail(level, powerLevel, amount, BasicStatTypesEnum.StatNumbers, type);
        this.selectedStat = BasicStatTypesEnum.StatNumbers;
        this.UpdateEquipEventMetadata();
    }

    public SetStatRegen(level:number, powerLevel:number, amount:number, type:BasicStatsEnum) {
        this.StatRegen = new ItemBasicStatsDetail(level, powerLevel, amount, BasicStatTypesEnum.StatRegen, type);
        this.selectedStat = BasicStatTypesEnum.StatRegen;
        this.UpdateEquipEventMetadata();
    }

    public SetBasicStatPercentage(level:number, powerLevel:number, amount:number, type:BasicStatsEnum) {
        this.StatPercentage = new ItemBasicStatsDetail(level, powerLevel, amount, BasicStatTypesEnum.StatPercentage, type);
        this.selectedStat = BasicStatTypesEnum.StatPercentage;
        this.UpdateEquipEventMetadata();
    }

    public SetRegenPercentage(level:number, powerLevel:number, amount:number, type:BasicStatsEnum) {
        this.StatPercentageRegen = new ItemBasicStatsDetail(level, powerLevel, amount, BasicStatTypesEnum.StatPercentageRegen, type);
        this.selectedStat = BasicStatTypesEnum.StatPercentageRegen;
        this.UpdateEquipEventMetadata();
    }

    public SetStatReturn(level: number, powerLevel: number, amount: number, type:BasicStatsEnum) {
        this.StatReturn = new ItemBasicStatsDetail(level, powerLevel, amount, BasicStatTypesEnum.StatReturn, type);
        this.selectedStat = BasicStatTypesEnum.StatReturn;
        this.UpdateEquipEventMetadata();
    }

    public SetResistance(level:number, powerLevel:number, amount:number, type:ResistanceTypesEnum) {
        this.Resistance = new ItemBasicResistanceStatsDetail(level, powerLevel, amount, type);
        this.selectedStat = BasicStatTypesEnum.Resistance;
        this.UpdateEquipEventMetadata();
    }

    public SetSkill(level:number, skillData: SkillVM, levels?: number) {
        if (!levels) levels = 0;
        this.PowerLevel = levels || 0;
        // skillData.level += levels;
        this.SkillEmpower.AffixData = skillData;
        this.selectedStat = BasicStatTypesEnum.SkillEmpower;
        this.UpdateEquipEventMetadata();
    }

    public SetSocket() {
        this.Socket.Amount++;
        this.selectedStat = BasicStatTypesEnum.Socket;
        this.UpdateEquipEventMetadata();
    }

    // TODO: Sadly, have to do/invoke from SecondaryTriggers sometimes even this.. :/
    public SetSelectedStat() {
        if (!this.selectedStat) {
            this.selectedStat = this.GetSelectedStat();
            this.CategoryStats = AffixCategoryEnum.IncreaseBasicStat;
        }
    }

    public GetDescription(): string {
        var selectedStatStr = Helpers.getPropertyByValue(BasicStatTypesEnum, this.selectedStat);
        var selectedStatValue = this[selectedStatStr] as IItemAffixStats;
        var descrStat = selectedStatValue.GetDescription();
        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
        return descrStat + empoweredStr;
    }

    private GetSelectedStat():number {
        var selectedStat:number = 0;
        var currentStats:string[] = ["PowerStats","StatNumbers","StatRegen","StatPercentage","StatPercentageRegen","StatReturn","Resistance"];//["SkillEmpower","Socket"];
        var defaultStats:string[] = ["SkillEmpower","Socket"];

        for (let i = 0; i < currentStats.length; i++)
            if (this[currentStats[i]]) { selectedStat = i; break; }
        for (let i = 0; i < defaultStats.length; i++)
            if (this[currentStats[i]]) { selectedStat = i; break; }

        return selectedStat;
    }

    private GetCalculatedData(data:ItemBasicStats, selectedStat:BasicStatTypesEnum) {
        
        if (selectedStat && !this.statsCalculated)
        {
            var dict = Helpers.extractEnum(BasicStatTypesEnum);
            var selectedTypeNum:number[] = [];
            dict.forEach(d => {if (d.value == data.selectedStat) selectedTypeNum.push(d.value);});

            // if (data.selectedStat == "PowerStats" || data.selectedStat == "Resistance")
            //     data[data.selectedStat].Amount = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getArmorStatForLevel(data[data.selectedStat].Amount, data.Level), data.PowerLevel);
            if ([BasicStatTypesEnum.StatNumbers, BasicStatTypesEnum.StatRegen, BasicStatTypesEnum.StatPercentage, BasicStatTypesEnum.StatPercentageRegen].indexOf(data.selectedStat) != -1)
            {
                // Should contain only one, DW :P
                data[data.selectedStat].Amount = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getArmorStatForLevel(data[data.selectedStat].Amount, data.Level), data.PowerLevel);
                data[data.selectedStat].AmountPercentage = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getArmorStatForLevel(data[data.selectedStat].AmountPercentage, data.Level), data.PowerLevel);
                if (!this.statsCalculated) {
                    this[data.selectedStat].Amount = Math.min(data[data.selectedStat].Amount, 1 + this.PowerLevel);
                    this[data.selectedStat].AmountPercentage = Math.min(data[data.selectedStat].AmountPercentage, 5,  this.PowerLevel);
                }
            }
            if (data.selectedStat == BasicStatTypesEnum.SkillEmpower) {
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

    private UpdateEquipEventMetadata() {
        this.OutputMeta.SelectedEquipStat = this.PowerStats ? this.PowerStats.OutputMeta.SelectedEquipStat// Helpers.getPropertyByValue(PowerTypesEnum, this.PowerStats.Type)
        : this.StatNumbers ? this.StatNumbers.OutputMeta.SelectedEquipStat// Helpers.getPropertyByValue(BasicStatsEnum, this.StatNumbers.Type)
        : this.StatRegen ? this.StatRegen.OutputMeta.SelectedEquipStat// Helpers.getPropertyByValue(BasicStatsEnum, this.StatRegen.Type) + "Regen"
        : this.StatPercentage ? this.StatPercentage.OutputMeta.SelectedEquipStat// Helpers.getPropertyByValue(BasicStatsEnum, this.StatPercentage.Type) + "Percentage"
        : this.StatPercentageRegen ? this.StatPercentageRegen.OutputMeta.SelectedEquipStat// Helpers.getPropertyByValue(BasicStatsEnum, this.StatPercentageRegen.Type) + "RegenPercentage"
        : this.StatReturn ? this.StatReturn.OutputMeta.SelectedEquipStat// Helpers.getPropertyByValue(BasicStatsEnum, this.StatReturn.Type) + "Return"
        : this.Resistance ? this.Resistance.OutputMeta.SelectedEquipStat// Helpers.getPropertyByValue(ResistanceTypesEnum, this.Resistance.Type) + "Resistance"
        : this.PowerStats ? this.PowerStats.OutputMeta.SelectedEquipStat// Helpers.getPropertyByValue(PowerTypesEnum, this.PowerStats.Type) + "Power"
        : this.SkillEmpower ? "SkillEmpower:" + (this.SkillEmpower.AffixData || {name:""}).name
        : null;

        if (!this.selectedStat)
            this.selectedStat = this.GetSelectedStat();

        this.OutputMeta.SelectedStat = Helpers.getPropertyByValue(BasicStatTypesEnum, this.selectedStat);
        this.updateEquippedStats = this.selectedStat == BasicStatTypesEnum.PowerStats ? new PowerStatEquippable(this.OutputMeta.SelectedStat, this.OutputMeta.SelectedEquipStat).updateEquippedStats
                                 : this.selectedStat == BasicStatTypesEnum.SkillEmpower ? new SkillStatEquippable(this.OutputMeta.SelectedStat, this.OutputMeta.SelectedEquipStat).updateEquippedStats
                                 : this.selectedStat == BasicStatTypesEnum.Resistance ? new ResistanceEquippable(this.OutputMeta.SelectedStat, this.OutputMeta.SelectedEquipStat).updateEquippedStats
                                 : new BasicStatEquippable(this.OutputMeta.SelectedStat, this.OutputMeta.SelectedEquipStat).updateEquippedStats
    }
}

export class ItemBasicStatsDetail implements IItemAffixStats, IEquippableStat {
    CategoryStats: AffixCategoryEnum;
    Amount: number;
    StatType: BasicStatTypesEnum;
    Type: BasicStatsEnum;
    private Level: number;
    private PowerLevel: number;
    private statsCalculated:boolean;
    InputMeta: IItemAffixStatsMetadata;
    OutputMeta: IItemAffixStatsMetadata;

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

        var suffix = this.StatType == BasicStatTypesEnum.StatNumbers ? ""
        : this.StatType == BasicStatTypesEnum.StatRegen ? "Regen"
        : this.StatType == BasicStatTypesEnum.StatPercentage ? "Percentage"
        : this.StatType == BasicStatTypesEnum.StatPercentageRegen ? "RegenPercentage"
        : "";

        this.InputMeta = new SimpleItemAffixStatsMetadata();
        this.OutputMeta = new SimpleItemAffixStatsMetadata();
        this.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.InputMeta.SelectedStat = Helpers.getPropertyByValue(BasicStatTypesEnum, this.StatType);
        this.InputMeta.SelectedEquipStat = Helpers.getPropertyByValue(BasicStatsEnum, this.Type);
        this.OutputMeta.SelectedStat = Helpers.getPropertyByValue(BasicStatTypesEnum, this.StatType);
        this.OutputMeta.SelectedEquipStat = Helpers.getPropertyByValue(BasicStatsEnum, this.Type) + suffix;
        this.updateEquippedStats = new BasicStatEquippable(this.OutputMeta.SelectedStat, this.OutputMeta.SelectedEquipStat).updateEquippedStats;
    }

    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    GetDescription(): string {
        var selectedType = Helpers.getPropertyByValue(BasicStatsEnum, this.Type);
        var isRegen = [BasicStatTypesEnum.StatRegen, BasicStatTypesEnum.StatPercentageRegen].includes(this.StatType);
        var isPercentage = [BasicStatTypesEnum.StatPercentage, BasicStatTypesEnum.StatPercentageRegen].includes(this.StatType);

        var isReturn = this.StatType == BasicStatTypesEnum.StatReturn;
        if (isReturn)
            return this.Amount + (isPercentage ? "% " : " ") + Helpers.getPropertyByValue(BasicStatsEnum, this.Type) + " return";
        else return "+ " + this.Amount + (isPercentage ? "%" : "") + " " + selectedType + (isRegen ? " regen " : "");
    }
}
