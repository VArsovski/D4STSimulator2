import { ISkillDetailDTO } from './DTOs/ISkillDetailDTO';

export class SkillDetailVM implements ISkillDetailDTO {
    from: number;    to: number;
    cd: number;
    cost: number;
    charges: number;
}
