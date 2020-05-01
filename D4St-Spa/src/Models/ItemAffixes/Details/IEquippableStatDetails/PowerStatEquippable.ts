import { IEquippableStat, IEquippableInventoryModel } from 'src/Models/InventoryDetailModels/IEquippableStat';
import { IItemAffix } from '../../IItemAffix';

export class PowerStatEquippable implements IEquippableStat {
    SelectedStat: string;
    SelectedEquipStat: string;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    private calculatePowerStats(src:IItemAffix, affix:IItemAffix):IItemAffix {
        var combinedStat = src;
        var amount = affix.Contents.AffixData["PowerStats"].Amount;
        combinedStat["Amount"] += amount;
        return combinedStat;
    }

    constructor(selectedStat:string, selectedEquipStat:string) {
        this.SelectedStat = selectedStat;
        this.SelectedEquipStat = selectedEquipStat;
        this.updateEquippedStats = this.calculatePowerStats;
    }
}
