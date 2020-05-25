// export class SkillEnums {
//     // public static SkillMetadataEnum=any = {
//     //     IncreaseAS= 0, IncreaseMS= 1, IncreaseArmor= 2, IncreaseProcReturn= 3, AddElementalDamage= 4,
//     //     // DecrDamageTakenOfType= 5, -> in Debuffs
//     //     GainDamageAgainstMonsterType= 5, IncrRandomRes= 6, IncrAllRes= 7, ReturnStamina= 8,
//     //     IncrRadius= 9, IncrDoT= 10, Pierce_IfProjectile= 11, DamageTwice_IfProjectile= 12
//     // }

    export enum AffixMetadataEnum {
        HitProc = 0, ProcsOnDeath = 1, HighDamage = 2, CC = 3, UsesWeaponDamage = 4, BuffDebuff = 5,
        Melee = 6, AoE = 7, Projectile = 8, ProjectileCharacter = 9, DoA = 10, HasDoT = 11, Summon = 12,
        IsWeak = 13, IsStrong = 14, HighCost = 15, HighCD = 16, Ultimate = 17, BannerOrTotem = 18, ProcsBuff = 19, Stackable = 20
    }

    export enum SkillCategoriesEnum {
        Melee = 0, Projectile = 1, Stackable = 2, Buff = 3, Debuff = 4, AoE = 5, DoA = 6, DoT = 7, TBS = 8,// (short for Totem/Shout/Banner)
        Setup = 9, Disengage = 10, Movement = 11, Finisher = 12, Summon = 13, Shapeshift = 14, Ultimate = 15, Delayed = 17, Barrier = 17        
    }

    export enum AffixTypeEnum {
        LPR = 0, LB = 1, LD = 2, EP = 3
    }

    export enum LPRsEnum {
        IncreaseAS = 0, IncreaseMS = 1, IncreaseArmor = 2, IncreaseProcReturn = 3, ReturnStamina = 4,
        // DecrDamageTakenOfType = 5, -> in Debuffs
        AddElementalDamage = 5, GainDamageAgainstMonsterType = 6, IncrRandomRes = 7,
        IncrAllRes = 8, IncrRadius = 9, IncrDoT = 10, Pierce_IfProjectile = 11, DamageTwice_IfProjectile = 12
    }

    export enum LBsEnum {
        IncreaseASMS = 0, IncreaseArmor = 1, IncrAllRes = 2, RandomCCRed = 3, RandomShoutOrCry = 4,
        EmpowerOrActivateMulticast = 5, ActivateBarrier = 6, DamageTakenReduced = 7, OtherRandomLPROnDeathForX = 8, CDRed_IfHighCD = 9
    }

    export enum LDBsEnum {
        SpreadPoison = 0, Bleed = 1, Slow = 2, GainThorns = 3, RandCurse_Low = 4, DecrRandRes = 5,
        GainDamageReductionFromMonsterType = 6, SetRandomTrap = 7, LowPercCastRandomEP = 8, MulticastOnDeath = 9
    }

    export enum EPs_HighDBsEnum {
        RandomTotemOrBanner = 0, SolidifyCorpse = 1, CorpseExplosion = 2, GainChargesOfRandomTrap = 3, RandomCurse = 4,
        RandomCC = 5, SplitSunder = 6, MulticastOnDeathForX = 7
    }

    export enum CursesEnum {
        Weaken = 0, AmplifyDamage = 1, Blind = 2,
        Ignite = 3, Charm = 4, DamageReturn = 5,
        Decripify = 6, Attract = 7, LinkedDamage = 8, Horrify = 9
    }

    export enum TrapsEnum {
        SpikeTrap = 0, SnakeTrap = 1, ExplosionTrap = 2,
        FrostTrap = 3, LightningTrap = 4, CageTrap = 5,
        ShackleTrap = 6
    }

    export enum CCsEnum {
        Root = 0, Wound = 1, Knockback = 2, Shackle = 3, Knockdown = 4, Silence = 5, Levitate = 6, SplitSunder= 7, Stun= 8
    }
//}
