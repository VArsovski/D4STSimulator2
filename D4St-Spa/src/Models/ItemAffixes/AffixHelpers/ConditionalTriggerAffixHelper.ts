import { AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { ItemTriggerStats } from '../Details/ItemTriggerStats';
import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { ItemConditionalBasicStats } from '../Details/ItemConditionalAffixesStats';
import { ItemBasicStats } from '../Details/ItemBasicStats';

export class ConditionalTriggerAffixHelper {
    public GetByIndex(category: AffixCategoryEnum, level:number, powerLevel:number, duration:number, basicStat:ItemBasicStats, trigger:ItemTriggerStats):ItemAffixOutput {
        var conditionalTriggerStat = new ItemConditionalBasicStats(level, powerLevel, basicStat, trigger, duration);
        return new ItemAffixOutput(category, conditionalTriggerStat);
    }
}
