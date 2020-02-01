import { ISkillDamageDataDTO } from './ISkillDamageDataDTO';
import { ISkillDetailDTO } from './ISkillDetailDTO';
import { SkillDetailDTO } from '../SkillDetailDTO';

export class SkillDamageDataDTO implements ISkillDamageDataDTO {
    powerData: ISkillDetailDTO;
    powerUp: ISkillDetailDTO;

    constructor(sd:SkillDetailDTO = null, su:SkillDetailDTO = null) {
        this.powerData = sd || new SkillDetailDTO();
        this.powerUp = su || new SkillDetailDTO();
    }
}
