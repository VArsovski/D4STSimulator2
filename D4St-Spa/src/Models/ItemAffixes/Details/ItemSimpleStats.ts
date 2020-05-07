import { PowerTypesEnum } from 'src/_Enums/powerTypesEnum';
import { Helpers } from 'src/_Helpers/helpers';
import { ResistanceTypesEnum, AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { IItemAffixStats, IItemAffixStatsMetadata, SimpleItemAffixStatsMetadata } from './IItemAffixStats';

export class ItemBasicPowersDetail implements IItemAffixStats {
    CategoryStats: AffixCategoryEnum;
    Amount: number;
    Type: PowerTypesEnum;
    private Level: number;
    private PowerLevel: any;
    private statsCalculated:boolean;
    InputMeta: IItemAffixStatsMetadata;
    OutputMeta: IItemAffixStatsMetadata;
    
    constructor(level:number, powerLevel:number, amount:number, type:PowerTypesEnum) {

        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.Type = type;

        if (!this.statsCalculated) {
            this.Amount = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getBasicPowerForLevel(this.Amount, this.Level, this.Type), this.PowerLevel);
            this.statsCalculated = true;
        }

        this.InputMeta = new SimpleItemAffixStatsMetadata();
        this.OutputMeta = new SimpleItemAffixStatsMetadata();
        this.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.InputMeta.SelectedStat = Helpers.getPropertyByValue(AffixCategoryEnum, this.CategoryStats);
        this.OutputMeta.SelectedCategoryStat = "BasicStat";
        this.OutputMeta.SelectedStat = "Powers";
        this.OutputMeta.SelectedEquipStat = Helpers.getPropertyByValue(PowerTypesEnum, this.Type) + "Power";
    }

    public GetDescription():string {
        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
        return "+ " + this.Amount + " " + Helpers.getPropertyByValue(PowerTypesEnum, this.Type) + " power" + empoweredStr;
    }
}

export class ItemBasicResistanceStatsDetail implements IItemAffixStats {
    Amount:number;
    Type:ResistanceTypesEnum;
    CategoryStats: AffixCategoryEnum;
    private PowerLevel: number;
    private Level: number;
    private statsCalculated:boolean;
    InputMeta: IItemAffixStatsMetadata;
    OutputMeta: IItemAffixStatsMetadata;

    constructor(level:number, powerLevel:number, amount:number, type:ResistanceTypesEnum) {
        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.Type = type;

        if (!this.statsCalculated) {
            this.Amount = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getResistancesForLevel(this.Amount, this.Level, this.Type), this.PowerLevel);
            this.statsCalculated = true;
        }

        this.InputMeta = new SimpleItemAffixStatsMetadata();
        this.OutputMeta = new SimpleItemAffixStatsMetadata();
        this.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.InputMeta.SelectedStat = Helpers.getPropertyByValue(AffixCategoryEnum, this.CategoryStats);
        this.OutputMeta.SelectedCategoryStat = "BasicStat";
        this.OutputMeta.SelectedStat = "Resistance";
        this.OutputMeta.SelectedEquipStat = Helpers.getPropertyByValue(ResistanceTypesEnum, this.Type) + "Resistance";
    }

    public GetDescription():string {
        return "+ " + this.Amount + "% " + Helpers.getPropertyByValue(ResistanceTypesEnum, this.Type) + " resistance"
    }
}

export class ItemSimpleStats implements IItemAffixStats {
    Type:string;
    Amount:number;
    AmountPercentage:number;
    private PowerLevel: number;
    private Level: number;
    private statsCalculated:boolean;
    CategoryStats: AffixCategoryEnum;

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

        this.InputMeta = new SimpleItemAffixStatsMetadata();
        this.OutputMeta = new SimpleItemAffixStatsMetadata();
        this.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.InputMeta.SelectedStat = Helpers.getPropertyByValue(AffixCategoryEnum, this.CategoryStats);
        this.OutputMeta.SelectedCategoryStat = "BasicStat";
        this.OutputMeta.SelectedStat = "SimpleStat";
        this.OutputMeta.SelectedEquipStat = this.Type;
    }
    InputMeta: IItemAffixStatsMetadata;
    OutputMeta: IItemAffixStatsMetadata;

    public GetDescription():string {
        var amtDescr = this.Amount ? this.Amount + " " + this.Type : "";
        var percDescr = this.AmountPercentage ? this.AmountPercentage + "% " + this.Type : ""
        return "+ " + (amtDescr || percDescr);
    }
}
