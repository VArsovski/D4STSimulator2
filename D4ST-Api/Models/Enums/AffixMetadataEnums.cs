namespace D4ST_Api.Models.Enums
{
    public enum AffixMetadataEnum
    {
        HitProc = 0, ProcsOnDeath = 1, HighDamage = 2, CC = 3, Curse = 4, BuffDebuff = 5,
        Melee = 6, AoE = 7, Projectile = 8, ProjectileCharacter = 9, DoA = 10, HasDoT = 11, Summon = 12,
        IsWeak = 13, IsStrong = 14, HighCost = 15, HighCD = 16, Ultimate = 17, BannerOrTotem = 18, ProcsBuff = 19, Stackable = 20
    }

    public enum AffixTypeEnum {
        // Light Proc Return, Light buff, Light Debuff, Hard Debuff (Environment proc)
        LPR = 0, LB = 1, LD = 2, EP = 3
    }

    public enum LPRsEnum {
        IncreaseAS = 0, IncreaseMS = 1, IncreaseArmor = 2, IncreaseProcReturn = 3, ReturnStamina = 4,
        // DecrDamageTakenOfType = 5, -> in Debuffs
        AddElementalDamage = 5, GainDamageAgainstMonsterType = 6, IncrRandomRes = 7,  IncrAllRes = 8,
        IncrRadius = 9, IncrDoT = 10, Pierce_IfProjectile = 11, DamageTwice_IfProjectile = 12
    }

    public enum LBsEnum {
        IncreaseASMS = 0, IncreaseArmor = 1, IncrAllRes = 2, RandomCCRed = 3, RandomShoutOrCry = 4,
        EmpowerOrActivateMulticast = 5, ActivateBarrier = 6, DamageTakenReduced = 7, OtherRandomLPROnDeathForX = 8, CDRed_IfHighCD = 9
    }

    public enum LDBsEnum {
        SpreadPoison = 0, Bleed = 1, Slow = 2, GainThorns = 3, RandCurse_Low = 4, DecrRandRes = 5,
        GainDamageReductionFromMonsterType = 6, SetRandomTrap = 7, LowPercCastRandomEP = 8, MulticastOnDeath = 9
    }

    public enum EPs_HighDBsEnum {
        RandomTotemOrBanner = 0, SolidifyCorpse = 1, CorpseExplosion = 2, GainChargesOfRandomTrap = 3, RandomCurse = 4,
        RandomCC = 5, SplitSunder = 6, MulticastOnDeathForX = 7
    }

    public enum CursesEnum {
        Weaken = 0, AmplifyDamage = 1, Blind = 2,
        Ignite = 3, Charm = 4, DamageReturn = 5,
        Decripify = 6, AttractLinkedDamage = 7, Horrify = 8
    }

    public enum CCsEnum {
        Root = 0, Wound = 1, Knockback = 2, Shackle = 3, Knockdown = 4, Silence = 5, Levitate = 6, SplitSunder = 7, Stun = 8
    }
    public enum HighTierCCAncEnum {
        SplitSunder = 0, Knockback = 1, Stun = 2, Levitate = 3
    }
}
