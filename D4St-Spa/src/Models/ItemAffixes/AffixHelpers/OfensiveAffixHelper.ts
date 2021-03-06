import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { OfensiveStatsEnum, AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { ItemOfensiveStats } from '../Details/ItemOfensiveStats';

export class OfensiveAffixHelper {
    public GetByIndex(category: AffixCategoryEnum, level:number, powerLevel:number, index:number):ItemAffixOutput {
        var delimiter = 8;

        var selected =
          index % delimiter == 1 ? OfensiveStatsEnum.ArmorReductionAndBleed
        : index % delimiter == 2 ? OfensiveStatsEnum.PoisonAndBurn
        : index % delimiter == 3 ? OfensiveStatsEnum.KnockbackAndStun
        : index % delimiter == 4 ? OfensiveStatsEnum.CleaveAndAoE
        : index % delimiter == 5 ? OfensiveStatsEnum.CastAndProjectileRange
        : index % delimiter == 6 ? OfensiveStatsEnum.ChainAndPierce
        : index % delimiter == 7 ? OfensiveStatsEnum.FreezeAndRoot
        : OfensiveStatsEnum.Socket;
    
        var rand = Helpers.getRandom(1, 10);
        var amountVariance = 4 + level / 2 + Helpers.getRandom(-3, +3);
        var percentageVariance = 14 + level + Helpers.getRandom(-10, +10);

        var amount = rand % 2 == 0 ? amountVariance : 0;
        var amountPercentage = rand % 2 != 0 ? percentageVariance : 0;
        var ofensiveStatsData = new ItemOfensiveStats(category, level, powerLevel, amount, amountPercentage, selected);

        return new ItemAffixOutput(category, ofensiveStatsData);
    }
}
