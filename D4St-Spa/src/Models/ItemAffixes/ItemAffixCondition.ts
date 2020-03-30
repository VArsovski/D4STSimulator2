import { IItemAffixCondition } from './IItemAffixCondition';
import { PowerTypesEnum } from "../../_Enums/powerTypesEnum";

export class ItemAffixCondition implements IItemAffixCondition {
    Level: number;
    Condition: number;
    ConditionPowerType: PowerTypesEnum;
    ConditionPowerIndex: number;

    constructor(level:number, condition:number, conditionPowerType:PowerTypesEnum, conditionPowerIndex:number) {
        this.Level = level;
        this.Condition = condition;
        this.ConditionPowerType = conditionPowerType;
        this.ConditionPowerIndex = conditionPowerIndex;
    }
}
