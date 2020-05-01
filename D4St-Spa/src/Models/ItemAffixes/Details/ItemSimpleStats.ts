import { PowerTypesEnum } from 'src/_Enums/powerTypesEnum';
import { Helpers } from 'src/_Helpers/helpers';
import { ResistanceTypesEnum, AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { IItemAffixStats } from './IItemAffixStats';

export class ItemBasicPowersDetail implements IItemAffixStats {
    CategoryStats: AffixCategoryEnum;
    Amount: number;
    Type: PowerTypesEnum;
    private Level: number;
    private PowerLevel: any;
    private statsCalculated:boolean;
    SelectedEquipStat: string;

    constructor(level:number, powerLevel:number, amount:number, type:PowerTypesEnum) {

        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.Type = type;
        this.SelectedEquipStat = Helpers.getPropertyByValue(PowerTypesEnum, this.Type) + "Power";

        if (!this.statsCalculated) {
            this.Amount = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getBasicPowerForLevel(this.Amount, this.Level, this.Type), this.PowerLevel);
            this.statsCalculated = true;
        }
    }
    SelectedStat: string;

    public GetDescription():string {
        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
        return "+ " + this.Amount + " " + Helpers.getPropertyByValue(PowerTypesEnum, this.Type) + " power" + empoweredStr;
    }
}

export class ItemBasicResistanceStatsDetail implements IItemAffixStats {
    Amount:number;
    Type:ResistanceTypesEnum;
    SelectedStat: string;
    SelectedEquipStat: string;
    CategoryStats: AffixCategoryEnum;
    private PowerLevel: number;
    private Level: number;
    private statsCalculated:boolean;

    constructor(level:number, powerLevel:number, amount:number, type:ResistanceTypesEnum) {
        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.Type = type;

        if (!this.statsCalculated) {
            this.Amount = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getResistancesForLevel(this.Amount, this.Level, this.Type), this.PowerLevel);
            this.statsCalculated = true;
        }

        this.SelectedEquipStat = Helpers.getPropertyByValue(ResistanceTypesEnum, this.Type) + "Resistance";
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
    SelectedEquipStat: string;

    constructor(level:number, powerLevel:number, amount:number, amountPercentage:number, type:string) {
        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.AmountPercentage = amountPercentage;
        this.Type = type;
        this.SelectedEquipStat = type;

        if (!this.statsCalculated) {
            this.Amount = new CalculationsHelper().getEmpoweredValue(this.Amount, this.PowerLevel);
            this.statsCalculated = true;
        }
    }

    public GetDescription():string {
        var amtDescr = this.Amount ? this.Amount + " " + this.Type : "";
        var percDescr = this.AmountPercentage ? this.AmountPercentage + "% " + this.Type : ""
        return "+ " + (amtDescr || percDescr);
    }
}
