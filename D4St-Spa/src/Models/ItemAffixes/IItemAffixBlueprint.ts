import { ItemAffixTypeEnum, AffixCategoryEnum, AttackTypesEnum, CastProcTypesEnum  } from "../../_Enums/itemAffixEnums";

export interface IItemAffixBlueprint {
    Index: number;
    AffixType: ItemAffixTypeEnum;
    AffixCategory: AffixCategoryEnum;
    AttackProcType?: AttackTypesEnum;
    CastProcType?: CastProcTypesEnum;
    IsConditional: boolean;
}
