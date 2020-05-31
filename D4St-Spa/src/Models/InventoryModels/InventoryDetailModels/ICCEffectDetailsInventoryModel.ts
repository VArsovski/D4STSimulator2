import { SimpleDoubleAffixData } from './SimpleDoubleAffixData'
import { IDoubleStatAffix } from './IDoubleStatAffixData';

export interface ICCEffectStatDetailsInventoryModel {
    Stun:IDoubleStatAffix;
    Knockdown:IDoubleStatAffix;
    Knockback:IDoubleStatAffix;
    Levitate:IDoubleStatAffix;
    Wither:IDoubleStatAffix;
    Conflagrate:IDoubleStatAffix;
    Blind:IDoubleStatAffix;
    Curse:IDoubleStatAffix;
    Freeze:IDoubleStatAffix;
    Root:IDoubleStatAffix;
    ReduceArmor:IDoubleStatAffix;
    Bleed:IDoubleStatAffix;
}

export interface ICCffectStatDetailsInventoryModelCombined {
    StunOrKnockdown:IDoubleStatAffix;
    KnockbackOrBleed:IDoubleStatAffix;
    WitherOrConflagrate:IDoubleStatAffix;
    FreezeOrCurse:IDoubleStatAffix;
    BlindOrRoot:IDoubleStatAffix;
    ReduceArmorOrLevitate:IDoubleStatAffix;
}

export interface IPhysicalffectStatDetailsInventoryModelCombined {
    // TODO
    LifeReturn: SimpleDoubleAffixData,
    ResourceReturn: SimpleDoubleAffixData,
    ResourceSunder: SimpleDoubleAffixData,
    StaminaReturn: SimpleDoubleAffixData,
    StaminaSunder: SimpleDoubleAffixData,
    CriticalHit: SimpleDoubleAffixData,
    Knockback: SimpleDoubleAffixData,
    ReduceArmor: SimpleDoubleAffixData,
    CrushingBlow: SimpleDoubleAffixData,    // Reduces CC reduction rates
    Bleed: SimpleDoubleAffixData,          // While bleeding every hit suffered is a Crit
    Cleave: SimpleDoubleAffixData,
    ChainOrPierce: SimpleDoubleAffixData   // Can Proc [1, 2, 3, 4, 5] multiple times depending on targets hit
}
