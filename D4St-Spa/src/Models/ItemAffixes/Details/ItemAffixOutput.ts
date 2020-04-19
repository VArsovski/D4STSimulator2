import { AffixCategoryEnum, ItemAffixSTatsEnum } from 'src/_Enums/itemAffixEnums';
// import { ItemArmorStats } from './ItemArmorStats';
// import { ItemDamageStats } from './ItemDamageStats';
// import { ItemBasicStats } from './ItemBasicStats';
// import { ItemOfensiveStats } from './ItemOfensiveStats';
// import { ItemDefenseStats } from './ItemDefensiveStats';
// import { ItemTriggerStats } from './ItemTriggerStats';
// import { ItemSecondaryTriggerStats } from './ItemSecondaryTriggerStats';
// import { ItemLegendaryStats } from './ItemLegendaryStats';
import { IItemAffixStats } from './IItemAffixStats';

export class ItemAffixOutput {
    CategoryStat?: AffixCategoryEnum;
    // armorStat?: ItemArmorStats;
    // damageStat?: ItemDamageStats;
    // basicStat?: ItemBasicStats;
    // ofensiveStat?: ItemOfensiveStats;
    // defensiveStat?: ItemDefenseStats;
    // triggerStat?: ItemTriggerStats;
    // secondaryTriggerStat?: ItemSecondaryTriggerStats;
    // legendaryStat?: ItemLegendaryStats;
    AffixData:IItemAffixStats
    SelectedAffixType:ItemAffixSTatsEnum;

    constructor(category: AffixCategoryEnum, affixData:IItemAffixStats
        // armorStat?: ItemArmorStats,
        // damageStat?: ItemDamageStats,
        // basicStat?: ItemBasicStats,
        // ofensiveStat?: ItemOfensiveStats,
        // defensiveStat?: ItemDefenseStats,
        // triggerStat?: ItemTriggerStats,
        // secondaryTriggerStat?: ItemSecondaryTriggerStats,
        // legendaryStat?: ItemLegendaryStats
        ) {
        this.CategoryStat = category;
        this.AffixData = affixData;
    }

    // public GetSelectedStats():any {
    //     var data = [this.armorStat, this.damageStat, this.basicStat, this.ofensiveStat, this.defensiveStat, this.triggerStat, this.secondaryTriggerStat, this.legendaryStat];
    //     return data.filter(d => d || ({Amount:0}).Amount);
    // }
}
