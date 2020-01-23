import { ISkillDetailDTO } from './ISkillDetailDTO';
import { ISkillPowerDetailDTO } from './ISkillPowerDetailDTO';

export interface ISkillDTO {
  id: number;
  name: string;
  level: number;
  tier: number;
  skillData: ISkillDetailDTO;
  powerData: ISkillPowerDetailDTO;
}
