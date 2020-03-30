import { PowerTypesEnum } from 'src/_Enums/powerTypesEnum';

export interface IItemAffixCondition {
    Level: number,
    Condition: number,
    ConditionPowerType: PowerTypesEnum
}
