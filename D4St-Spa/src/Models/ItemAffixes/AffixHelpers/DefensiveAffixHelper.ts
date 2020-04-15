import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { DefensiveStatsEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { ItemDefenseStats } from '../Details/ItemDefensiveStats';

export class DefensiveAffixHelper {
    public GetByIndex(level:number, powerLevel:number, index:number):ItemAffixOutput {
        var delimiter = 8;

        var selected =
          index % delimiter == 1 ? DefensiveStatsEnum.CCEffects    //Chance%Duration
        : index % delimiter == 2 ? DefensiveStatsEnum.PotionAndGlobeBonus       //Bonus
        : index % delimiter == 3 ? DefensiveStatsEnum.DamageTaken    //Reduction
        : index % delimiter == 4 ? DefensiveStatsEnum.AttacksTaken    //Reduction
        : index % delimiter == 5 ? DefensiveStatsEnum.ThornsDamage
        : index % delimiter == 6 ? DefensiveStatsEnum.DamageStaggered
        : index % delimiter == 7 ? DefensiveStatsEnum.LifestealOrShielding
        : DefensiveStatsEnum.Socket;
    
        var rand = Helpers.getRandom(1, 10);
        var amountVariance = 4 + level / 2 + Helpers.getRandom(-3, +3);
        var percentageVariance = 14 + level + Helpers.getRandom(-10, +10);
        var chance = 8 + level / 4 + Helpers.getRandom(-6, +6);
        var durationNum = 3 + (level / 10 + (Helpers.getRandom(-10, +10)/10));
        var duration = Math.round(durationNum * 10) / 10;

        var amount = rand % 2 == 0 ? amountVariance : 0;
        var amountPercentage = rand % 2 != 0 ? percentageVariance : 0;
        var defensiveStatsData = new ItemDefenseStats(level, powerLevel, amount, amountPercentage, chance, duration, selected);
        
        return new ItemAffixOutput(null, null, null, null, null, defensiveStatsData);
    }
}
