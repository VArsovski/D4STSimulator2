import { PowerTypesEnum } from 'src/_Enums/powerTypesEnum';
import { Helpers } from 'src/_Helpers/helpers';
import { ResistanceTypesEnum, AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { IItemAffixStats, IItemAffixStatsMetadata, SimpleItemAffixStatsMetadata, SimpleAffixStats } from './IItemAffixStats';
import { IEquippableAffixStat } from 'src/Models/IEquippableStatDetails/IEquippableAffixStat';
import { IItemAffix } from '../IItemAffix';
import { InventoryDamageModel } from 'src/Models/InventoryModels/InventoryDamageModel';
import { PowerStatEquippable } from 'src/Models/IEquippableStatDetails/PowerStatEquippable';
import { ResistanceEquippable } from 'src/Models/IEquippableStatDetails/ResistanceEquippable';

export class ItemBasicPowersDetail implements IEquippableAffixStat {
    CategoryStats: AffixCategoryEnum;
    Amount: number;
    Type: PowerTypesEnum;
    private Level: number;
    private PowerLevel: any;
    private statsCalculated:boolean;
    EquippableStatData: IItemAffixStats;
    getZeroStats: (src: any) => any;
    updateEquippedStats: (src: any, affix: IItemAffix) => any;
    
    constructor(level:number, powerLevel:number, amount:number, type:PowerTypesEnum) {

        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.Type = type;

        if (!this.statsCalculated) {
            this.Amount = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getBasicPowerForLevel(this.Amount, this.Level, this.Type), this.PowerLevel);
            this.statsCalculated = true;
        }

        this.EquippableStatData = new SimpleAffixStats();
        this.EquippableStatData.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.EquippableStatData.InputMeta.SelectedStat = Helpers.getPropertyByValue(AffixCategoryEnum, this.CategoryStats);
        this.EquippableStatData.OutputMeta.SelectedCategoryStat = "BasicStat";
        this.EquippableStatData.OutputMeta.SelectedStat = "PowerData";
        this.EquippableStatData.OutputMeta.SelectedEquipStat = Helpers.getPropertyByValue(PowerTypesEnum, this.Type) + "Power";
        this.getZeroStats = (src) => { (src as InventoryDamageModel).Amount = 0; return src; }
        this.updateEquippedStats = new PowerStatEquippable().updateEquippedStats;
    }

    public GetDescription():string {
        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
        return "+ " + this.Amount + " " + Helpers.getPropertyByValue(PowerTypesEnum, this.Type) + " power" + empoweredStr;
    }
}

export class ItemBasicResistanceStatsDetail implements IEquippableAffixStat {
    Amount:number;
    Type:ResistanceTypesEnum;
    CategoryStats: AffixCategoryEnum;
    private PowerLevel: number;
    private Level: number;
    private statsCalculated:boolean;
    EquippableStatData: IItemAffixStats;
    getZeroStats: (src: any) => any;
    updateEquippedStats: (src: any, affix: IItemAffix) => IItemAffix;

    constructor(level:number, powerLevel:number, amount:number, type:ResistanceTypesEnum) {
        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.Type = type;

        if (!this.statsCalculated) {
            this.Amount = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getResistancesForLevel(this.Amount, this.Level, this.Type), this.PowerLevel);
            this.statsCalculated = true;
        }

        this.EquippableStatData = new SimpleAffixStats();
        this.EquippableStatData.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.EquippableStatData.InputMeta.SelectedStat = Helpers.getPropertyByValue(AffixCategoryEnum, this.CategoryStats);
        this.EquippableStatData.OutputMeta.SelectedCategoryStat = "BasicStat";
        this.EquippableStatData.OutputMeta.SelectedStat = "Resistance";
        this.EquippableStatData.OutputMeta.SelectedEquipStat = Helpers.getPropertyByValue(ResistanceTypesEnum, this.Type) + "Resistance";
        this.getZeroStats = (src) => { return new InventoryDamageModel(); }
        this.updateEquippedStats = new ResistanceEquippable().updateEquippedStats;
    }

    public GetDescription():string {
        return "+ " + this.Amount + "% " + Helpers.getPropertyByValue(ResistanceTypesEnum, this.Type) + " resistance"
    }
}

export class ItemSimpleStats implements IEquippableAffixStat {
    Type:string;
    Amount:number;
    AmountPercentage:number;
    private PowerLevel: number;
    private Level: number;
    private statsCalculated:boolean;
    CategoryStats: AffixCategoryEnum;
    EquippableStatData: IItemAffixStats;
    getZeroStats: (src: any) => any;
    updateEquippedStats: (src: any, affix: IItemAffix) => any;

    constructor(level:number, powerLevel:number, amount:number, amountPercentage:number, type:string) {
        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.AmountPercentage = amountPercentage;
        this.Type = type;

        if (!this.statsCalculated) {
            this.Amount = new CalculationsHelper().getEmpoweredValue(this.Amount, this.PowerLevel);
            this.statsCalculated = true;
        }

        this.EquippableStatData = new SimpleAffixStats();
        this.EquippableStatData.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.EquippableStatData.InputMeta.SelectedStat = Helpers.getPropertyByValue(AffixCategoryEnum, this.CategoryStats);
        this.EquippableStatData.OutputMeta.SelectedCategoryStat = "BasicStat";
        this.EquippableStatData.OutputMeta.SelectedStat = "SimpleStat";
        this.EquippableStatData.OutputMeta.SelectedEquipStat = this.Type;
    }

    public GetDescription():string {
        var amtDescr = this.Amount ? this.Amount + " " + this.Type : "";
        var percDescr = this.AmountPercentage ? this.AmountPercentage + "% " + this.Type : ""
        return "+ " + (amtDescr || percDescr);
    }
}
