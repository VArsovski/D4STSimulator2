import { ISkillDTO } from './DTOs/ISkillDTO';
import { ISkillDetailDTO } from './DTOs/ISkillDetailDTO';
import { SkillDetailVM } from './SkillDetailVM';
import { ISkillPowerDetailDTO } from './DTOs/ISkillPowerDetailDTO';
import { PowerDetailVM } from './DTOs/PowerDetailVM';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { SkillAffixDetail } from './DTOs/SkillAffixDetail';

export class SkillVM implements ISkillDTO {
    id: number;
    name: string;
    level: number;
    tier: number;
    skillData: ISkillDetailDTO;
    angelicAffix: ISkillPowerDetailDTO;
    demonicAffix: ISkillPowerDetailDTO;
    ancestralAffix: ISkillPowerDetailDTO;
    affixMetadata: number[];
    generatedByGen: number;


    constructor(id:number=0, name:string=null, level:number=0, tier:number=0, sd:ISkillDetailDTO=null, pd: ISkillPowerDetailDTO = null, powerType: number = 0) {
        this.skillData = sd || new SkillDetailVM();
        // this.angelicAffix = pd || new PowerDetailVM(pd.powerData || new SkillAffixDetail(1), pd.powerUp || new SkillAffixDetail(1), pd.affixMetadata || []);
        // this.demonicAffix = pd || new PowerDetailVM(pd.powerData || new SkillAffixDetail(2), pd.powerUp || new SkillAffixDetail(2), pd.affixMetadata || []);
        // this.ancestralAffix = pd || new PowerDetailVM(pd.powerData || new SkillAffixDetail(3), pd.powerUp || new SkillAffixDetail(3), pd.affixMetadata || []);

        if (id)
            this.id = id;
        if (name)
            this.name = name;
        if (level)
            this.level = level;
        if (tier)
            this.tier = tier;
        
        if (pd) {
            if (pd.powerData) pd.powerData.Description = CalculationsHelper.GetSkillAffixDescription(pd.powerData, pd.affixMetadata, 1);
            if (pd.powerData) pd.powerData.Description = CalculationsHelper.GetSkillAffixDescription(pd.powerData, pd.affixMetadata, 2);
            if (pd.powerData) pd.powerData.Description = CalculationsHelper.GetSkillAffixDescription(pd.powerData, pd.affixMetadata, 3);
            if (pd.powerUp) pd.powerUp.Description = CalculationsHelper.GetSkillAffixDescription(pd.powerUp, pd.affixMetadata, 1);
            if (pd.powerUp) pd.powerUp.Description = CalculationsHelper.GetSkillAffixDescription(pd.powerUp, pd.affixMetadata, 2);
            if (pd.powerUp) pd.powerUp.Description = CalculationsHelper.GetSkillAffixDescription(pd.powerUp, pd.affixMetadata, 3);
            this.angelicAffix = pd;
            this.demonicAffix = pd;
            this.ancestralAffix = pd;
        }
    }
}
