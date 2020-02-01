import { ISkillAffixDetail } from './ISkillAffixDetail';

export interface ISkillPowerDataDTO {
  powerData: ISkillAffixDetail;
  powerUp: ISkillAffixDetail;
  affixMetadata: number[];
}
