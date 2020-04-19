import { IItemAffixStats } from './IItemAffixStats';
import { AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { SkillVM } from 'src/Models/SkillVM';

export class ItemSkillStats implements IItemAffixStats {
    Level: number;
    Amount: number;
    PowerLevel:number
    AffixData: SkillVM;
    CategoryStats: AffixCategoryEnum;

    constructor(category:AffixCategoryEnum, affixData:SkillVM, level:number, powerLevel:number) {
        this.Level = level;
        this.CategoryStats = category;
        this.AffixData = affixData;
        this.PowerLevel = powerLevel;

        if (this.AffixData) {
            if (this.AffixData.level > this.Level / (this.AffixData.tier * 3)) {
                this.AffixData.level = Math.round(this.AffixData.tier * 3);
            }
        }
    }

    GetDescription(): string {
        return this.AffixData ? "+ " + ((this.AffixData.level + this.PowerLevel) || 1) + " to " + this.AffixData.name + " (" + this.AffixData.className + " only)" : "";
    }
}
