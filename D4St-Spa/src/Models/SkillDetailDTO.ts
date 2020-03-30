import { ISkillDetailDTO } from './DTOs/ISkillDetailDTO';

export class SkillDetailDTO implements ISkillDetailDTO {
    from: number;
    to: number;
    cd: number;
    cost: number;
    charges: number;

    constructor(data:ISkillDetailDTO = null, from?:number, to?:number, cd?:number, cost?:number, charges?:number) {
        // Prevent Undefined, hard to find after
        if (data)
        {
            this.from = data.from;
            this.to =  data.to;
            this.cd =  data.cd;
            this.cost =  data.cost;
            this.charges =  data.charges;
        }
        else
        {
            this.from = from;
            this.to = to;
            this.cd = cd;
            this.cost = cost;
            this.charges = charges;
        }
    }
}
