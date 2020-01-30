import { SkillWithImageVM } from './SkillWithImageVM';
import { SkillVM } from './SkillVM';

export class SkillEquipVM {
    skillData: SkillWithImageVM;
    position: number;

    constructor(data: SkillWithImageVM = null, position:number = null) {
        this.skillData = data || new SkillWithImageVM(null, new SkillVM());
        this.position = position || 0;
    }
}
