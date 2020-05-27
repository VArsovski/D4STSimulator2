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
    KnockbackOrBleed = 2,
    WitherOrConflagrate = 3,
    FreezeOrCurse = 4,
    BlindOrRoot = 5,
    ReduceArmorOrLevitate = 6
}

export enum SkillCategoryTypesEnum {
    Finisher = 1,
    Ultimate = 2,
    Stackable = 3,
    Summon = 4,
    Barrier = 5,
    HighCost = 6,
    HighCD = 7,
    Weak = 8,
    BannerTotemShout = 9,
    Setup = 10
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

export enum TrapAndSummonStatsEnum {
    LifeAndDuration = 1,
    Damage = 2,
    ProcEffectChance = 3
}

export enum SkillSpellStatsEnum {
    IncreaseDamage = 1, // Weak, Finisher, Ultimate
    IncreaseDuration = 2, // Weak, Stackable, Ultimate
    IncreaseProcChance = 3, // Stackable, BannerTotemShout
    ReduceCost = 4, // HighCost
    ReduceCD = 5 // HighCd, Ultimate
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
