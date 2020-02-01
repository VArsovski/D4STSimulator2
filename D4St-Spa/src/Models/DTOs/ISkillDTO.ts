import { ISkillPowerDataDTO } from './ISkillPowerDataDTO';
import { ISkillDamageDataDTO } from './ISkillDamageDataDTO';

export interface ISkillDTO {
  id: number;
  name: string;
  level: number;
  tier: number;
  skillData: ISkillDamageDataDTO;
  angelicAffix: ISkillPowerDataDTO;
  demonicAffix: ISkillPowerDataDTO;
  ancestralAffix: ISkillPowerDataDTO;
  affixMetadata: number[];
  generatedByGen: number;
}
