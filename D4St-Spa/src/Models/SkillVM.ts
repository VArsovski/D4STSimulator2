import { ISkillDTO } from './DTOs/ISkillDTO';
import { ISkillDetailDTO } from './DTOs/ISkillDetailDTO';
import { SkillDetailVM } from './SkillDetailVM';
import { ISkillPowerDetailDTO } from './DTOs/ISkillPowerDetailDTO';
import { PowerDetailVM } from './DTOs/PowerDetailVM';

export class SkillVM implements ISkillDTO {
    id: number;
    name: string;
    level: number;
    tier: number;
    skillData: ISkillDetailDTO;
    powerData: ISkillPowerDetailDTO;

    constructor(id:number=0, name:string=null, level:number=0, tier:number=0, sd:ISkillDetailDTO=null, pd: ISkillPowerDetailDTO = null) {
        this.skillData = sd || new SkillDetailVM();
        this.powerData = pd || new PowerDetailVM();

        if (id)
            this.id = id;
        if (name)
            this.name = name;
        if (level)
            this.level = level;
        if (tier)
            this.tier = tier;
    }
}
