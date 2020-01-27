using System;
using System.Collections.Generic;
using D4St_Api.Models.Enums;
using D4ST_Api.Models;
using D4ST_Api.Models.Enums;
using D4ST_Api.Models.Helpers;
using D4ST_Api.Models.StatCalculators;

namespace D4St_Api.Models.StatCalculators
{
    public static class SpellPowerDataCalculator
    {
        private static Random _randA;
        private static Random randA { get { if (_randA == null) _randA = new Random(); return _randA; } }
        private static Random _randB;
        private static Random randB { get { if (_randB == null) _randB = new Random(); return _randB; } }
        private static Random _randC;
        private static Random randC { get { if (_randC == null) _randC = new Random(); return _randC; } }

        public static SkillPowerAffixData GetPowerAffixesForSkill(ClassTypeEnum classType, SkillCastTypeEnum skillCastType, Skill skillStat) {
            var skillPowerAffixData = new SkillPowerAffixData();
            var skillMetadata = new List<AffixMetadataEnum>();
                
            var skillData = skillStat.SkillData;
            var isHighTier = skillData.Tier > 2;
            var isHighCd = DecimalHelper.RoundToDecimals(skillData.CD / skillData.Charges, 2) >= skillData.Tier + 2;
            var isHighCost = DecimalHelper.RoundToDecimals(skillData.Cost / skillData.Charges, 2) >= 2*skillData.Tier + 3;
            var isHit = skillStat.CastType == SkillCastTypeEnum.OnHit;
            var isProjectile = classType != ClassTypeEnum.Ranged ? new List<SkillCastTypeEnum>{ SkillCastTypeEnum.Projectile, SkillCastTypeEnum.Melee }.Contains(skillStat.CastType)
                                            : skillStat.CastType == SkillCastTypeEnum.Projectile;
            var isCharacterProjectile = skillStat.CastType == SkillCastTypeEnum.ProjectileCharacter;
            var isStrong = (skillData.From + skillData.Tier / 2) > skillData.Tier * 4;
            var isWeak = skillData.To > skillData.From * 2 && (skillData.From + skillData.Tier / 2) <= skillData.Tier * 3;
            var isDoA = skillStat.CastType == SkillCastTypeEnum.CastLocation || (skillData.Tier > 2 && skillStat.CastType == SkillCastTypeEnum.MeleeAoE);
            var isDoT = skillData.Duration != 0;
            var isCC = new List<SkillCastTypeEnum> { SkillCastTypeEnum.MeleeAoE, SkillCastTypeEnum.Melee }.Contains(skillStat.CastType) && skillData.Duration != 0;
            var isUltimate = skillStat.CastType == SkillCastTypeEnum.Ultimate;
            var isBuff = skillStat.CastType == SkillCastTypeEnum.BuffDebuff;

            var procChance = 0.0m;
            
            var procsOnDeath = false;

            foreach (var powerType in new List<PowerTypesEnum>{ PowerTypesEnum.AngelicPower, PowerTypesEnum.DemonicPower, PowerTypesEnum.AncestralPower})
            {
                procChance = isStrong ? 0.10m : isWeak ? 0.22m : 0.15m;
                
                var rand = powerType == PowerTypesEnum.AngelicPower ? randA : powerType == PowerTypesEnum.DemonicPower ? randB : randC;
                if (!isHighTier)
                    procChance -= 0.05m;
                if (skillStat.CastType == SkillCastTypeEnum.OnHit || skillStat.CastType == SkillCastTypeEnum.Projectile)
                    procChance += rand.Next(3, 8) * 0.01m;

                if (!isHighTier)
                    procChance -= 0.05m;
                if (skillStat.CastType == SkillCastTypeEnum.OnHit || skillStat.CastType == SkillCastTypeEnum.Projectile)
                    procChance += rand.Next(3, 8) * 0.01m;

                // Make sure percentages are somwhat diverse
                var randFactor = (rand.Next(0, 9) - 5)/100;
                procChance += randFactor;

                procsOnDeath = rand.Next(1, 10) % 3 == 0;
                if (procsOnDeath)
                    skillMetadata.Add(AffixMetadataEnum.ProcsOnDeath);
                if (isProjectile)
                    skillMetadata.Add(AffixMetadataEnum.Projectile);
                if (isDoA)
                    skillMetadata.Add(AffixMetadataEnum.DoA);
                if (isDoT)
                    skillMetadata.Add(AffixMetadataEnum.HasDoT);

                var affixProcData = new SkillAffixProcStat();
                var selectedAffix = string.Empty;

                if (!isHighTier) {
                    if (isCC) selectedAffix = calculateAffix1(powerType, skillMetadata, rand, ref affixProcData);
                    else selectedAffix = calculateAffix2(powerType, skillMetadata, rand, ref affixProcData);
                }
                else {
                    // HIGH TIER abilities
                    if (isCC) selectedAffix = calculateAffix3(powerType, skillMetadata, rand, ref affixProcData);
                    else selectedAffix = calculateAffix4(powerType, skillMetadata, rand, ref affixProcData);

                    if (selectedAffix.Length == 0)
                    {
                        var name = skillStat.Name;
                    }

                    if (selectedAffix == EnumHelper.GetName<LBsEnum>(LBsEnum.RandomShoutOrCry))
                    {
                        affixProcData.Duration = 3 + (skillData.Tier - 1) * 2.5m;
                        affixProcData.ProcsBuff = true;
                        affixProcData.Duration = 2 + DecimalHelper.RoundToDecimals(rand.Next(85, 170)/100 * skillData.Tier * 3, 2);
                        if (!isHighTier)
                            procChance -= 0.10m;
                    }
                    if (selectedAffix == EnumHelper.GetName<LBsEnum>(LBsEnum.OtherRandomLPROnDeathForX))
                    {
                        var apRand = isProjectile ? 12 : isDoT ? 10 : 9;// : isDoA ? 9 : 10;
                        selectedAffix = EnumHelper.GetName<LPRsEnum>((LPRsEnum)rand.Next(0, apRand));
                        affixProcData.Duration = 3 + (skillData.Tier - 1) * 2.5m;
                        if (isUltimate)
                        {
                            procChance += 0.1m;
                            affixProcData.Duration *= 1.25m;
                            affixProcData.Stackable = true;
                        }
                        affixProcData.ProcsBuff = true;
                    }
                    if (selectedAffix == EnumHelper.GetName<LDBsEnum>(LDBsEnum.LowPercCastRandomEP))
                    {
                        selectedAffix = EnumHelper.GetName<EPs_HighDBsEnum>((EPs_HighDBsEnum)rand.Next(0, isHighTier ? 7 : 3));
                        if (!isHighTier)
                            procChance -= 0.05m;
                    }
                    if (selectedAffix == EnumHelper.GetName<EPs_HighDBsEnum>(EPs_HighDBsEnum.RandomCC)) {
                        selectedAffix = EnumHelper.GetName<CCsEnum>((CCsEnum)rand.Next(0, isHighTier ? 4 : 2));
                        affixProcData.Duration = DecimalHelper.RoundToDecimals(rand.Next(85, 140)/100 * skillData.Tier, 2);
                    }
                    if (selectedAffix == EnumHelper.GetName<EPs_HighDBsEnum>(EPs_HighDBsEnum.RandomCurse)) {
                        selectedAffix = EnumHelper.GetName<CursesEnum>((CursesEnum)rand.Next(0, isHighTier ? 9 : 3));
                        affixProcData.Duration = DecimalHelper.RoundToDecimals(rand.Next(85, 170)/100 * skillData.Tier, 2);
                    }
                    if (selectedAffix == EnumHelper.GetName<EPs_HighDBsEnum>(EPs_HighDBsEnum.RandomTotemOrBanner)) {
                        selectedAffix = EnumHelper.GetName<CursesEnum>((CursesEnum)rand.Next(0, isHighTier ? 9 : 3));
                        affixProcData.Duration = 2 + DecimalHelper.RoundToDecimals(rand.Next(85, 170)/100 * skillData.Tier * 3, 2);
                        if (!isHighTier)
                            procChance -= 0.10m;
                    }
                }

                affixProcData.ProcChance = procChance * 100; //In %
                affixProcData.ProcsOnDeath = procsOnDeath;
                affixProcData.PowerType = powerType;
                // if (procsOnDeath && (isBuff || isDoT)) {
                //     affixProcData.Duration = skillData.Duration;
                // }
                affixProcData.SelectedAffix = selectedAffix;

                if (powerType == PowerTypesEnum.AngelicPower) {
                    skillPowerAffixData.AngelicProcAffix = affixProcData;
                }
                if (powerType == PowerTypesEnum.DemonicPower) {
                    skillPowerAffixData.DemonicProcAffix = affixProcData;
                }
                if (powerType == PowerTypesEnum.AncestralPower) {
                    skillPowerAffixData.AncestralProcAffix = affixProcData;
                }
            }

            if (isHit)
                skillPowerAffixData.SkillMetadata.Add(AffixMetadataEnum.HitProc);
            if (procsOnDeath)
                skillPowerAffixData.SkillMetadata.Add(AffixMetadataEnum.ProcsOnDeath);
            if (skillStat.CastType == SkillCastTypeEnum.Melee)
                skillPowerAffixData.SkillMetadata.Add(AffixMetadataEnum.Melee);
            if (skillStat.CastType == SkillCastTypeEnum.MeleeAoE)
                skillPowerAffixData.SkillMetadata.Add(AffixMetadataEnum.AoE);
            if (skillStat.CastType == SkillCastTypeEnum.CastLocation)
                skillPowerAffixData.SkillMetadata.Add(AffixMetadataEnum.DoA);
            if (skillStat.CastType == SkillCastTypeEnum.Summon)
                skillPowerAffixData.SkillMetadata.Add(AffixMetadataEnum.Summon);
            if (isBuff)
                skillPowerAffixData.SkillMetadata.Add(AffixMetadataEnum.BuffDebuff);
            if (isUltimate)
                skillPowerAffixData.SkillMetadata.Add(AffixMetadataEnum.Ultimate);
            if (isHighCd)
                skillPowerAffixData.SkillMetadata.Add(AffixMetadataEnum.HighCD);
            if (isHighCost)
                skillPowerAffixData.SkillMetadata.Add(AffixMetadataEnum.HighCost_Spender);
            if (isWeak)
                skillPowerAffixData.SkillMetadata.Add(AffixMetadataEnum.HighProcRate);
            if (isStrong)
                skillPowerAffixData.SkillMetadata.Add(AffixMetadataEnum.HighDamage);
            if (isCC)
                skillPowerAffixData.SkillMetadata.Add(AffixMetadataEnum.CC);
            if (!isCC && (isDoA || isDoT))
                skillPowerAffixData.SkillMetadata.Add(AffixMetadataEnum.DoA);
            if (isProjectile)
                skillPowerAffixData.SkillMetadata.Add(AffixMetadataEnum.Projectile);
            if (isCharacterProjectile)
                skillPowerAffixData.SkillMetadata.Add(AffixMetadataEnum.ProjectileCharacter);
            
            return skillPowerAffixData;
        }

        private static string calculateAffix1(PowerTypesEnum powerType, List<AffixMetadataEnum> md, Random rand, ref SkillAffixProcStat affixProcData) {
            var isHighCd = md.Contains(AffixMetadataEnum.HighCD);
            var procsOnDeath = md.Contains(AffixMetadataEnum.ProcsOnDeath);
            var selectedAffix = powerType == PowerTypesEnum.AngelicPower
                            ? EnumHelper.GetName<LPRsEnum>((LPRsEnum)rand.Next(0, 7))
                            : EnumHelper.GetName<LDBsEnum>((LDBsEnum)rand.Next(0, 7));
            if (powerType == PowerTypesEnum.AncestralPower) {
                var randEP = EnumHelper.GetName<EPs_HighDBsEnum>((EPs_HighDBsEnum)rand.Next(0, 3));
                var randLB = EnumHelper.GetName<LBsEnum>((LBsEnum)rand.Next(5, isHighCd ? 8 : 7));
                if (randLB == EnumHelper.GetName(LBsEnum.OtherRandomLPROnDeathForX))
                {
                    randLB = EnumHelper.GetName<LPRsEnum>((LPRsEnum)rand.Next(0, 10));
                    affixProcData.IsBuff = true;
                }
                
                var randCurse = EnumHelper.GetName<CursesEnum>((CursesEnum)rand.Next(0, 3));
                var selected = rand.Next(1, 9);
                selectedAffix = (selected % 3 == 0) ? randEP : (selected % 3 == 1) ? randLB : randCurse;
            }

            return selectedAffix;
        }

        private static string calculateAffix2(PowerTypesEnum powerType, List<AffixMetadataEnum> md, Random rand, ref SkillAffixProcStat affixProcData) {
            var isHighCd = md.Contains(AffixMetadataEnum.HighCD);
            var procsOnDeath = md.Contains(AffixMetadataEnum.ProcsOnDeath);
            var isDoT = md.Contains(AffixMetadataEnum.HasDoT);
            var isProjectile = md.Contains(AffixMetadataEnum.Projectile);
            var apRand = isProjectile ? 12 : isDoT ? 10 : 9;// : isDoA ? 9 : 10;
            var selectedAffix = powerType == PowerTypesEnum.AngelicPower
                            ? procsOnDeath ? EnumHelper.GetName<LPRsEnum>((LPRsEnum)rand.Next(0, apRand))
                                            : EnumHelper.GetName<LBsEnum>((LBsEnum)rand.Next(0, 7))
                            : procsOnDeath
                                ? EnumHelper.GetName<EPs_HighDBsEnum>((EPs_HighDBsEnum)rand.Next(0, 6))
                                : EnumHelper.GetName<CCsEnum>((CCsEnum)rand.Next(0, 3));

            if (powerType == PowerTypesEnum.AncestralPower) {
                var randCC = EnumHelper.GetName<CCsEnum>((CCsEnum)rand.Next(0, 3));
                var randLB = EnumHelper.GetName<LBsEnum>((LBsEnum)rand.Next(0, 3));
                var randEP = EnumHelper.GetName<EPs_HighDBsEnum>((EPs_HighDBsEnum)rand.Next(0, 3));
                var selected = rand.Next(1, 9);
                selectedAffix = (selected % 3 == 0) ? randEP : (selected % 3 == 1) ? randLB : randCC;
            }
            return selectedAffix;
        }

        private static string calculateAffix3(PowerTypesEnum powerType, List<AffixMetadataEnum> md, Random rand, ref SkillAffixProcStat affixProcData) {
            var isHighCd = md.Contains(AffixMetadataEnum.HighCD);
            var procsOnDeath = md.Contains(AffixMetadataEnum.ProcsOnDeath);
            var selectedAffix = powerType == PowerTypesEnum.AngelicPower
                        ? EnumHelper.GetName<LBsEnum>((LBsEnum)rand.Next(0, isHighCd ? 9 : 8))
                        : EnumHelper.GetName<EPs_HighDBsEnum>((EPs_HighDBsEnum)rand.Next(0, 6));

            if (powerType == PowerTypesEnum.AncestralPower) {
                var randEP = EnumHelper.GetName<EPs_HighDBsEnum>((EPs_HighDBsEnum)rand.Next(0, 3));
                var randLB = EnumHelper.GetName<LBsEnum>((LBsEnum)rand.Next(3, isHighCd ? 9 : 8));
                if (randLB == EnumHelper.GetName(LBsEnum.OtherRandomLPROnDeathForX))
                    randLB = EnumHelper.GetName<LPRsEnum>((LPRsEnum)rand.Next(0, 10));
                
                var randCurse = EnumHelper.GetName<CursesEnum>((CursesEnum)rand.Next(4, 9));
                var selected = rand.Next(1, 9);
                selectedAffix = (selected % 3 == 0) ? randEP : (selected % 3 == 1) ? randLB : randCurse;
            }
            return selectedAffix;
        }

        private static string calculateAffix4(PowerTypesEnum powerType, List<AffixMetadataEnum> md, Random rand, ref SkillAffixProcStat affixProcData) {
            var isHighCd = md.Contains(AffixMetadataEnum.HighCD);
            var procsOnDeath = md.Contains(AffixMetadataEnum.ProcsOnDeath);
            var selectedAffix = powerType == PowerTypesEnum.AngelicPower
                            ? EnumHelper.GetName<LBsEnum>((LBsEnum)rand.Next(0, isHighCd ? 9 : 8))
                            : procsOnDeath
                                ? EnumHelper.GetName<EPs_HighDBsEnum>((EPs_HighDBsEnum)rand.Next(0, 5))
                                : EnumHelper.GetName<CCsEnum>((CCsEnum)rand.Next(0, 3));

            if (powerType == PowerTypesEnum.AncestralPower) {
                var randCC = EnumHelper.GetName<CCsEnum>((CCsEnum)rand.Next(0, 3));
                var randLB = EnumHelper.GetName<LBsEnum>((LBsEnum)rand.Next(3, isHighCd ? 9 : 8));
                var randEP = EnumHelper.GetName<EPs_HighDBsEnum>((EPs_HighDBsEnum)rand.Next(3, 6));
                var selected = rand.Next(1, 9);
                selectedAffix = (selected % 3 == 0) ? randEP : (selected % 3 == 1) ? randLB : randCC;
            }
            return selectedAffix;
        }
    }
}
