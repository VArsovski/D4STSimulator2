import { ItemTriggerStats } from '../Details/ItemTriggerStats';
import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { SecondaryTriggerStatsEnum } from 'src/_Enums/triggerAffixEnums';
import { ItemSecondaryTriggerStats } from '../Details/ItemSecondaryTriggerStats';

export class SecondaryTriggerAffixHelper {
    public GetByIndex(level:number, powerLevel:number, amount:number, chance:number, duration:number, type:number, trigger:ItemTriggerStats):ItemAffixOutput {
        var delimiter = 6;
        var selected = type % delimiter == 1 ? SecondaryTriggerStatsEnum.AllowSkillForUsage
        : type % delimiter == 2 ? SecondaryTriggerStatsEnum.AllowTrapsCast
        : type % delimiter == 3 ? SecondaryTriggerStatsEnum.AllowCurseCast
        : type % delimiter == 4 ? SecondaryTriggerStatsEnum.EmpowerBasicStat
        : type % delimiter == 5 ? SecondaryTriggerStatsEnum.EmpowerOfenseStat
        : SecondaryTriggerStatsEnum.EmpowerDefenseStat;

        var triggerStat = new ItemSecondaryTriggerStats(level, powerLevel, amount, chance, duration, type, trigger);
        return new ItemAffixOutput(null, null, null, null, null, null, null, triggerStat);
    }
}
