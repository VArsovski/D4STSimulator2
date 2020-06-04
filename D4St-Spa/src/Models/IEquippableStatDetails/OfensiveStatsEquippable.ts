import { IItemAffix } from '../ItemAffixes/IItemAffix';
import { ItemOfensiveStatsDetail, ItemOfensiveStats } from '../ItemAffixes/Details/ItemOfensiveStats';
import { IEquippableAffixStat } from './IEquippableAffixStat';

export class OfensiveStatsEquippable implements IEquippableAffixStat {
    SelectedStat: string;
    SelectedEquipStat: string;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;
    getZeroStats: (src: any) => any;

    private calculatePowerStats(src:any, affix:IItemAffix):IItemAffix {
        var selectedOfensiveStat = (src as ItemOfensiveStats).EquippableStatData.OutputMeta.SelectedStat;
        var amount = affix.Contents.AffixData[selectedOfensiveStat].Amount;
        var percentage = affix.Contents.AffixData[selectedOfensiveStat].Percentage;
        src["Amount"] += amount;
        src["Percentage"] += percentage;
        return src;
    }

    constructor(selectedStat:string, selectedEquipStat:string) {
        this.SelectedStat = selectedStat;
        this.SelectedEquipStat = selectedEquipStat;
        this.updateEquippedStats = this.calculatePowerStats;
        this.getZeroStats = (src) => { (src as ItemOfensiveStatsDetail).Amount = 0; return src; }
    }
    EquippableStatData: import("../ItemAffixes/Details/IItemAffixStats").IItemAffixStats;
}
