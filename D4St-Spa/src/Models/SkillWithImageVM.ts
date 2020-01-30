import { ISkillWithImageDTO } from './DTOs/ISkillWithImageDTO';
import { ISkillDetailDTO } from './DTOs/ISkillDetailDTO';
import { SafeUrl, SafeStyle } from '@angular/platform-browser';
import { SkillDetailVM } from './SkillDetailVM';
import { Helpers } from 'src/_Helpers/helpers';
import { SkillVM } from './SkillVM';
import { ISkillPowerDetailDTO } from './DTOs/ISkillPowerDetailDTO';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';

export class SkillWithImageVM implements ISkillWithImageDTO {
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

    constructor(dataFromItf: ISkillWithImageDTO = null, data:SkillVM = null, nameOpt: string = "", levelOpt: number = 1) {
        if (dataFromItf)
        {
            this.id = dataFromItf.id;
            this.name = dataFromItf.name;
            this.level = dataFromItf.level;
            this.tier = dataFromItf.tier;
            this.skillData = dataFromItf.skillData;
            this.angelicAffix = dataFromItf.angelicAffix;
            this.demonicAffix = dataFromItf.demonicAffix;
            this.ancestralAffix = dataFromItf.ancestralAffix;
            this.imageUrl = dataFromItf.imageUrl;
            this.imageStyle = dataFromItf.imageStyle;
            this.generatedByGen = dataFromItf.generatedByGen;
        }
        else if (data)
        {
            this.id = data.id;
            this.name = data.name;
            this.level = data.level;
            this.tier = data.tier;
            this.skillData = data.skillData;
            this.generatedByGen = data.generatedByGen;
        }
        else {
            this.skillData = new SkillDetailVM();
            this.name = nameOpt;
            this.level = levelOpt;
        }
        // var pd = (new SkillVM()).powerData;
        if (data || dataFromItf) {
            var pd = data || dataFromItf || new SkillVM();
            if (pd.angelicAffix) pd.angelicAffix.powerData.Description = CalculationsHelper.GetSkillAffixDescription(pd.angelicAffix.powerData, pd.affixMetadata || [], 1);
            if (pd.demonicAffix) pd.demonicAffix.powerData.Description = CalculationsHelper.GetSkillAffixDescription(pd.demonicAffix.powerData, pd.affixMetadata || [], 2);
            if (pd.ancestralAffix) pd.ancestralAffix.powerData.Description = CalculationsHelper.GetSkillAffixDescription(pd.ancestralAffix.powerData, pd.affixMetadata || [], 3);
            if (pd.angelicAffix) pd.angelicAffix.powerUp.Description = CalculationsHelper.GetSkillAffixDescription(pd.angelicAffix.powerUp, pd.affixMetadata || [], 1);
            if (pd.demonicAffix) pd.demonicAffix.powerUp.Description = CalculationsHelper.GetSkillAffixDescription(pd.demonicAffix.powerUp, pd.affixMetadata || [], 2);
            if (pd.ancestralAffix) pd.ancestralAffix.powerUp.Description = CalculationsHelper.GetSkillAffixDescription(pd.ancestralAffix.powerUp, pd.affixMetadata || [], 3);
            this.angelicAffix = pd.angelicAffix;
            this.demonicAffix = pd.demonicAffix;
            this.ancestralAffix = pd.ancestralAffix;
        }

        var rand = Helpers.getRandom(1, 29);
        var imageSrc = "_Resources/img/icons/ph-" + rand + ".png"; //"../_Resources/img/placeholders/ph-" + rand + ".png";
        this.imageUrl = imageSrc;

        // Use this property to show in dropdown
        this.imageStyle = "background-image: url('" + imageSrc + "')";
    }
}
