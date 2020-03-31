import { IDescribable } from '../IDescribable';
import { PowerTypesEnum } from 'src/_Enums/powerTypesEnum';
import { Helpers } from 'src/_Helpers/helpers';
import { ResistanceTypesEnum } from 'src/_Enums/itemAffixEnums';
import { IPowerUp } from '../IPowerUp';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';

export class ItemBasicPowersDetail implements IDescribable, IPowerUp {
    Amount: number;
    Type: PowerTypesEnum;
    private Level: number;
    private PowerLevel: any;

    constructor(amount:number, type:PowerTypesEnum) {
        this.PowerLevel = 0;
        this.Level = 1;        
        this.Amount = amount;
        this.Type = type;
    }
    PowerUp() {
        this.PowerLevel++;
    }
    SetLevel(level: number) {
        this.Level = level;
    }
    public GetData()
    {
        this.Amount = new CalculationsHelper().getEmpoweredValue(this.Amount, this.PowerLevel);
        return this;
    }

    public GetDescription():string {
        var data = this.GetData();
        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
        return data.Amount + " " + Helpers.getPropertyByValue(PowerTypesEnum, this.Type) + " power" + empoweredStr;
    }
}

export class ItemBasicResistanceStatsDetail implements IDescribable, IPowerUp {
    Amount:number;
    Type:ResistanceTypesEnum;
    private PowerLevel: number;
    private Level: number;

    constructor(amount:number, type:ResistanceTypesEnum) {
        this.Amount = amount;
        this.Type = type;
    }

    public GetDescription():string {
        return this.Amount + " " + Helpers.getPropertyByValue(ResistanceTypesEnum, this.Type) + "% resistance"
    }
    PowerUp() {
        this.PowerLevel++;
    }
    SetLevel(level: number) {
        this.Level = level;
    }
    public GetData()
    {
        this.Amount = new CalculationsHelper().getEmpoweredValue(this.Amount, this.PowerLevel);
        return this;
    }
}
