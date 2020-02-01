import { ISkillWithImageDTO } from './ISkillWithImageDTO';
import { ISkillDetailDTO } from './ISkillDetailDTO';
import { ISkillPowerDetailDTO } from './ISkillPowerDetailDTO';
import { SafeUrl, SafeStyle } from '@angular/platform-browser';
import { SkillDTO } from './SkillDTO';

export class SkillWithImageDTO implements ISkillWithImageDTO {
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
    imageUrl: SafeUrl;
    imageStyle: SafeStyle;

    constructor(dataFromItf: ISkillWithImageDTO = null, data: SkillDTO = null) {
        if (dataFromItf)
        {
            this.id = dataFromItf.id;
            this.name = dataFromItf.name;
            this.level = dataFromItf.level;
            this.tier = dataFromItf.tier;
            this.affixMetadata = dataFromItf.affixMetadata;
            this.skillData = dataFromItf.skillData;
            this.angelicAffix = dataFromItf.angelicAffix;
            this.demonicAffix = dataFromItf.demonicAffix;
            this.ancestralAffix = dataFromItf.ancestralAffix;
            this.imageStyle = dataFromItf.imageStyle;
            this.imageUrl = dataFromItf.imageUrl;
        }
        else if (data) {
            this.id = data.id;
            this.name = data.name;
            this.level = data.level;
            this.tier = data.tier;
            this.affixMetadata = data.affixMetadata;
            this.skillData = data.skillData;
            this.angelicAffix = data.angelicAffix;
            this.demonicAffix = data.demonicAffix;
            this.ancestralAffix = data.ancestralAffix;
            // this.imageStyle = data.imageStyle;
            // this.imageUrl = data.imageUrl;
        }
    }
}
