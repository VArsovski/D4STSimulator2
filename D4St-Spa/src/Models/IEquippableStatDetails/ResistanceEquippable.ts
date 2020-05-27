import { IItemAffix } from '../ItemAffixes/IItemAffix';
import { InventoryResistanceModel } from '../InventoryModels/InventoryDamageModel';
import { IEquippableAffixStat } from './IEquippableAffixStat';
import { IItemAffixStats } from '../ItemAffixes/Details/IItemAffixStats';
import { Helpers } from 'src/_Helpers/helpers';
import { ResistanceTypesEnum } from 'src/_Enums/itemAffixEnums';

export class ResistanceEquippable implements IEquippableAffixStat {
    SelectedStat: string;
    SelectedEquipStat: string;
    EquippableStatData: IItemAffixStats;
    getZeroStats: (src: any) => any;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    constructor() {
        this.updateEquippedStats = this.calculateResistanceStats;
        this.getZeroStats = (src:any) => { (src as InventoryResistanceModel).Percentage = 0; return src; }
    }

    private calculateResistanceStats(src:IItemAffix, affix:IItemAffix):IItemAffix {
        var combinedStat = src;
        var selectedStat = affix.Contents.AffixData.EquippableStatData.OutputMeta.SelectedStat;
        var selectedSubStat = affix.Contents.AffixData.EquippableStatData.OutputMeta.SelectedEquipStat;
        var amount = affix.Contents.AffixData[selectedStat].Amount;

        // Make sure the word ends with Resistance even if only the type is present
        selectedSubStat = selectedSubStat.replace("Resistance", "") + "Resistance";
        if (selectedSubStat != "AllResistance")
            combinedStat[selectedSubStat]["Percentage"] += amount;
        else
        {
            [1,2,3,4,5].forEach(r => {
                selectedSubStat = Helpers.getPropertyByValue(ResistanceTypesEnum, r) + "Resistance";
                combinedStat[selectedSubStat]["Percentage"] += amount;
            })
        }
        return combinedStat;
    }
}
