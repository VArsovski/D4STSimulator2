import { IEquippableAffixStat } from './IEquippableAffixStat';
import { IItemAffixStats } from '../ItemAffixes/Details/IItemAffixStats';
import { IItemAffix } from '../ItemAffixes/IItemAffix';

export class CCEffectTypesEquippable implements IEquippableAffixStat {
    EquippableStatData: IItemAffixStats;
    getZeroStats: (src: any) => any;
    updateEquippedStats: (src: any, affix: IItemAffix) => any;

    private calculateCCEffectsStats(src:any, affix:IItemAffix):any {
        var combinedStat = src;
        var selectedStatData = affix.Contents.AffixData.EquippableStatData.OutputMeta;
        var selectedStat = selectedStatData["SelectedStat"];
        // var selectedSubStat = selectedStatData["SelectedEquipStat"];
        var amount = affix.Contents.AffixData[selectedStat].Amount;
        combinedStat["ReducePercentage"] += amount;

        return combinedStat;
    }

    constructor() {
        this.updateEquippedStats = this.calculateCCEffectsStats;
    }
}
