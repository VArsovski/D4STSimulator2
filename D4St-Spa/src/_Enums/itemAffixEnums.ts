//# region BasicEnum types

export enum BasicStatsEnum {
    HP = 1,
    Resource = 2,
    Stamina = 3,
    // Instead of creating a new Type that contains Armor but without HP, will just randomize between (1,3) where applicable or (2,4)
    Armor = 4,
}

export enum ItemCategoriesEnum {
    Armor= 1,
    Weapon= 2,
    Jewelry= 3
}
export enum ResistanceTypesEnum {
    Physical = 1,
    Fire = 2,
    Cold = 3,
    Lightning = 4,
    Poison = 5,
    All = 6
}
export enum ItemArmorTypesEnum {
    Boots=1,
    Chest=2,
    Gloves=3,
    Helm=4,
    Pants=5
}
export enum ItemWeaponTypesEnum {
    Axe=1,
    Bow=2,
    Hammer=3,
    Sword=4,
    Javelin=5,
    Wand=6,
    Staff=7
}
export enum ItemJewelryTypesEnum {
    Amulet=1,
    Ring=2
}
export enum ItemRarityTypesEnum{
    Magic=1,
    Rare=2,
    Legendary=3
}
export enum ArmorTypesEnum {
    Light= 1,
    Heavy= 2,
    Mystic= 3
}
export enum CastProcTypesEnum
{
    OnHit=1,
    OnCast=2,
    OnDeath=3
}
export enum OfensiveStatCategoryEnum {
    Damage = 1,
    Radius = 2,
    Duration = 3,
    Chance = 4
}
export enum DefensiveStatCategoryEnum {
    Damage = 1,
    Duration = 2,
    Bonus = 3,
    Chance = 4
}

//# endregion

export enum ItemAffixTypeEnum {
    BasicStat= 1,
    Damage = 2,
    Armor = 3,
    // Added afterwards to reduce/increase randomness of A/W types
    SecondaryDefensiveStat=11,
    SecondaryDamageStat=12,
    SecondaryStat= 4,
    TriggerEffect = 5,
    Offensive= 6,
    Defensive= 7,
    PowerUpSkill= 8,
    SecondaryTrigger=9,
    Legendary=10
}
export enum ItemAffixSTatsEnum {
    ArmorStat = 1,
    DamageStat = 2,
    BasicStat = 3,
    OfensiveStat = 4,
    DefensiveStat = 5,
    TriggerStat = 6,
    SecondaryTriggerStat = 7,
    LegendaryStat = 8,
    OtherTypeStat = 9
}
export enum CastTypesEnum {
    MeleeHit= 1,
    Projectile= 2,
    AoE= 3,
    TriggerEffect= 4,
    BuffDebuff=5,
    MovementOrPeel=6,
    Summon= 7
}
export enum DamageTypesEnum {
    PhysicalOrCC = 1,
    CleaveOrAoE = 2,
    ChainOrProjectile = 3,
    TrapOrSummon = 4,
    TickOrCurse = 5
}

export enum AffixCategoryEnum {
    PrimaryArmor = 1,
    PrimaryDamage= 2,
    // These 3 below were added afterwards to increase/reduce randomness of first stats in Armors/Weapons
    EmpowerDamageType = 22,
    IncreaseSecondaryStatDefensive = 23, // +Resistance, +CCReduction
    IncreaseSecondaryStatDamage = 24, // +SunderStatPerHit, +CCDuration/Damage
    IncreaseBasicStat= 3, // +HP, +Armor, +Resource, +Regen
    IncreaseCastAffixStat= 4, // +CastRange, AoE, Pierce, Duration
    IncreaseTriggerStat= 5, //+Crit/Crushing/Knockback/Stun/Freeze chance
    IncreaseSkillStat= 6, // +X skill
    IncreaseEffectStat= 7, //+Crit/Crushing/Knockback/Stun/Freeze does X more

    ConditionalProcBasicAffix= 8, // Gain 3 when X
    ConditionalProcCastAffix= 9, // Gain 4 when X
    ConditionalProcTriggerAffix= 10, // Gain 5 when X
    ConditionalSkillTriggerAffix= 11, // Gain 6 when X
    ConditionalProcEffectAffix= 12,  // Gain 7 when X

    EmpowerProcTriggerAffixStat= 13, // Next 5 does more when X
    EmpowerProcSkillAffixStat= 14, // Next 6 does more when X
    EmpowerProcEffectAffixStat= 15, // Next 7 does more when X

    AlterBasicAffixStat= 16,       // [LegendaryOnly] Alternate effect of 3
    AlterProcTriggerAffixStat= 17, // [LegendaryOnly] Alternate effect of 4
    AlterProcSkillAffixStat= 18, // [LegendaryOnly] Alternate effect of 5
    AlterProcEffectAffixStat= 19, // [LegendaryOnly] Alternate effect of 7
    IncreaseDamage= 20, // if Weapon then Basic can too, otherwise [LegendaryOnly]
    ExtraDamageEffect= 21, // if Weapon then Basic can too, otherwise [LegendaryOnly]
}

export enum BasicStatTypesEnum {
    PowerStats= 1,
    StatAmount=2,
    StatRegen=3,
    StatPercentage=4,
    StatPercentageRegen=5,
    StatReturn=6,
    Resistance=7,
    SkillEmpower=8,
    Socket=9
}

export enum SecondaryStatTypesEnum {
    Resistance = 1,
    ReduceCCTaken = 2,
    IncreaseStatSunder = 3,
    EmpowerTrapsAndSummons = 4,
    ReduceDamageTaken = 5,
    EmpowerSkillType = 6,
    Socket = 7
}

export enum OfensiveStatsEnum {
    ArmorReductionAndBleed= 1,
    PoisonAndBurn= 2,
    KnockbackAndStun= 3,
    CleaveAndAoE= 4,
    CastAndProjectileRange= 5,
    ChainAndPierce= 6,
    FreezeAndRoot= 7,
    Socket = 8
}
export enum DefensiveStatsEnum {
    CCEffects= 1,
    PotionAndGlobeBonus= 2,
    DamageTaken= 3,
    AttacksTaken= 4,
    ThornsDamage= 5,
    DamageStaggered= 6,
    LifestealOrShielding= 7,
    Socket = 8
}
export enum LegendaryStatsEnum {
    AlternateCleaveOrAoEEffect = 1,
    AlternatePoisonOrBurnEffect = 2,
    AlternateArmorReductionAndBleed = 3,
    AlternateFreezeStunAttack = 4,
    AlternateRandomSpellAttack = 5,
    AlternateChainOrPierceAttack = 6,
    AlternateBasicStats = 7,
    AlternateCCEffectDuration = 8,
    AlternateCCEffectDamageTaken = 9,
    AlternateDamageTypeTaken = 10,
    AlternateAttackTypeTaken = 11,
    AlternateLifestealOrShielding = 12
}
