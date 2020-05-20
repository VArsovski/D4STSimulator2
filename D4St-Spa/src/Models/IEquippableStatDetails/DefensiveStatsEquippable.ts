import { IItemAffix } from '../ItemAffixes/IItemAffix';
import { ItemDefensiveStatsDetail, ItemDefenseStats } from '../ItemAffixes/Details/ItemDefensiveStats';

export class DefensiveStatsEquippable {
    SelectedStat: string;
    SelectedEquipStat: string;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;
    getZeroStats: (src: any) => any;

    private calculatePowerStats(src:any, affix:IItemAffix):IItemAffix {
        var selectedOfensiveStat = (src as ItemDefenseStats).EquippableStatData.OutputMeta.SelectedStat;
        var amount = affix.Contents.AffixData[selectedOfensiveStat].Amount;
        var percentage = affix.Contents.AffixData[selectedOfensiveStat].Percentage;
        src["Amount"] += amount;
        src["Percentage"] += amount;
        return src;
    }

    constructor(selectedStat:string, selectedEquipStat:string) {
        this.SelectedStat = selectedStat;
        this.SelectedEquipStat = selectedEquipStat;
        this.updateEquippedStats = this.calculatePowerStats;
        this.getZeroStats = (src) => { (src as ItemDefensiveStatsDetail).Amount = 0; return src; }
    }
}
