import { ItemTriggerStats } from '../Details/ItemTriggerStats';
import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { SecondaryTriggerStatsEnum } from 'src/_Enums/triggerAffixEnums';
import { ItemSecondaryTriggerStats } from '../Details/ItemSecondaryTriggerStats';
import { ResistanceTypesEnum, AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';

export class SecondaryTriggerAffixHelper {
    public GetByIndex(category: AffixCategoryEnum, level:number, powerLevel:number, amount:number, chance:number, duration:number, type:number, trigger:ItemTriggerStats, damageType?:ResistanceTypesEnum):ItemAffixOutput {
        var delimiter = 4;
        var selected =
          type % delimiter == 1 ? SecondaryTriggerStatsEnum.AllowSkillForUsage
        : type % delimiter == 2 ? SecondaryTriggerStatsEnum.AllowTrapsCast
        : type % delimiter == 3 ? SecondaryTriggerStatsEnum.AllowCurseCast
        : SecondaryTriggerStatsEnum.EmpowerBasicStat;
        // : type % delimiter == 5 ? SecondaryTriggerStatsEnum.EmpowerOfenseStat
        // : SecondaryTriggerStatsEnum.EmpowerDefenseStat;

        var triggerStat = new ItemSecondaryTriggerStats(category, level, powerLevel, amount, chance, duration, selected, trigger, damageType);
        return new ItemAffixOutput(category, triggerStat);
    }
}
