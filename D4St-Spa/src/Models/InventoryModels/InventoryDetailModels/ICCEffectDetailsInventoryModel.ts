import { ItemDamageStats } from 'src/Models/ItemAffixes/Details/ItemDamageStats'
import { InventoryDamageModel } from '../InventoryDamageModel'
import { TriggerStatEquippable } from 'src/Models/IEquippableStatDetails/TriggerStatEquippable'
import { SimpleAffixStats } from 'src/Models/ItemAffixes/Details/IItemAffixStats'
import { SimpleCCEffectAffixData } from './SimpleCCEffectAffixData'

export interface ICCEffectStatDetailsInventoryModel {
    Stun:ICCEffectAffixData;
    Knockdown:ICCEffectAffixData;
    Knockback:ICCEffectAffixData;
    Levitate:ICCEffectAffixData;
    Wither:ICCEffectAffixData;
    Conflagrate:ICCEffectAffixData;
    Blind:ICCEffectAffixData;
    Curse:ICCEffectAffixData;
    Freeze:ICCEffectAffixData;
    Root:ICCEffectAffixData;
    ReduceArmor:ICCEffectAffixData;
    Bleed:ICCEffectAffixData;
}

export interface ICCffectStatDetailsInventoryModelCombined {
    StunOrKnockdown:ICCEffectAffixData;
    KnockbackOrBleed:ICCEffectAffixData;
    WitherOrConflagrate:ICCEffectAffixData;
    FreezeOrCurse:ICCEffectAffixData;
    BlindOrRoot:ICCEffectAffixData;
    ReduceArmorOrLevitate:ICCEffectAffixData;
}

export interface IPhysicalffectStatDetailsInventoryModelCombined {
    // TODO
    LifeReturn: SimpleCCEffectAffixData,
    ResourceReturn: SimpleCCEffectAffixData,
    ResourceSunder: SimpleCCEffectAffixData,
    StaminaReturn: SimpleCCEffectAffixData,
    StaminaSunder: SimpleCCEffectAffixData,
    CriticalHit: SimpleCCEffectAffixData,
    Knockback: SimpleCCEffectAffixData,
    ReduceArmor: SimpleCCEffectAffixData,
    CrushingBlow: SimpleCCEffectAffixData,    // Reduces CC reduction rates
    Bleed: SimpleCCEffectAffixData,          // While bleeding every hit suffered is a Crit
    Cleave: SimpleCCEffectAffixData,
    ChainOrPierce: SimpleCCEffectAffixData   // Can Proc [1, 2, 3, 4, 5] multiple times depending on targets hit
}

export interface ICCEffectAffixData {
    // Defensive
    ReduceChance: number;
    ReducePercentage: number;
    ReduceAmount: number;
    // Defensive
    Chance: number;
    Percentage: number;
    Amount: number;
}
