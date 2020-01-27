import { ISkillWithImageDTO } from './DTOs/ISkillWithImageDTO';
import { ISkillDetailDTO } from './DTOs/ISkillDetailDTO';
import { SafeUrl, SafeStyle } from '@angular/platform-browser';
import { SkillDetailVM } from './SkillDetailVM';
import { Helpers } from 'src/_Helpers/helpers';
import { SkillVM } from './SkillVM';
import { ISkillPowerDetailDTO } from './DTOs/ISkillPowerDetailDTO';
import { SkillEnums } from 'src/_Enums/skillEnums';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';

export class SkillWithImageVM implements ISkillWithImageDTO {
    id: number;
    name: string;
    level: number;
    tier: number;
    skillData: ISkillDetailDTO;
    imageUrl: SafeUrl;
    imageStyle: SafeStyle;
    powerData: ISkillPowerDetailDTO;

    constructor(dataFromItf: ISkillWithImageDTO);
    constructor(data:SkillVM);
    constructor(dataFromItf: ISkillWithImageDTO = null, data:SkillVM = null, nameOpt: string = "", levelOpt: number = 1) {
        if (dataFromItf)
        {
            this.id = dataFromItf.id;
            this.name = dataFromItf.name;
            this.level = dataFromItf.level;
            this.tier = dataFromItf.tier;
            this.skillData = dataFromItf.skillData;
            this.powerData = dataFromItf.powerData;
            this.imageUrl = dataFromItf.imageUrl;
            this.imageStyle = dataFromItf.imageStyle;
        }
        else if (data)
        {
            this.id = data.id;
            this.name = data.name;
            this.level = data.level;
            this.tier = data.tier;
            this.skillData = data.skillData;
        }
        else {
            this.skillData = new SkillDetailVM();
            this.name = nameOpt;
            this.level = levelOpt;
        }
        var pd = (dataFromItf || data || new SkillVM()).powerData;
        if (pd) {
            this.powerData = pd;
            if (pd.angelicAffix) pd.angelicAffix.Description = CalculationsHelper.GetSkillAffixDescription(pd, 1);
            if (pd.demonicAffix) pd.demonicAffix.Description = CalculationsHelper.GetSkillAffixDescription(pd, 2);
            if (pd.ancestralAffix) pd.ancestralAffix.Description = CalculationsHelper.GetSkillAffixDescription(pd, 3);
            this.powerData = pd;
        }

        var rand = Helpers.getRandom(1, 29);
        var imageSrc = "_Resources/img/icons/ph-" + rand + ".png"; //"../_Resources/img/placeholders/ph-" + rand + ".png";
        this.imageUrl = imageSrc;

        // Use this property to show in dropdown
        this.imageStyle = "background-image: url('" + imageSrc + "')";
    }
}
