import { IItemAffix } from '../ItemAffixes/IItemAffix';
import { IItemAffixStats } from '../ItemAffixes/Details/IItemAffixStats';

export interface IEquippableAffixStat {
    // getZeroStats<T>(src:T): (src:T) => T;
    EquippableStatData: IItemAffixStats;
    getZeroStats:(src:any) => any;
    updateEquippedStats: (src:any, affix:IItemAffix) => any;
}
