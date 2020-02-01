import { ISkillDTO } from './ISkillDTO';
import { ISkillDetailDTO } from './ISkillDetailDTO';
import { ISkillPowerDetailDTO } from './ISkillPowerDetailDTO';
import { SkillPowerDetailDTO } from './SkillPowerDetailDTO';
import { SkillDetailDTO } from '../SkillDetailDTO';

export class SkillDTO implements ISkillDTO {
    id: number;
    name: string;
    level: number;
    tier: number;
    skillData: ISkillDetailDTO;
    angelicAffix: ISkillPowerDetailDTO;
    demonicAffix: ISkillPowerDetailDTO;
    ancestralAffix: ISkillPowerDetailDTO;
    affixMetadata: number[];
    generatedByGen: number;

    constructor(sd: SkillDetailDTO = null, aa: SkillPowerDetailDTO = null, da: SkillPowerDetailDTO = null, ca: SkillPowerDetailDTO = null) {
        this.skillData = new SkillDetailDTO();
        this.angelicAffix = new SkillPowerDetailDTO();
        this.demonicAffix = new SkillPowerDetailDTO();
        this.ancestralAffix = new SkillPowerDetailDTO();
        this.affixMetadata = new Array<number>();
    }
}
