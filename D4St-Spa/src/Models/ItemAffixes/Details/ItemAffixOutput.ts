import { AffixCategoryEnum, LegendaryStatsEnum } from 'src/_Enums/itemAffixEnums';
import { ItemArmorStats } from './ItemArmorStats';
import { ItemDamageStats } from './ItemDamageStats';
import { ItemBasicStats } from './ItemBasicStats';
import { ItemOfensiveStats } from './ItemOfensiveStats';
import { ItemDefenseStats } from './ItemDefensiveStats';
import { ItemTriggerStats } from './ItemTriggerStats';
import { ItemSecondaryTriggerStats } from './ItemSecondaryTriggerStats';
import { ItemLegendaryStats } from './ItemLegendaryStats';

export class ItemAffixOutput {
    categoryStat?: AffixCategoryEnum;
    armorStat?: ItemArmorStats;
    damageStat?: ItemDamageStats;
    basicStat?: ItemBasicStats;
    ofensiveStat?: ItemOfensiveStats;
    defensiveStat?: ItemDefenseStats;
    triggerStat?: ItemTriggerStats;
    secondaryTriggerStat?: ItemSecondaryTriggerStats;
    legendaryStat?: ItemLegendaryStats;

    constructor(categoryStat?: AffixCategoryEnum,
        armorStat?: ItemArmorStats,
        damageStat?: ItemDamageStats,
        basicStat?: ItemBasicStats,
        ofensiveStat?: ItemOfensiveStats,
        defensiveStat?: ItemDefenseStats,
        triggerStat?: ItemTriggerStats,
        secondaryTriggerStat?: ItemSecondaryTriggerStats,
        legendaryStat?: ItemLegendaryStats) {
        this.categoryStat = categoryStat;
        this.armorStat = armorStat;
        this.damageStat = damageStat;
        this.basicStat = basicStat;
        this.ofensiveStat = ofensiveStat;
        this.defensiveStat = defensiveStat;
        this.triggerStat = triggerStat;
        this.secondaryTriggerStat = secondaryTriggerStat;
        this.legendaryStat = legendaryStat;
    }

    public GetSelectedStats():any {
        var data = [this.armorStat, this.damageStat, this.basicStat, this.ofensiveStat, this.defensiveStat, this.triggerStat, this.secondaryTriggerStat, this.legendaryStat];
        return data.filter(d => d || ({Amount:0}).Amount);
    }
}
