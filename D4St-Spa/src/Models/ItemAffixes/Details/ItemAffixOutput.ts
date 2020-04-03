import { AffixCategoryEnum, TriggerStatsEnum, LegendaryStatsEnum } from 'src/_Enums/itemAffixEnums';
import { ItemArmorStats } from './ItemArmorStats';
import { ItemDamageStats } from './ItemDamageStats';
import { ItemBasicStats } from './ItemBasicStats';
import { ItemOfensiveStats } from './ItemOfensiveStats';
import { ItemDefenseStats } from './ItemDefensiveStats';

export class ItemAffixOutput {
    categoryStat?: AffixCategoryEnum;
    armorStat?: ItemArmorStats;
    damageStat?: ItemDamageStats;
    basicStat?: ItemBasicStats;
    ofensiveStat?: ItemOfensiveStats;
    defensiveStat?: ItemDefenseStats;
    triggerStat?: TriggerStatsEnum;
    legendaryStat?: LegendaryStatsEnum;

    constructor(categoryStat?: AffixCategoryEnum,
        armorStat?: ItemArmorStats,
        damageStat?: ItemDamageStats,
        basicStat?: ItemBasicStats,
        ofensiveStat?: ItemOfensiveStats,
        defensiveStat?: ItemDefenseStats,
        triggerStat?: TriggerStatsEnum,
        legendaryStat?: LegendaryStatsEnum) {
        this.categoryStat = categoryStat;
        this.armorStat = armorStat;
        this.damageStat = damageStat;
        this.basicStat = basicStat;
        this.ofensiveStat = ofensiveStat;
        this.defensiveStat = defensiveStat;
        this.triggerStat = triggerStat;
        this.legendaryStat = legendaryStat;
    }
}
