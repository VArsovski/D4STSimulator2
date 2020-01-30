import { ISkillAffixDetail } from './ISkillAffixDetail';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';

export class SkillAffixDetail implements ISkillAffixDetail {
    AffixMetadata:[];
    Level: number;
    ProcChance: number;
    ProcAmount: number;
    PowerType: number;
    Duration: number;
    SelectedAffix: string;
    Description: string;
    ProcsOnDeath: boolean;
    Stackable: boolean;
    IsBuff: boolean;

    constructor(data:ISkillAffixDetail = null, power:number = 0) {
        if (data) {
            this.AffixMetadata = data.AffixMetadata || [];
            this.Level = data.Level || 0;
            this.ProcChance = data.ProcChance || 0;
            this.ProcAmount = data.ProcAmount || 0;
            this.PowerType = data.PowerType || null;
            this.Duration = data.Duration || 0;
            this.SelectedAffix = data.SelectedAffix || "";
            this.Description = data.Description || "";
            this.ProcsOnDeath = data.ProcsOnDeath || false;
            this.Stackable = data.Stackable || false;
            this.IsBuff = data.IsBuff || false;
        }
        if (power != 0) {
            this.Description = CalculationsHelper.GetSkillAffixDescription(this, this.AffixMetadata || [], power);
        }
    }
}
