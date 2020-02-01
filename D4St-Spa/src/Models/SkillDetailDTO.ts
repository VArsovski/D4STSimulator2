import { ISkillDetailDTO } from './DTOs/ISkillDetailDTO';

export class SkillDetailDTO implements ISkillDetailDTO {
    from: number;
    to: number;
    cd: number;
    cost: number;
    charges: number;

    constructor(data:ISkillDetailDTO = null) {
        // Prevent Undefined, hard to find after
        this.from = (data || {from:0}).from;
        this.to =  (data || {to:0}).to;
        this.cd =  (data || {cd:0}).cd;
        this.cost =  (data || {cost:0}).cost;
        this.charges =  (data || {charges:1}).charges;
    }
}
