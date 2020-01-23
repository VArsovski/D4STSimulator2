export class MasteryPowerAffixes {
    ReduceDamagePerHit: number; // X + level/(11-x) //Max 10
    MagicDamageReduced: number; // X + level/(11-x) * resType/10 //Max 10
    CCReduction: number; // X + level/(10-X) % //Max 5
    DebuffReduction: number; // X + level/(10-X) % //Max 5
    CheatDeathCD: number; // 300*(1 - SUM([1-X]{1/(10-X)})) //Max 5
    BonusResistancePoints: number; // Manual of level/10*X per click
}
