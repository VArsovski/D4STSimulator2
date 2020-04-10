import { ItemCategoriesEnum, ItemAffixTypeEnum, CastProcTypesEnum, AttackTypesEnum, AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { ItemAffixOutput } from './Details/ItemAffixOutput';
import { SkillVM } from '../SkillVM';
import { IItemAffixCondition } from './IItemAffixCondition';

export interface IItemAffix {            // : ItemAffixBlueprint {
    ItemCategory: ItemCategoriesEnum;    // W,A,J
    ItemType: number;
    AffixType: ItemAffixTypeEnum;        // Basic, Off/Def && Unc/Cond
    CastProcType: CastProcTypesEnum;     // OnHit, OnCast, OnDeath
    AttackProcType: AttackTypesEnum;     // OnHit, OnCast, OnDeath
    AffixCategory: AffixCategoryEnum;    // Melee, Projectile, AoE, TriggerEffect, Summon
    ConditionSatisfied: boolean;

    // The Basic Data, Function should return formatted text with numbers and set Description
    Contents:ItemAffixOutput;
    Condition: IItemAffixCondition;
    Description:string;
    Triggers:boolean;
    Triggerable:boolean;
    IsCC:boolean;
    IsLegendary:boolean;

    GetAffixDescription(skillData:SkillVM[]):string;
}
