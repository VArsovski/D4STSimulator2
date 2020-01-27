import { ISkillAffixDetail } from './ISkillAffixDetail';

export interface ISkillPowerDetailDTO {
  skillAffixDescription: string;
  skillMetadata: string[];
  angelicAffix: ISkillAffixDetail;
  demonicAffix: ISkillAffixDetail;
  ancestralAffix: ISkillAffixDetail;
}
