import { ItemCategoriesEnum, ItemAffixTypeEnum, CastProcTypesEnum, AttackTypesEnum, AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { ItemAffixOutput } from './Details/ItemAffixOutput';

export interface IItemAffix {            // : ItemAffixBlueprint {
    ItemCategory: ItemCategoriesEnum;    // W,A,J
    ItemType: any;
    AffixType: ItemAffixTypeEnum;        // Basic, Off/Def && Unc/Cond
    CastProcType: CastProcTypesEnum;     // OnHit, OnCast, OnDeath
    AttackProcType: AttackTypesEnum;     // OnHit, OnCast, OnDeath
    AffixCategory: AffixCategoryEnum;

    // The Basic Data, Function should return formatted text with numbers and set Description
    Contents:ItemAffixOutput;
    Description:string;
    IsPrimaryDamage: boolean;
    IsSecondaryDamage: boolean;
    Triggers:boolean;
    Triggerable:boolean;
    IsCC:boolean;
    IsLegendary:boolean;
}
