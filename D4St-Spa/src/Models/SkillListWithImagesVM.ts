import { SkillWithImageVM } from './SkillWithImageVM';
import { SkillListVM } from './SkillListVM';
import { SkillDTO } from './DTOs/SkillDTO';
import { SkillWithImageDTO } from './DTOs/SkillWithImageDTO';

export class SkillListWithImagesVM {
    tier: number;
    tierName: string;
    selectedSkill: SkillWithImageVM;
    skills: SkillWithImageVM[];

    constructor(data: SkillListVM) {
        this.skills = new Array<SkillWithImageVM>();

        if (data)
        {
            this.tier = data.tier;
            this.tierName = data.tierName;
            data.skills.forEach(element => {
                var vm = new SkillWithImageVM(null, null, element);
                this.skills.push(vm);
            });
            this.selectedSkill = this.skills[0];
        }
        else this.selectedSkill = new SkillWithImageVM(new SkillWithImageDTO());
    }
}
