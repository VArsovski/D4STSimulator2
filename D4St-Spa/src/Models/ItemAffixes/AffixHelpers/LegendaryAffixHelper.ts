import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { LegendaryStatsEnum, AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { ItemLegendaryStats } from '../Details/ItemLegendaryStats';

export class LegendaryAffixHelper {
    public GetByIndex(category:AffixCategoryEnum, level:number, powerLevel:number, index:number):ItemAffixOutput {
        var delimiter = 12;

        var selected =
          index % delimiter == 1 ? LegendaryStatsEnum.AlternateCleaveOrAoEEffect
        : index % delimiter == 2 ? LegendaryStatsEnum.AlternatePoisonOrBurnEffect
        : index % delimiter == 3 ? LegendaryStatsEnum.AlternateArmorReductionAndBleed
        : index % delimiter == 4 ? LegendaryStatsEnum.AlternateFreezeStunAttack
        : index % delimiter == 5 ? LegendaryStatsEnum.AlternateRandomSpellAttack
        : index % delimiter == 6 ? LegendaryStatsEnum.AlternateChainOrPierceAttack
        : index % delimiter == 7 ? LegendaryStatsEnum.AlternateBasicStats
        : index % delimiter == 8 ? LegendaryStatsEnum.AlternateCCEffectDuration
        : index % delimiter == 9 ? LegendaryStatsEnum.AlternateCCEffectDamageTaken
        : index % delimiter == 10 ? LegendaryStatsEnum.AlternateDamageTypeTaken
        : index % delimiter == 11 ? LegendaryStatsEnum.AlternateAttackTypeTaken
        : LegendaryStatsEnum.AlternateLifestealOrShielding;
    
        var legendaryStat = new ItemLegendaryStats(category, selected);
        return new ItemAffixOutput(category, legendaryStat);
    }
}
