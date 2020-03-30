import { ISkillDTO } from './DTOs/ISkillDTO';
import { ISkillDetailDTO } from './DTOs/ISkillDetailDTO';
import { SkillDetailDTO } from './SkillDetailDTO';
import { ISkillPowerDataDTO } from './DTOs/ISkillPowerDataDTO';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { SkillDTO } from './DTOs/SkillDTO';
import { SkillPowerDetailDTO } from './DTOs/SkillPowerDetailDTO';
import { SkillDamageDataDTO } from './DTOs/SkillDamageDataDTO';

export class SkillVM {
    classId: number;
    className:string;
    id: number;
    name: string;
    level: number;
    tier: number;
    data: ISkillDTO;

    constructor(sd:ISkillDetailDTO=null, su:ISkillDetailDTO=null, aa:ISkillPowerDataDTO = null, da:ISkillPowerDataDTO = null, ca:ISkillPowerDataDTO = null, id:number=0, name:string=null, level:number=0, tier:number=0) {
        if (sd != null && su != null) {
            var sdad = new SkillDamageDataDTO(sd, su);
            this.data = new SkillDTO(sdad, aa, da, ca);
        }
        else this.data = new SkillDTO();
        
        this.data.skillData.powerData = sd || new SkillDetailDTO();
        this.data.skillData.powerUp = su || new SkillDetailDTO();
        if (id)
            this.id = id;
        if (name)
            this.name = name;
        if (level)
            this.level = level;
        if (tier)
            this.tier = tier;

        if (aa) this.data.angelicAffix = this.getAffixPowerData(aa, 1);
        if (da) this.data.demonicAffix = this.getAffixPowerData(da, 2);
        if (ca) this.data.ancestralAffix = this.getAffixPowerData(ca, 3);
    }

    setClassDetails(classId:number, className:string) {
        this.classId = classId;
        this.className = className;
    }

    getAffixPowerData(pd:ISkillPowerDataDTO, powerType: number): ISkillPowerDataDTO {
        var powerData = new SkillPowerDetailDTO(pd.powerData, pd.powerUp, pd.affixMetadata);
        pd.powerData.Description = CalculationsHelper.GetSkillAffixDescription(pd.powerData, pd.affixMetadata, powerType);
        return powerData;
    }
}
