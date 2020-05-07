import { IEquippableStat } from 'src/Models/InventoryModels/InventoryDetailModels/IEquippableStat';
import { IItemAffix } from '../ItemAffixes/IItemAffix';

export class ResistanceEquippable implements IEquippableStat {
    SelectedStat: string;
    SelectedEquipStat: string;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    constructor(selectedStat:string, selectedEquipStat:string) {
        this.SelectedStat = selectedStat;
        this.SelectedEquipStat = this.SelectedEquipStat;
        this.updateEquippedStats = this.calculateResistanceStats;
    }

    private calculateResistanceStats(src:IItemAffix, affix:IItemAffix):IItemAffix {
        var combinedStat = src;
        var selectedStat = affix.Contents.AffixData.OutputMeta.SelectedStat;
        var amount = affix.Contents.AffixData[selectedStat].Amount;
        combinedStat["Percentage"] += amount;
        return combinedStat;
    }
}
