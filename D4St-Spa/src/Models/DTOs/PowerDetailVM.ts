import { ISkillPowerDetailDTO } from './ISkillPowerDetailDTO';
import { ISkillAffixDetail } from './ISkillAffixDetail';

export class PowerDetailVM implements ISkillPowerDetailDTO {
    skillAffixDescription: string;
    angelicAffix: ISkillAffixDetail;
    demonicAffix: ISkillAffixDetail;
    ancestralAffix: ISkillAffixDetail;
}
