import { IClassDefinition } from './IClassDefinition';

export interface IMainStatAffix {
    BasicAmount: number;
    BonusAmount: number;
    BonusAmountPercentage: number;
    BasicRegen: number;
    BonusRegen: number;
    BonusRegenPercentage: number;
    CalculateAmount(classStats: IClassDefinition);
    CalculateRegen(classStats: IClassDefinition);
}
