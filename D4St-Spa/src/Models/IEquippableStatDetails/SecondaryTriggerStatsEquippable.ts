import { IEquippableAffixStat } from './IEquippableAffixStat';
import { IItemAffixStats } from '../ItemAffixes/Details/IItemAffixStats';
import { IItemAffix } from '../ItemAffixes/IItemAffix';

export class SecondaryTriggerStatsEquippable implements IEquippableAffixStat {
    EquippableStatData: IItemAffixStats;
    getZeroStats: (src: any) => any;
    updateEquippedStats: (src: any, affix: IItemAffix) => any;
}
