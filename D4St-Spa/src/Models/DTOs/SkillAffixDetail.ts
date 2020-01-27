import { ISkillAffixDetail } from './ISkillAffixDetail';

export class SkillAffixDetail implements ISkillAffixDetail {
    Description: string;
    PowerType: number;
    ProcChance: number;
    Duration: number;
    Amount: number;
    SelectedAffix: string;
    ProcsOnDeath: boolean;
    Stackable: boolean;
    IsBuff: boolean;
}
