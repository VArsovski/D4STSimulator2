import { ISkillPowerDataDTO } from './ISkillPowerDataDTO';
import { ISkillAffixDetail } from './ISkillAffixDetail';
import { SkillAffixDetail } from './SkillAffixDetail';

export class PowerDetailVM implements ISkillPowerDataDTO {
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
