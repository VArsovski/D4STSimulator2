import { ISkillPowerDetailDTO } from './ISkillPowerDetailDTO';
import { ISkillAffixDetail } from './ISkillAffixDetail';
import { SkillPowerDetailDTO } from './SkillPowerDetailDTO';
import { SkillAffixDetail } from './SkillAffixDetail';

export class PowerDetailVM implements ISkillPowerDetailDTO {
    description: string;
    powerData: ISkillAffixDetail;
    powerUp: ISkillAffixDetail;
    affixMetadata: number[];
    GeneratedByGen: number;

    constructor(pd:ISkillAffixDetail = null, pu: ISkillAffixDetail = null, am: number[]) {
        this.powerData = pd || new SkillAffixDetail();
        this.powerUp = pu || new SkillAffixDetail();
    }
}
