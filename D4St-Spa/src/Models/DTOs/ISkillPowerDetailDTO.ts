import { ISkillAffixDetail } from './ISkillAffixDetail';

export interface ISkillPowerDetailDTO {
  powerData: ISkillAffixDetail;
  powerUp: ISkillAffixDetail;
  affixMetadata: number[];
}
