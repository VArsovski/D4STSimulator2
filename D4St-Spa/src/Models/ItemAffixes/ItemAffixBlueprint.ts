import { ItemAffixTypeEnum, AffixCategoryEnum, AttackTypesEnum, CastProcTypesEnum  } from "../../_Enums/itemAffixEnums";

export class ItemAffixBlueprint {
    Index: number;
    AffixType: ItemAffixTypeEnum;
    AffixCategory: AffixCategoryEnum;     // Depends on AffixType and Rarity of Item
    IsConditional:boolean;                // Requires (X A/D/A to unlock, or not)
    PowerLevel: number;                   // Empower the numbers during generation
    private AttackProcType?: AttackTypesEnum;
    private CastProcType?: CastProcTypesEnum;

    constructor(affixType: ItemAffixTypeEnum, isConditional:boolean, affixCategory?: AffixCategoryEnum, castProcType?: CastProcTypesEnum, attacProckType?: AttackTypesEnum){
        this.AffixType = affixType;
        this.IsConditional = isConditional;

        this.Index = affixCategory || 0;
        this.AffixCategory = affixCategory;
        this.AttackProcType = attacProckType;
        this.CastProcType = castProcType;
        this.PowerLevel = 0;
    }

    PowerUp() {
        this.PowerLevel++;
    }

    SetCastProcType(procType:CastProcTypesEnum) {
        this.CastProcType = procType;
    }

    SetAttackProcType(procType:AttackTypesEnum) {
        this.AttackProcType = procType;
    }
}
