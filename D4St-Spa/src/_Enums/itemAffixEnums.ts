export enum BasicStatsEnum {
    HP = 1,
    Resource = 2,
    Stamina = 3
    // Armor = 4
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
    Chest=1,
    Pants=2,
    Gloves=3,
    Boots=4,
    Helm=5
}

export enum ItemWeaponTypesEnum {
    Axe=1,
    Bow=2,
    Hammer=3,
    Sword=4,
    Wand=5,
    Javelin=6,
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

export enum ItemAffixTypeEnum {
    BasicStat= 1,
    Damage = 2,
    Armor = 3,
    TriggerEffect = 4,
    Offensive= 5,
    Defensive= 6,
    Legendary=7,
    PowerUpSkill= 8,
    AdditionalTriggers=9
}

export enum AttackTypesEnum {
    MeleeHit= 1,
    Projectile= 2,
    AoE= 3,
    TriggerEffect= 4, // Critical, CrushingBlow, Knockback, ..
    Summon= 5
}

export enum DamageTypesEnum {
    BleedOrArmorReduction = 1,
    PoisonOrBurn = 2,
    KnockbackOrRoot = 3,
    CleaveOrAoE = 4,
    ChainOrPierceAttack = 5,
    ProjectileOrSummon = 6,
    FreezeOrStun = 7,
    Physical= 8
}

export enum CCEffectGroupsEnum {
    FreezeOrStun = 1,
    BleedOrArmorReduction = 2,
    PoisonOrBurn = 3,
    KnockbackOrRoot = 4,
    CurseOrBlind = 5
}

export enum CCEffectTypesEnum {
    ReduceArmor = 1,    //Axe
    Bleed = 2,          //Axe
    Burn = 3,           //Bow
    Wither = 4,         //Bow
    Root = 5,           //Hammer
    Knockback = 6,      //Hammer
    Blind = 7,          //Javelin
    Curse = 8,          //Wand
    Stun = 9,           //Staff
    Freeze = 10         //Staff
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

export enum AffixCategoryEnum {
    PrimaryArmor = 1,
    PrimaryDamage= 2,
    IncreaseBasicStat= 3, // +HP, +Armor, +Resource, +Regen, +Resistance
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

export enum BasicAffixEnum {
    IncreaseBasicPower= 1, // A D A
    IncreaseBasicStat= 2, // HP, Resource, Armor, Stamina //Don't put DamageStats here, they go in WeaponOnly category
    IncreaseStatRegen= 3, // HP, Resource, Stamina // If Stamina then Also add a Skill Bonus or another Basic Stat
    IncreaseResistance= 4,
    IncreaseSkillStat=5,
    Socket = 6
}

export enum TriggerStatsEnum {
    ProcCleaveOrAoEEffect = 1,
    ProcPoisonOrBurnEffect = 2,
    ProcArmorReductionAndBleed = 3,
    ProcFreezeStunAttack = 4,
    ProcRandomSpellAttack = 5,
    ProcChainOrPierceAttack = 6,
}

export enum AdditionalTriggerStatsEnum {
    CheatDeath = 1,
    AllowSkillForUsage = 2,
    AllowTrapsCastRenewable = 3,
    AllowCurseCastRenewable = 4,
    EmpowerAllRegen = 5,
    TriggerEffectsRepeatable = 6,
}

// Axe= 1,
// Bow= 2,
// Hammer= 3,
// Sword= 4,
// Wand= 5,
// Javelin= 6,
// CastAndProjectileRange= 7,
export enum OfensiveStatsEnum {
    ArmorReductionAndBleed= 1,
    PoisonAndBurn= 2,
    KnockbackAndRoot= 3,
    CleaveAndAoE= 4,
    CastAndProjectileRange= 5,
    ChainAndPierce= 6,
    FreezeAndStun= 7,
    Socket = 8
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

export enum DefensiveStatsEnum {
    CCEffects= 1,
    PotionAndGlobe= 2,
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
