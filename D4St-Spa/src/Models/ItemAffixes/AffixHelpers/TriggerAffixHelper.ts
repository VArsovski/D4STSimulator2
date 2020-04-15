import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { ItemTriggerStats } from '../Details/ItemTriggerStats';
import { TriggerStatsEnum } from 'src/_Enums/triggerAffixEnums';
import { SkillVM } from 'src/Models/SkillVM';

export class TriggerAffixHelper {
    public GetByIndex(level:number, powerLevel:number, amount:number, chance:number, type:TriggerStatsEnum, skillData:SkillVM):ItemAffixOutput {
        var delimiter = 6;

        // PhysicalAttack = 1,           //TriggerAffixes [1,2], 4 CCEffectTypesEnum[1,2]
        // SpellAttack = 1,              //TA[6], CCET[5,6,8,9,10]
        // PhysicalAoE = 2,              //TriggerAffixes [3, 6], 3 CCEffectTypesEnum[4,7]
        // CCPhysical = 4,               //TA[3], CCET[3,4,7]
        // Spellcast = 5,                //Cast a spell
        var selected =
          type % delimiter == 1 ? TriggerStatsEnum.PhysicalAttack
        : type % delimiter == 2 ? TriggerStatsEnum.SpellAttack
        : type % delimiter == 3 ? TriggerStatsEnum.PhysicalAoE
        : type % delimiter == 4 ? TriggerStatsEnum.CCPhysical
        : TriggerStatsEnum.Spellcast;
    
        // TODO:
        var triggerStat = new ItemTriggerStats(level, powerLevel, amount, chance, selected, null, null, skillData);
        return new ItemAffixOutput(null, null, null, null, null, null, triggerStat);
    }
}
