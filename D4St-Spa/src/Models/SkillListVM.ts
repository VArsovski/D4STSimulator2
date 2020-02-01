import { SkillVM } from './SkillVM';
import { SkillWithImageVM } from './SkillWithImageVM';

export class SkillListVM {

    constructor() {
        this.skills = new Array<SkillVM>();
        this.selectedSkill = new SkillWithImageVM();
        this.selectedSkillLvlUp = new SkillWithImageVM();
    }
    
    tier: number;
    tierName: string;
    selectedSkill: SkillWithImageVM;
    selectedSkillLvlUp: SkillWithImageVM;
    skills: SkillVM[];
}
