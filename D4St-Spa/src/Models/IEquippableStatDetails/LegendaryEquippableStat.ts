import { IEquippableAffixStat } from './IEquippableAffixStat';
import { IItemAffix } from '../ItemAffixes/IItemAffix';
import { IItemAffixStats } from '../ItemAffixes/Details/IItemAffixStats';

export class LegendaryEquippableStat implements IEquippableAffixStat {
    EquippableStatData: IItemAffixStats;
    getZeroStats: (src: any) => any;
    updateEquippedStats: (src: any, affix: IItemAffix) => any;
}
