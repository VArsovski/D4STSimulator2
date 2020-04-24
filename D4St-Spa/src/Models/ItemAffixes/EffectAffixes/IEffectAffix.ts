import { SkillVM } from 'src/Models/SkillVM';

export interface IEffectAffix {
    ProcChance: number;
    Duration: number;
    Effect: string;
    Amount: number;
    AmountPercentage: number;
    SkillData: SkillVM;
}

export interface IEffectAffixHolder {
    SelectedType: number;
    AffixData: IEffectAffix;
}

export class SimpleEffectAffix implements IEffectAffix {
    ProcChance: number;
    Duration: number;
    Effect: string;
    Amount: number;
    AmountPercentage: number;
    SkillData: SkillVM;

    constructor(procChance?:number, duration?:number, effect?:string, amount?:number, amountPerc?:number, skillData?:SkillVM) {
        this.ProcChance = procChance || 0;
        this.Duration = duration || 0;
        this.Effect = effect || "";
        this.Amount = amount || 0;
        this.AmountPercentage || 0;
        this.SkillData = skillData;
    }
}
