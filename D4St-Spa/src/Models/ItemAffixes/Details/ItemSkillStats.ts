import { IItemAffixStats } from './IItemAffixStats';
import { AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { SkillVM } from 'src/Models/SkillVM';
import { IEquippableStat } from 'src/Models/InventoryDetailModels/IEquippableStat';
import { IItemAffix } from '../IItemAffix';

export class ItemSkillStats implements IItemAffixStats, IEquippableStat {
    Level: number;
    Amount: number;
    PowerLevel:number
    AffixData: SkillVM;
    CategoryStats: AffixCategoryEnum;
    SelectedStat: string;
    SelectedEquipStat: string;

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
    
    updateEquippedStats: (src: IItemAffix, affix: IItemAffix) => IItemAffix;

    GetDescription(): string {
        return this.AffixData ? "+ " + ((this.AffixData.level + this.PowerLevel) || 1) + " to " + this.AffixData.name + " (" + this.AffixData.className + " only)" : "";
    }
}
