import { ISkillWithImageDTO } from './DTOs/ISkillWithImageDTO';
import { ISkillDetailDTO } from './DTOs/ISkillDetailDTO';
import { SafeUrl, SafeStyle } from '@angular/platform-browser';
import { SkillDetailVM } from './SkillDetailVM';
import { Helpers } from 'src/_Helpers/helpers';
import { SkillVM } from './SkillVM';
import { ISkillPowerDetailDTO } from './DTOs/ISkillPowerDetailDTO';
import { IImageUrl } from './DTOs/IImageUrl';

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
            this.powerData = data.powerData;
        }
        else {
            this.skillData = new SkillDetailVM();
            this.name = nameOpt;
            this.level = levelOpt;
        }
        
        // if (imgData)
        // {
        //     this.imageUrl = imgData.imageUrl;
        //     this.imageStyle = imgData.imageStyle;
        // }
        // else
        // {
            var rand = Helpers.getRandom(1, 24);
            var imageSrc = "_Resources/img/icons/ph-" + rand + ".png"; //"../_Resources/img/placeholders/ph-" + rand + ".png";
            this.imageUrl = imageSrc;
    
            // Use this property to show in dropdown
            this.imageStyle = "background-image: url('" + imageSrc + "')";
        // }
    }
}
