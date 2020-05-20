import { IItemAffix } from '../ItemAffixes/IItemAffix';
import { InventoryResistanceModel } from '../InventoryModels/InventoryDamageModel';
import { IEquippableAffixStat } from './IEquippableAffixStat';
import { IItemAffixStats } from '../ItemAffixes/Details/IItemAffixStats';

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
        var selectedStat = affix.Contents.AffixData.OutputMeta.SelectedStat;
        var amount = affix.Contents.AffixData[selectedStat].Amount;
        combinedStat["Percentage"] += amount;
        return combinedStat;
    }
}
