import { ISkillPowerDataDTO } from './ISkillPowerDataDTO';
import { ISkillDamageDataDTO } from './ISkillDamageDataDTO';
import { CastTypesEnum, DamageTypesEnum } from 'src/_Enums/itemAffixEnums';

export interface ISkillDTO {
  id: number;
  name: string;
  description:string;
  level: number;
  tier: number;
  skillData: ISkillDamageDataDTO;
  castTypes:CastTypesEnum[];
  damageTypes:DamageTypesEnum[];
  affixMetadata: number[];
  skillCategoryMetadata: number[];

  angelicAffix: ISkillPowerDataDTO;
  demonicAffix: ISkillPowerDataDTO;
  ancestralAffix: ISkillPowerDataDTO;
  generatedByGen: number;
}
