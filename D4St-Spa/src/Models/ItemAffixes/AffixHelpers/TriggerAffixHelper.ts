import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { ItemTriggerStats } from '../Details/ItemTriggerStats';
import { TriggerTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { SkillVM } from 'src/Models/SkillVM';
import { AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';

export class TriggerAffixHelper {
    public GetByIndex(category: AffixCategoryEnum, level:number, powerLevel:number, amount:number, chance:number, type:TriggerTypesEnum, subtype:number, skillData:SkillVM):ItemAffixOutput {
        var delimiter = 6;

        var selected =
          type % delimiter == 1 ? TriggerTypesEnum.HitEffectPhysical
        : type % delimiter == 2 ? TriggerTypesEnum.HitEffectCC
        : TriggerTypesEnum.SpellEffect
    
        // TODO:
        var triggerStat = new ItemTriggerStats(category, level, powerLevel, amount, chance, selected, subtype, skillData);
        return new ItemAffixOutput(category, triggerStat);
    }
}
