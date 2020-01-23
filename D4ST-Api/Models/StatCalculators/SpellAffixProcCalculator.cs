using System.Collections.Generic;
using D4St_Api.Models.Enums;
using D4ST_Api.Models.StatCalculators;

namespace D4St_Api.Models.StatCalculators
{
    public class SpellAffixProcCalculator
    {
        private List<ISkillAffixProcStat> GetPossibleAffixesList(AffixProcTypeEnum affixProcType) {
            // TODO: Set Valuable Pairs for <SkillId, AffixProcTypeEnum> => PrimaryAffixProcType [Read from Copy-Pasted Rich-Comment down below]
            // THEN: Do down below.. [Here you'll need DOUBLE RANDOM GENERATORS]
            var returnData = new List<KeyValuePair<PowerAffixesSkillStat, SkillAffixStatData>>();

            var angelicAffixes = new List<PowerAffixesSkillStat>();


            var availableSkillProcCombinations = new List<ISkillAffixProcStat>();
            var onHitAffixes = new List<KeyValuePair<AffixProcTypeEnum, PrimaryAffixEnum>>();           // All the OnHitCombinations
            var castLocationAffixes = new List<KeyValuePair<AffixProcTypeEnum, PrimaryAffixEnum>>();    // All the OnCastCombinations
            var travelProcffixes = new List<KeyValuePair<AffixProcTypeEnum, PrimaryAffixEnum>>();       // All the Projectile/Travel Combinations
            // TODO: Concat all 3 dictionaries into 1, then set Secondary AffixTypes based on pair of AffixProcTypeEnum and PrimaryAffixEnum

            return availableSkillProcCombinations;
        }
    }
}

//     public enum PrimaryAffixEnum
//     {
//         // HIT ONLY
//         Explode = 1,                // ADA [%HP amount, AoE radius, Proc Chance]
//         Slow = 2,                   // ADA [Amount, Duration, %Silence]
//         Freeze = 3,                 // ADA [Incr ColdRes, Duration, %Wound]
//         Stun = 4,                   // ADA [Incr CC Red, %Multicast, Incr ProcRate]
//         Knockback = 5,              // ADA [Incr Armor, Distance, Incr Movement]

//         // TRAVEL ONLY ?
//         Pierce = 7,                 // ADA [Boomerang effect, % CorpseExpl, %Multicast]
//         SplitSunder = 8,            // ADA [Gain resource, %Stun, Gain stamina]
//         LeaveTrail = 9,             // ADA [Incr Movement, %SolidifyCorpse, Horrify]

//         // [ALL] ONHIT, ONTRAVEL, ONCAST (AoE MELEE Cast)
//         Root = 12,                   // ADA [Gain xtra charge, Horrify, SolidifyCorpse]
//         Blind = 13,                  // ADA [Gain Stamina, Slow, %AoE]
//         Wound = 15,                  // ADA [Incr DPS%, ExplodeCorpse, Blind]
//         Silence = 16,                // ADA [ResourceReturn, Horrify, Blind, Gain xtra charge]

//         // HIT & TRAVEL [Don't see why not AoE melee either]

//     }

//     public enum SecondaryAffixEnum {
// // ADA [%HP amount, AoE radius, Proc Chance]
// // ADA [Amount, Duration, %Silence]
// // ADA [Incr ColdRes, Duration, %Wound]
// // ADA [Incr CC Red, %Multicast, Incr ProcRate]
// // ADA [Incr Armor, Distance, Incr Movement]
// // ADA [Boomerang effect, % CorpseExpl, %Multicast]
// // ADA [Gain resource, %Stun, Gain stamina]
// // ADA [Incr Movement, %SolidifyCorpse, Horrify]
// //CAST (AoE MELEE Cast)
//  // ADA [Gain xtra charge, Horrify, SolidifyCorpse]
//  // ADA [Gain Stamina, Slow, %AoE]
//  // ADA [Incr DPS%, ExplodeCorpse, Blind]
//  // ADA [ResourceReturn, Horrify, Blind, Gain xtra charge]
// //hy not AoE melee either]
//  // ADA [CD red., MovementSpeed, AoEslow]
//  // ADA [%DPS incr, CD red., Knockback]
//  // ADA [Incr Movement, Distance & Duration, %Multicast]
//  // ADA [Gain Armor, %Silence, Incr. ProcChance]
//  // ADA [IncrRes, DecrRes, CD red]
//         IncrAffixDamage = 1,
//         IncrAffixRadius = 2,
//         IncrAffixDuration = 3,
//         IncrArmor = 4,
//         IncrMovement = 5,
//         GainResource = 6,
//         GainStamina = 7,
//         GainDPS = 8,
//         GainLifeReturn = 9,
//         ProcCDRed = 10,
//         GainXtraCharge = 11,
//         IncrRandomRes = 12,
//         DecrRandomRes = 13,
//         BoomerangEffect = 14,
//         ProcBlind = 15,
//         DecrArmor = 16,
//         ProcCorpseExplosion = 17,
//         ProcSolidifyCorpse = 18,
//         ProcMulticast = 19,
//         Horrify = 20,
//         Weaken = 22,
//     }
