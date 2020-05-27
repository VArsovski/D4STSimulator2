import { ItemAffixTypeEnum, AffixCategoryEnum, CastTypesEnum, CastProcTypesEnum  } from "../../_Enums/itemAffixEnums";

export interface IItemAffixBlueprint {
    Index: number;
    AffixType: ItemAffixTypeEnum;
    AffixCategory: AffixCategoryEnum;
    AttackProcType?: CastTypesEnum;
    CastProcType?: CastProcTypesEnum;
    IsConditional: boolean;
}
