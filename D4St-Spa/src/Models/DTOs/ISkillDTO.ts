import { ISkillDetailDTO } from './ISkillDetailDTO';
import { ISkillPowerDetailDTO } from './ISkillPowerDetailDTO';

export interface ISkillDTO {
  id: number;
  name: string;
  level: number;
  tier: number;
  skillData: ISkillDetailDTO;
  angelicAffix: ISkillPowerDetailDTO;
  demonicAffix: ISkillPowerDetailDTO;
  ancestralAffix: ISkillPowerDetailDTO;
  affixMetadata: number[];
  generatedByGen: number;
}
