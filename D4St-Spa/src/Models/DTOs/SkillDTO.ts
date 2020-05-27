import { ISkillDTO } from './ISkillDTO';
import { ISkillPowerDataDTO } from './ISkillPowerDataDTO';
import { SkillPowerDetailDTO } from './SkillPowerDetailDTO';
import { ISkillDamageDataDTO } from './ISkillDamageDataDTO';
import { SkillDamageDataDTO } from './SkillDamageDataDTO';

export class SkillDTO implements ISkillDTO {
    id: number;
    name: string;
    description:string;
    level: number;
    tier: number;
    skillData: ISkillDamageDataDTO;
    angelicAffix: ISkillPowerDataDTO;
    demonicAffix: ISkillPowerDataDTO;
    ancestralAffix: ISkillPowerDataDTO;
    affixMetadata: number[];
    generatedByGen: number;
    castTypes: number[];
    damageTypes: number[];
    skillCategoryMetadata:number[];

    constructor(sd:ISkillDamageDataDTO = null, aa:ISkillPowerDataDTO = null, da:ISkillPowerDataDTO = null, ca:ISkillPowerDataDTO = null, md:Array<number> = null) {
        this.skillData = sd || new SkillDamageDataDTO();
        this.angelicAffix = aa || new SkillPowerDetailDTO();
        this.demonicAffix = da || new SkillPowerDetailDTO();
        this.ancestralAffix = ca || new SkillPowerDetailDTO();
        this.affixMetadata = md || new Array<number>();
    }
}
