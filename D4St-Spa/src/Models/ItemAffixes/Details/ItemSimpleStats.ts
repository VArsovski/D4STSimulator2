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

    constructor(level:number, powerLevel:number, amount:number, type:PowerTypesEnum) {
        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.Type = type;
    }
    public GetData()
    {
        this.Amount = new CalculationsHelper().getBasicPowerForLevel(this.Amount, this.Level, this.Type);
        return this;
    }

    public GetDescription():string {
        var data = this.GetData();
        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
        return data.Amount + " " + Helpers.getPropertyByValue(PowerTypesEnum, this.Type) + " power" + empoweredStr;
    }
}

export class ItemBasicResistanceStatsDetail implements IDescribable {
    Amount:number;
    Type:ResistanceTypesEnum;
    private PowerLevel: number;
    private Level: number;

    constructor(level:number, powerLevel:number, amount:number, type:ResistanceTypesEnum) {
        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.Type = type;
    }

    public GetDescription():string {
        var data = this.GetData();
        return data.Amount + " " + Helpers.getPropertyByValue(ResistanceTypesEnum, data.Type) + "% resistance"
    }
    public GetData()
    {
        var data = new ItemBasicResistanceStatsDetail(this.Level, this.PowerLevel, this.PowerLevel, this.Type);
        data.Amount = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getResistancesForLevel(this.Amount, this.Level, this.Type), this.PowerLevel);
        return data;
    }
}
