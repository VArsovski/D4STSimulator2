import { ISkillPowerDataDTO } from './ISkillPowerDataDTO';
import { ISkillDamageDataDTO } from './ISkillDamageDataDTO';

export interface ISkillDTO {
  id: number;
  name: string;
  level: number;
  tier: number;
  skillData: ISkillDamageDataDTO;
  attackTypes:number[];
  damageTypes:number[];
  affixMetadata: number[];
  skillCategoryMetadata: number[];

  angelicAffix: ISkillPowerDataDTO;
  demonicAffix: ISkillPowerDataDTO;
  ancestralAffix: ISkillPowerDataDTO;
  generatedByGen: number;
}
