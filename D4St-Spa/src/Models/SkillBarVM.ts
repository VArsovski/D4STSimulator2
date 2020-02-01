import { ISkillBarDTO } from './DTOs/ISkillBarDTO';
import { ISkillWithImageDTO } from './DTOs/ISkillWithImageDTO';
import { SkillWithImageVM } from './SkillWithImageVM';
import { SkillVM } from './SkillVM';

export class SkillBarVM implements ISkillBarDTO {
    positionSelected: number;
    skill1: ISkillWithImageDTO;
    skill2: ISkillWithImageDTO;
    skill3: ISkillWithImageDTO;
    skill4: ISkillWithImageDTO;
    skill5: ISkillWithImageDTO;
    skill6: ISkillWithImageDTO;
    skill7: ISkillWithImageDTO;
    skill8: ISkillWithImageDTO;
    constructor() {
        this.positionSelected = -1;
        this.skill1 = new SkillWithImageVM(null, new SkillVM()).skillWithImgData;
        this.skill2 = new SkillWithImageVM(null, new SkillVM()).skillWithImgData;
        this.skill3 = new SkillWithImageVM(null, new SkillVM()).skillWithImgData;
        this.skill4 = new SkillWithImageVM(null, new SkillVM()).skillWithImgData;
        this.skill5 = new SkillWithImageVM(null, new SkillVM()).skillWithImgData;
        this.skill6 = new SkillWithImageVM(null, new SkillVM()).skillWithImgData;
        this.skill7 = new SkillWithImageVM(null, new SkillVM()).skillWithImgData;
        this.skill8 = new SkillWithImageVM(null, new SkillVM()).skillWithImgData;
    }
}
