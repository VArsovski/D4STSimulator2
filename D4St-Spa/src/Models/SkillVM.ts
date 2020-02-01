import { ISkillDTO } from './DTOs/ISkillDTO';
import { ISkillDetailDTO } from './DTOs/ISkillDetailDTO';
import { SkillDetailDTO } from './SkillDetailDTO';
import { ISkillPowerDetailDTO } from './DTOs/ISkillPowerDetailDTO';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { SkillDTO } from './DTOs/SkillDTO';
import { SkillPowerDetailDTO } from './DTOs/SkillPowerDetailDTO';

export class SkillVM {
    id: number;
    name: string;
    level: number;
    tier: number;
    skillData: ISkillDTO;
    skillLvlUpData: ISkillDTO;

    constructor(sd:ISkillDetailDTO=null, su:ISkillDetailDTO=null, pd: ISkillDTO = null, pu: ISkillDTO = null, id:number=0, name:string=null, level:number=0, tier:number=0) {
        this.skillData = new SkillDTO();
        this.skillLvlUpData = new SkillDTO();
        this.skillData.skillData = sd || new SkillDetailDTO();
        this.skillLvlUpData.skillData = su || new SkillDetailDTO();
        if (id)
            this.id = id;
        if (name)
            this.name = name;
        if (level)
            this.level = level;
        if (tier)
            this.tier = tier;
        if (pd) {
            this.skillData.angelicAffix = this.getAffixPowerData(pd.angelicAffix, 1);
            this.skillData.demonicAffix = this.getAffixPowerData(pd.angelicAffix, 2);
            this.skillData.ancestralAffix = this.getAffixPowerData(pd.angelicAffix, 3);
        }
        if (pu) {
            this.skillLvlUpData.angelicAffix = this.getAffixPowerData(pd.angelicAffix, 1);
            this.skillLvlUpData.demonicAffix = this.getAffixPowerData(pd.angelicAffix, 2);
            this.skillLvlUpData.ancestralAffix = this.getAffixPowerData(pd.angelicAffix, 3);
        }
    }

    getAffixPowerData(pd:ISkillPowerDetailDTO, powerType: number): ISkillPowerDetailDTO {
        var powerData = new SkillPowerDetailDTO(pd.powerData, pd.powerUp, pd.affixMetadata);
        pd.powerData.Description = CalculationsHelper.GetSkillAffixDescription(pd.powerData, pd.affixMetadata, powerType);
        return powerData;
    }
}
