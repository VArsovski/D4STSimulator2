namespace D4St_Api.Models.Enums
{
    public enum PrimaryAffixEnum
    {
        Explode = 1,
        Slow = 2,
        Freeze = 3,
        Knockback = 5,
        Pierce = 6,
        Stun = 7,
        LeaveTrail = 8,
        Root = 9,
        Blind = 10,
        Wound = 11,
    }

    public enum ReturnAffixEnum {
        IncrAffixDamage = 1,
        IncrAffixRadius = 2,
        IncrAffixDuration = 3,
        IncrArmor = 4,
        IncrMovement = 5,
        GainResource = 6,
        GainStamina = 7,
        GainDPS = 8,
        GainLifeReturn = 9,
        ProcCDRed = 10,
        GainXtraCharge = 11,
        IncrRandomRes = 12,
        ProcChance = 13
    }

    public enum ProcAffixEnum {
        DecrRandomRes = 1,
        BoomerangEffect = 2,
        ProcBlind = 3,
        DecrArmor = 4,
        CorpseExplosion = 5,
        SolidifyCorpse = 6,
        SplitSunder = 7,
        Multicast = 8,
        Horrify = 9,
        Weaken = 10,
        Silence = 11        
    }
}
