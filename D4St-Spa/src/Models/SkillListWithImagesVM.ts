import { SkillWithImageVM } from './SkillWithImageVM';
import { SkillListVM } from './SkillListVM';

export class SkillListWithImagesVM {
    tier: number;
    tierName: string;
    selectedSkill: SkillWithImageVM;
    skills: SkillWithImageVM[];

    constructor(data: SkillListVM, name:string = "" as string, level:number = 1 as number) {
        this.skills = new Array<SkillWithImageVM>();

        if (data)
        {
            this.tier = data.tier;
            this.tierName = data.tierName;
            data.skills.forEach(element => {
                this.skills.push(new SkillWithImageVM(element));
            });
            this.selectedSkill = new SkillWithImageVM(data.selectedSkill);
        }
        else this.selectedSkill = new SkillWithImageVM(null);
    }
}
