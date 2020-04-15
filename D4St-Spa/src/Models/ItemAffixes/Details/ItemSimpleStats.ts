import { IDescribable } from '../IDescribable';
import { PowerTypesEnum } from 'src/_Enums/powerTypesEnum';
import { Helpers } from 'src/_Helpers/helpers';
import { ResistanceTypesEnum } from 'src/_Enums/itemAffixEnums';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';

export class ItemBasicPowersDetail implements IDescribable {
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
        return this.Amount + " " + Helpers.getPropertyByValue(PowerTypesEnum, this.Type) + " power" + empoweredStr;
    }
}

export class ItemBasicResistanceStatsDetail implements IDescribable {
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

    public GetDescription():string {
        return this.Amount + " " + Helpers.getPropertyByValue(ResistanceTypesEnum, this.Type) + "% resistance"
    }
}
