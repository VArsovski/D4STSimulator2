using System;
using System.Collections.Generic;
using System.Linq;
using D4ST_Api.Models.Enums;

namespace D4ST_Api.Models.Helpers
{
    public static class SkillStatHelper
    {
        private static Random _randA; private static Random randA { get { if (_randA == null) _randA = new Random(); return _randA; } }
        private static Random _randB; private static Random randB { get { if (_randB == null) _randB = new Random(); return _randB; } }
        private static Random _randC; private static Random randC { get { if (_randC == null) _randC = new Random(); return _randC; } }
        
        public static Random GetRNG(PowerTypesEnum powerType)
        {
            var rand = powerType == PowerTypesEnum.AngelicPower ? randA : powerType == PowerTypesEnum.DemonicPower ? randB : randC;
            return rand;
        }

        public static decimal GetProcChance(int affixLevel, PowerTypesEnum powerType, bool isHighTier, List<CastTypesEnum> castTypes, List<AffixMetadataEnum> skillMetadata) {
            var isStrong = skillMetadata.Contains(AffixMetadataEnum.IsStrong);
            var isWeak = skillMetadata.Contains(AffixMetadataEnum.IsWeak);
            var procChance = isStrong ? 10 : isWeak ? 22 : 15;
            
            var rand = powerType == PowerTypesEnum.AngelicPower ? randA : powerType == PowerTypesEnum.DemonicPower ? randB : randC;
            if (!isHighTier)
                procChance -= 4;
            if (castTypes.Contains(CastTypesEnum.MeleeHit) || castTypes.Contains(CastTypesEnum.Projectile))
                procChance += rand.Next(3, 8);

            // Make sure percentages are somewhat diverse
            var randFactor = (rand.Next(0, 7) - 4);
            procChance += randFactor;

            // Not the first upgrade, but make sure no less than 8% upgrade
            if (affixLevel != 1) {
                procChance -= 4;
                procChance = Math.Max(procChance, 8);
            }

            return procChance;
        }

        // public static List<AffixMetadataEnum> GetSkillMetadata(PowerTypesEnum powerType, ClassTypeEnum classType, SkillDTO skillStat) {
        //     var skillMetadata = new List<AffixMetadataEnum>();
        //     var skillData = skillStat.SkillData.PowerData;
        //     var isHighTier = skillData.Tier > 2;
        //     var isHighCd = DecimalHelper.RoundToDecimals(skillData.CD / skillData.Charges, 2) >= skillData.Tier + 2;
        //     var isHighCost = DecimalHelper.RoundToDecimals(skillData.Cost / skillData.Charges, 2) >= 2*skillData.Tier + 3;
        //     var isHit = skillStat.CastType == CastTypesEnum.MeleeHit;
        //     var isProjectile = classType != ClassTypeEnum.Sorceress ? new List<CastTypesEnum>{ CastTypesEnum.Projectile, CastTypesEnum.MeleeHit }.Contains(skillStat.CastType)
        //                                     : skillStat.CastType == CastTypesEnum.Projectile;
        //     var isCharacterProjectile = skillStat.CastType == CastTypesEnum.MovementOrPeel;
        //     var isStrong = (skillData.From + skillData.Tier / 2) > skillData.Tier * 4;
        //     var isWeak = skillData.To > skillData.From * 2 && (skillData.From + skillData.Tier / 2) <= skillData.Tier * 3;
        //     var isDoA = skillStat.CastType == CastTypesEnum.CastLocation || (skillData.Tier > 2 && skillStat.CastType == CastTypesEnum.MeleeAoE);
        //     var isDoT = skillData.Duration != 0;
        //     var isUltimate = skillStat.CastType == CastTypesEnum.Ultimate;
        //     var isBuff = skillStat.CastType == CastTypesEnum.BuffDebuff;
        //     var isCC = skillStat.SkillData.PowerData.IsCC;
        //     // var procsOnDeath = false;

        //     if (isProjectile)
        //         skillMetadata.Add(AffixMetadataEnum.Projectile);
        //     if (isDoA)
        //         skillMetadata.Add(AffixMetadataEnum.DoA);
        //     if (isDoT)
        //         skillMetadata.Add(AffixMetadataEnum.HasDoT);
        //     if (isHit)
        //         skillMetadata.Add(AffixMetadataEnum.HitProc);
        //     if (skillStat.CastType == CastTypesEnum.Melee)
        //         skillMetadata.Add(AffixMetadataEnum.Melee);
        //     if (skillStat.CastType == CastTypesEnum.MeleeAoE)
        //         skillMetadata.Add(AffixMetadataEnum.AoE);
        //     if (skillStat.CastType == CastTypesEnum.CastLocation)
        //         skillMetadata.Add(AffixMetadataEnum.DoA);
        //     if (skillStat.CastType == CastTypesEnum.Summon)
        //         skillMetadata.Add(AffixMetadataEnum.Summon);
        //     if (isBuff)
        //         skillMetadata.Add(AffixMetadataEnum.BuffDebuff);
        //     if (isUltimate)
        //         skillMetadata.Add(AffixMetadataEnum.Ultimate);
        //     if (isHighCd)
        //         skillMetadata.Add(AffixMetadataEnum.HighCD);
        //     if (isHighCost)
        //         skillMetadata.Add(AffixMetadataEnum.HighCD);
        //     if (isWeak)
        //         skillMetadata.Add(AffixMetadataEnum.IsWeak);
        //     if (isStrong)
        //         skillMetadata.Add(AffixMetadataEnum.HighDamage);
        //     if (isCC)
        //         skillMetadata.Add(AffixMetadataEnum.CC);
        //     if (!isCC && (isDoA || isDoT))
        //         skillMetadata.Add(AffixMetadataEnum.DoA);
        //     if (isProjectile)
        //         skillMetadata.Add(AffixMetadataEnum.Projectile);
        //     if (isCharacterProjectile)
        //         skillMetadata.Add(AffixMetadataEnum.ProjectileCharacter);

        //     return skillMetadata.Distinct().ToList();
        // }
    }
}
