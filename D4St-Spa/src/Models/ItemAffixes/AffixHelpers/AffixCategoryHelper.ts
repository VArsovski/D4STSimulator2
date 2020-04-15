import { ItemRarityTypesEnum, AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { ItemAffixOutput } from '../Details/ItemAffixOutput';

export class AffixCategoryHelper {
    public GetByIndex(index:number, rarity:ItemRarityTypesEnum):ItemAffixOutput {
        var delimiter = rarity == ItemRarityTypesEnum.Legendary ? 19 : 13;
    
        var selected =
          index % delimiter == 1 ? AffixCategoryEnum.IncreaseBasicStat
        : index % delimiter == 2 ? AffixCategoryEnum.IncreaseCastAffixStat
        : index % delimiter == 3 ? AffixCategoryEnum.IncreaseTriggerStat
        : index % delimiter == 4 ? AffixCategoryEnum.IncreaseSkillStat
        : index % delimiter == 5 ? AffixCategoryEnum.IncreaseEffectStat
        : index % delimiter == 6 ? AffixCategoryEnum.ConditionalProcBasicAffix
        : index % delimiter == 7 ? AffixCategoryEnum.ConditionalProcCastAffix
        : index % delimiter == 8 ? AffixCategoryEnum.ConditionalProcTriggerAffix
        : index % delimiter == 9 ? AffixCategoryEnum.ConditionalSkillTriggerAffix
        : index % delimiter == 10 ? AffixCategoryEnum.ConditionalProcEffectAffix
        // Legendary Secondary
        : index % delimiter == 11 ? AffixCategoryEnum.EmpowerProcTriggerAffixStat
        : index % delimiter == 12 ? AffixCategoryEnum.EmpowerProcSkillAffixStat
        : index % delimiter == 13 ? AffixCategoryEnum.EmpowerProcEffectAffixStat
        // LegendaryOnly
        : index % delimiter == 14 ? AffixCategoryEnum.AlterBasicAffixStat
        : index % delimiter == 15 ? AffixCategoryEnum.AlterProcTriggerAffixStat
        : index % delimiter == 16 ? AffixCategoryEnum.AlterProcSkillAffixStat
        : index % delimiter == 17 ? AffixCategoryEnum.AlterProcEffectAffixStat
        : index % delimiter == 18 ? AffixCategoryEnum.IncreaseDamage
        : AffixCategoryEnum.ExtraDamageEffect;
    
        return new ItemAffixOutput(selected);
    }
}
