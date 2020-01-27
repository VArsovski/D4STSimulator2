namespace D4ST_Api.Models.Enums
{
    public enum AffixMetadataEnum
    {
        HitProc = 0, ProcsOnDeath = 1, HighDamage = 2, HighProcRate = 3, CC = 4, Curse = 5, BuffDebuff = 6,
        Melee = 7, AoE = 8, Projectile = 9, ProjectileCharacter = 10, DoA = 11, HasDoT = 12, Summon = 13,
        HighCost_Spender = 14, HighCD = 15, Ultimate = 16, BannerOrTotem = 17
    }

    public enum AffixTypeEnum {
        // Light Proc Return, Light buff, Light Debuff, Hard Debuff (Environment proc)
        LPR = 0, LB = 1, LD = 2, EP = 3
    }

    public enum LPRsEnum {
        IncreaseAS = 0, IncreaseMS = 1, IncreaseArmor = 2, IncreaseProcReturn = 3, AddElementalDamage = 4,
        // DecrDamageTakenOfType = 5, -> in Debuffs
        GainDamageAgainstMonsterType = 5, IncrRandomRes = 6, IncrAllRes = 7, ReturnStamina = 8,
        IncrRadius = 9, IncrDoT = 10, Pierce_IfProjectile = 11, DamageTwice_IfProjectile = 12
    }

    public enum LBsEnum {
        IncreaseASMS = 0, IncreaseArmor = 1, IncrAllRes = 2, RandomCCRed = 3, RandomShoutOrCry = 4,
        EmpowerOrActivateMulticast = 5, ActivateBarrier = 6, DamageTakenReduced = 7, OtherRandomLPROnDeathForX = 8, CDRed_IfHighCD = 9
    }

    public enum LDBsEnum {
        GainThorns = 0, DecreaseArmor = 1, Bleed = 2, Slow = 3, RandCurse_Low = 4, DecrRandRes = 5,
        GainDamageReductionFromMonsterType = 6, RandomTrap_IfAny = 7, LowPercCastRandomEP = 8, MulticastOnDeath = 9
    }

    public enum EPs_HighDBsEnum {
        CorpseExplosion = 0, SolidifyCorpse = 1, GainChargesOfRandomTrap = 2, RandomCurse = 3, SplitSunder = 4,
        RandomCC = 5, MulticastOnDeathForX = 6, RandomTotemOrBanner = 7
    }

    public enum CursesEnum {
        Weaken = 0, AmplifyDamage = 1, Blind = 2, Shackle = 3,
        Silence = 4, DamageReturn = 5, Ignite = 6,
        Decripify = 7, AttractLinkedDamage = 8, Horrify = 9
    }

    public enum CCsEnum {
        Daze = 0, Knockback = 1, Root = 2, Stun = 3, Silence = 4
    }
}
