import { ISkillPowerDetailDTO } from './ISkillPowerDetailDTO';
import { ISkillAffixDetail } from './ISkillAffixDetail';
import { SkillAffixDetail } from './SkillAffixDetail';

export class SkillPowerDetailDTO implements ISkillPowerDetailDTO {
    powerData: ISkillAffixDetail;
    powerUp: ISkillAffixDetail;
    affixMetadata: number[];

    constructor(pd:ISkillAffixDetail = null, pu:ISkillAffixDetail = null, am: number[] = null) {
        this.powerData = pd || new SkillAffixDetail();
        this.powerUp = pu || new SkillAffixDetail();
        this.affixMetadata = am || [];
    }
}
