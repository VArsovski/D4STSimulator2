import { ISkillWithImageDTO } from './DTOs/ISkillWithImageDTO';
import { Helpers } from 'src/_Helpers/helpers';
import { SkillVM } from './SkillVM';
import { ISkillDTO } from './DTOs/ISkillDTO';
import { IImageUrl } from './DTOs/IImageUrl';
import { SafeUrl, SafeStyle } from '@angular/platform-browser';
import { SkillWithImageDTO } from './DTOs/SkillWithImageDTO';
import { ISkillPowerDataDTO } from './DTOs/ISkillPowerDataDTO';

export class SkillWithImageVM extends SkillVM implements IImageUrl {
    imageUrl: SafeUrl;
    imageStyle: SafeStyle;
    data: ISkillDTO;
    id: number;
    name: string;
    description:string;
    level: number;
    tier: number;

    skillWithImgData: ISkillWithImageDTO;

    constructor(sd: ISkillWithImageDTO = null, data:SkillVM = null, imageUrl:SafeUrl = null, imageStyle:SafeUrl = null) {
        var supVM = super();
        if (sd)
        {
            this.id = sd.id;
            this.name = sd.name;
            this.level = sd.level;
            this.tier = sd.tier;
            var svm = new SkillVM(sd.skillData.powerData, sd.skillData.powerUp);
            this.data = sd;
            this.imageUrl = imageUrl;
            this.imageStyle = imageStyle;
            this.skillWithImgData = new SkillWithImageDTO(sd);
        }
        else if (data)
        {
            this.id = data.id;
            this.name = data.name;
            this.level = data.level;
            this.tier = data.tier;
            this.data = data.data;
            this.imageUrl = imageUrl;
            this.imageStyle = imageStyle;
            this.skillWithImgData = new SkillWithImageDTO(null, data.data);
        }
        else {
            var svm = new SkillVM();
            this.data = svm.data;
            this.imageUrl = imageUrl;
            this.imageStyle = imageStyle;
            // this.name = nameOpt;
            // this.level = levelOpt;
        }
        
        if (!this.imageUrl) {
            var rand = Helpers.getRandom(1, 29);
            var imageSrc = "_Resources/img/icons/ph-" + rand + ".png"; //"../_Resources/img/placeholders/ph-" + rand + ".png";
            this.imageUrl = imageSrc;
    
            // Use this property to show in dropdown
            this.imageStyle = "background-image: url('" + imageSrc + "')";
        }
    }

    // TODO: See if somehow possible to use the other method from SkillVM
    getAffixPowerData(pd: ISkillPowerDataDTO, powerType: number): ISkillPowerDataDTO {
        return super.getAffixPowerData(pd, powerType);
    }
}
