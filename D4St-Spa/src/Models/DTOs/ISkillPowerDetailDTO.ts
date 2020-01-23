import { ISkillAffixDetail } from './ISkillAffixDetail';

export interface ISkillPowerDetailDTO {
  skillAffixDescription: string;
  angelicAffix: ISkillAffixDetail;
  demonicAffix: ISkillAffixDetail;
  ancestralAffix: ISkillAffixDetail;
}
