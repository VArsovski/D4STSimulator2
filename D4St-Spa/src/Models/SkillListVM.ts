import { SkillVM } from './SkillVM';

export class SkillListVM {

    constructor() {
        this.skills = new Array<SkillVM>();
        this.selectedSkill = new SkillVM();
    }
    
    tier: number;
    tierName: string;
    selectedSkill: SkillVM;
    skills: SkillVM[];
}
