export enum HitEffectTypesEnum {
    LifeReturn = 1,
    ResourceReturn = 2,
    ResourceSunder = 3,
    StaminaReturn = 4,
    StaminaSunder = 5,
    CriticalHit = 6,
    Knockback = 7,
    ReduceArmor = 8,
    CrushingBlow = 9,    // Reduces CC reduction rates
    Bleed = 10,          // While bleeding every hit suffered is a Crit
    Cleave = 11,
    ChainOrPierce = 12   // Can Proc [1, 2, 3, 4, 5] multiple times depending on targets hit
}

export enum CCEffectTypesEnum {
    StunOrKnockdown = 1,
    KnockbackOrLevitate = 2,
    WitherOrConflagrate = 3,
    BlindOrCurse = 4,
    FreezeOrRoot = 5,
    ReduceArmorOrBleed = 6
}

export enum SpellEffectTypesEnum {
    CastRange = 1,
    AoE = 2,
    DoT = 3,
    Stackable = 4,
    Multicast = 5,
    ResourceSunder = 6,
    StaminaSunder = 7,
    CastSpell = 8
}

export enum TriggerTypesEnum {
    HitEffectPhysical = 1,    // HitEffectTypesEnum
    HitEffectCC = 2,          // CCEffectTypesEnum
    SpellEffect = 3,          // SpellEffectTypesEnum
}

// More specifically TriggerConsequences
export enum SecondaryTriggerStatsEnum {
    AllowSkillForUsage = 1,
    AllowTrapsCast = 2,
    AllowCurseCast = 3,
    EmpowerBasicStat = 4,
    EmpowerOfenseStat = 5,
    EmpowerDefenseStat = 6,
    AddElementalDamage = 7
}
