import { ISkillDetailDTO } from './DTOs/ISkillDetailDTO';

export class SkillDetailDTO implements ISkillDetailDTO {
    from: number;
    to: number;
    cd: number;
    cost: number;
    charges: number;

    constructor() {
        // Prevent Undefined, hard to find after
        this.from = 0;
        this.to = 0;
        this.cd = 0;
        this.cost = 0;
        this.charges = 0;
    }
}
