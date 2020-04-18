export enum CCEffectTypesEnum {
    CriticalHit = 1,
    CrushingBlow = 2,
    ReduceArmor = 3,    //Axe
    Bleed = 4,          //Axe
    Stun = 5,           //Hammer
    Knockback = 6,      //Hammer
    Burn = 7,           //Bow
    Wither = 8,         //Bow
    Blind = 9,          //Javelin
    Curse = 10,         //Wand
    Freeze = 11,        //Staff
    Root = 12,          //Staff
}

export enum TriggerAffixTypesEnum {
    PhysicalAttack = 1,
    PhysicalAoE = 2,
    PhysicalCC = 3,
    SpellDebuff = 4,
    Cleave = 5,
    ChainOrPierce = 6,
    CastSpell = 7,
}

export enum TriggerStatsEnum {
    PhysicalAttack = 1,           //TriggerAffixes [1,2], 4 CCEffectTypesEnum[1,2]
    SpellAttack = 2,              //TA[6], CCET[5,6,8,9,10]
    PhysicalAoE = 3,              //TriggerAffixes [3, 6], 3 CCEffectTypesEnum[4,7]
    CCPhysical = 4,               //TA[3], CCET[3,4,7]
    Spellcast = 5,                //Cast a spell
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
