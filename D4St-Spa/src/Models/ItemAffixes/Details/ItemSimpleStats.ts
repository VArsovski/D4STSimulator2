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

    constructor(level:number, powerLevel:number, amount:number, type:PowerTypesEnum) {

        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.Type = type;

        if (!this.statsCalculated) {
            this.Amount = new CalculationsHelper().getBasicPowerForLevel(this.Amount, this.Level, this.Type);
            this.statsCalculated = true;
        }
    }

    public GetDescription():string {
        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
        return "+ " + this.Amount + " " + Helpers.getPropertyByValue(PowerTypesEnum, this.Type) + " power" + empoweredStr;
    }
}

export class ItemBasicResistanceStatsDetail implements IItemAffixStats {
    Amount:number;
    Type:ResistanceTypesEnum;
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
    }
    CategoryStats: AffixCategoryEnum;

    public GetDescription():string {
        return "+ " + this.Amount + " " + Helpers.getPropertyByValue(ResistanceTypesEnum, this.Type) + "% resistance"
    }
}

export class ItemSimpleStats implements IItemAffixStats {
    Amount:number;
    private PowerLevel: number;
    private Level: number;
    private statsCalculated:boolean;
    Type:string;

    constructor(level:number, powerLevel:number, amount:number, type:string) {
        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.Type = type;

        if (!this.statsCalculated) {
            this.Amount = new CalculationsHelper().getEmpoweredValue(this.Amount, this.PowerLevel);
            this.statsCalculated = true;
        }
    }
    CategoryStats: AffixCategoryEnum;

    public GetDescription():string {
        return this.Amount ? this.Amount + " " + this.Type : "";
    }
}
