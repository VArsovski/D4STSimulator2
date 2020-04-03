import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { TriggerStatsEnum } from 'src/_Enums/itemAffixEnums';

export class TriggerAffixHelper {
    public GetByIndex(level:number, powerLevel:number, index:number):ItemAffixOutput {
        var delimiter = 6;

        var selected = index % delimiter == 1 ? TriggerStatsEnum.ProcCleaveOrAoEEffect
        : index % delimiter == 2 ? TriggerStatsEnum.ProcPoisonOrBurnEffect
        : index % delimiter == 3 ? TriggerStatsEnum.ProcArmorReductionAndBleed
        : index % delimiter == 4 ? TriggerStatsEnum.ProcFreezeStunAttack
        : index % delimiter == 5 ? TriggerStatsEnum.ProcRandomSpellAttack
        : TriggerStatsEnum.ProcChainOrPierceAttack;
    
        // TODO: ASDFASDFASDFASDF
        return new ItemAffixOutput(null, null, null, null, null, null, selected);
    }
}
