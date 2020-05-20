import { IItemAffix } from '../ItemAffixes/IItemAffix';
import { ItemBasicPowersDetail } from '../ItemAffixes/Details/ItemSimpleStats';
import { IEquippableAffixStat } from './IEquippableAffixStat';
import { IItemAffixStats } from '../ItemAffixes/Details/IItemAffixStats';

export class PowerStatEquippable implements IEquippableAffixStat {
    EquippableStatData: IItemAffixStats;
    getZeroStats: (src:any) => any;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    private calculatePowerStats(src:IItemAffix, affix:IItemAffix):IItemAffix {
        var combinedStat = src;
        var amount = affix.Contents.AffixData["PowerStats"].Amount;
        combinedStat["Amount"] += amount;
        return combinedStat;
    }

    constructor() {
        this.updateEquippedStats = this.calculatePowerStats;
        this.getZeroStats = (src) => { (src as ItemBasicPowersDetail).Amount = 0; return src; }
    }
}
