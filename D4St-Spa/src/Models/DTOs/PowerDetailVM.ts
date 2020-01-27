import { ISkillPowerDetailDTO } from './ISkillPowerDetailDTO';
import { ISkillAffixDetail } from './ISkillAffixDetail';

export class PowerDetailVM implements ISkillPowerDetailDTO {
    skillAffixDescription: string;    skillMetadata: string[];
    angelicAffix: ISkillAffixDetail;
    demonicAffix: ISkillAffixDetail;
    ancestralAffix: ISkillAffixDetail;
}
