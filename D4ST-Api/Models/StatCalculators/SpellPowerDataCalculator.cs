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

        public static SkillPowerAffixData GetPowerAffixesForSkill(PowerTypesEnum powerType, ClassTypeEnum classType, Skill skillStat) {
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
            var isUltimate = skillStat.CastType == SkillCastTypeEnum.Ultimate;
            var isBuff = skillStat.CastType == SkillCastTypeEnum.BuffDebuff;
            var isCC = skillStat.SkillData.IsCC;
            var procChance = 0.0m;
            var procsOnDeath = false;
            var procsBuff = false;

            // foreach (var powerType in new List<PowerTypesEnum>{ PowerTypesEnum.AngelicPower, PowerTypesEnum.DemonicPower, PowerTypesEnum.AncestralPower})
            // {
                procChance = isStrong ? 10 : isWeak ? 22 : 15;
                
                var rand = powerType == PowerTypesEnum.AngelicPower ? randA : powerType == PowerTypesEnum.DemonicPower ? randB : randC;
                if (!isHighTier)
                    procChance -= 5;
                if (skillStat.CastType == SkillCastTypeEnum.OnHit || skillStat.CastType == SkillCastTypeEnum.Projectile)
                    procChance += rand.Next(3, 8) * 0.01m;
                if (skillStat.CastType == SkillCastTypeEnum.OnHit || skillStat.CastType == SkillCastTypeEnum.Projectile)
                    procChance += rand.Next(3, 8) * 0.01m;

                // Make sure percentages are somewhat diverse
                var randFactor = (rand.Next(0, 9) - 5);
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

                var selectedPowerData = new SkillAffixProcStat();
                var selectedAffix = string.Empty;

                if (!isHighTier) {
                    if (isCC) selectedAffix = calculateAffix2(powerType, skillMetadata, rand, ref selectedPowerData);
                    else selectedAffix = calculateAffix1(powerType, skillMetadata, rand, ref selectedPowerData);
                }
                else {
                    // HIGH TIER abilities
                    if (isCC) selectedAffix = calculateAffix4(powerType, skillMetadata, rand, ref selectedPowerData);
                    else selectedAffix = calculateAffix3(powerType, skillMetadata, rand, ref selectedPowerData);

                    if (selectedAffix == EnumHelper.GetName<LBsEnum>(LBsEnum.RandomShoutOrCry))
                    {
                        procsBuff = true;
                    }
                    if (selectedAffix == EnumHelper.GetName<LBsEnum>(LBsEnum.OtherRandomLPROnDeathForX))
                    {
                        var apRand = isProjectile ? 12 : isDoT ? 10 : 9;// : isDoA ? 9 : 10;
                        selectedAffix = EnumHelper.GetName<LPRsEnum>((LPRsEnum)rand.Next(0, apRand));
                        if (isUltimate)
                        {
                            procChance += 0.1m;
                            selectedPowerData.Stackable = true;
                        }
                        procsBuff = true;
                    }
                    if (selectedAffix == EnumHelper.GetName<LDBsEnum>(LDBsEnum.LowPercCastRandomEP))
                    {
                        selectedAffix = EnumHelper.GetName<EPs_HighDBsEnum>((EPs_HighDBsEnum)rand.Next(0, isHighTier ? 7 : 3));
                        if (!isHighTier)
                            procChance -= 0.05m;
                    }
                    if (selectedAffix == EnumHelper.GetName<EPs_HighDBsEnum>(EPs_HighDBsEnum.RandomCC)) {
                        selectedAffix = EnumHelper.GetName<CCsEnum>((CCsEnum)rand.Next(0, isHighTier ? 4 : 2));
                    }
                    if (selectedAffix == EnumHelper.GetName<EPs_HighDBsEnum>(EPs_HighDBsEnum.RandomCurse)) {
                        selectedAffix = EnumHelper.GetName<CursesEnum>((CursesEnum)rand.Next(0, isHighTier ? 9 : 3));
                    }
                    if (selectedAffix == EnumHelper.GetName<EPs_HighDBsEnum>(EPs_HighDBsEnum.RandomTotemOrBanner)) {
                        selectedAffix = EnumHelper.GetName<CursesEnum>((CursesEnum)rand.Next(0, isHighTier ? 9 : 3));
                        if (!isHighTier)
                            procChance -= 0.10m;
                    }
                }

                if (procsOnDeath)
                {
                    skillMetadata.Add(AffixMetadataEnum.ProcsOnDeath);
                    // TODO: Recognize buffs/debuffs here and add BuffDebuff properly
                }
                if (procsBuff)
                    skillMetadata.Add(AffixMetadataEnum.BuffDebuff);

                if (isHit)
                    skillMetadata.Add(AffixMetadataEnum.HitProc);
                if (skillStat.CastType == SkillCastTypeEnum.Melee)
                    skillMetadata.Add(AffixMetadataEnum.Melee);
                if (skillStat.CastType == SkillCastTypeEnum.MeleeAoE)
                    skillMetadata.Add(AffixMetadataEnum.AoE);
                if (skillStat.CastType == SkillCastTypeEnum.CastLocation)
                    skillMetadata.Add(AffixMetadataEnum.DoA);
                if (skillStat.CastType == SkillCastTypeEnum.Summon)
                    skillMetadata.Add(AffixMetadataEnum.Summon);
                if (isBuff || procsBuff)
                    skillMetadata.Add(AffixMetadataEnum.BuffDebuff);
                if (isUltimate)
                    skillMetadata.Add(AffixMetadataEnum.Ultimate);
                if (isHighCd)
                    skillMetadata.Add(AffixMetadataEnum.HighCD);
                if (isHighCost)
                    skillMetadata.Add(AffixMetadataEnum.HighCost_Spender);
                if (isWeak)
                    skillMetadata.Add(AffixMetadataEnum.HighProcRate);
                if (isStrong)
                    skillMetadata.Add(AffixMetadataEnum.HighDamage);
                if (isCC)
                    skillMetadata.Add(AffixMetadataEnum.CC);
                if (!isCC && (isDoA || isDoT))
                    skillMetadata.Add(AffixMetadataEnum.DoA);
                if (isProjectile)
                    skillMetadata.Add(AffixMetadataEnum.Projectile);
                if (isCharacterProjectile)
                    skillMetadata.Add(AffixMetadataEnum.ProjectileCharacter);
                
                skillPowerAffixData.PowerData = new SkillAffixProcStat(procChance, powerType, selectedAffix, skillData, skillMetadata);
                var skillUp = skillData;
                if (powerType == PowerTypesEnum.AngelicPower) { skillUp.AngelicPower += 1; }
                else if (powerType == PowerTypesEnum.DemonicPower) { skillUp.DemonicPower += 1; }
                else if (powerType == PowerTypesEnum.AncestralPower) { skillUp.AncestralPower += 1; }

                skillPowerAffixData.PowerUp = new SkillAffixProcStat(procChance, powerType, selectedAffix, skillData, skillMetadata);
            //}

            return skillPowerAffixData;
        }

        private static string calculateAffix1(PowerTypesEnum powerType, List<AffixMetadataEnum> md, Random rand, ref SkillAffixProcStat affixProcData) {
            var isHighCd = md.Contains(AffixMetadataEnum.HighCD);
            var procsOnDeath = md.Contains(AffixMetadataEnum.ProcsOnDeath);
            var isDoT = md.Contains(AffixMetadataEnum.HasDoT);
            var isProjectile = md.Contains(AffixMetadataEnum.Projectile);
            var apRand = isProjectile ? 12 : isDoT ? 10 : 9;// : isDoA ? 9 : 10;
            var selectedAffix = string.Empty;
            if (powerType == PowerTypesEnum.AngelicPower)
            {
                selectedAffix = procsOnDeath ? EnumHelper.GetName<LPRsEnum>((LPRsEnum)rand.Next(0, apRand))
                                            : EnumHelper.GetName<LBsEnum>((LBsEnum)rand.Next(0, 7));
            }
            if (powerType == PowerTypesEnum.DemonicPower)
            {
                selectedAffix = EnumHelper.GetName<LDBsEnum>((LDBsEnum)rand.Next(0, 9));
                                // : EnumHelper.GetName<CCsEnum>((CCsEnum)rand.Next(3, 6));
            }

            if (powerType == PowerTypesEnum.AncestralPower) {
                var randCurse = EnumHelper.GetName<CursesEnum>((CursesEnum)rand.Next(0, 3));
                var randCC = procsOnDeath ? EnumHelper.GetName<EPs_HighDBsEnum>((EPs_HighDBsEnum)rand.Next(0, 3)) : EnumHelper.GetName<CCsEnum>((CCsEnum)rand.Next(0, 3));
                var randLB = EnumHelper.GetName<LBsEnum>((LBsEnum)rand.Next(0, 3));
                var randEP = EnumHelper.GetName<EPs_HighDBsEnum>((EPs_HighDBsEnum)rand.Next(0, 3));
                var selected = rand.Next(1, 9);
                selectedAffix = (selected % 3 == 0) ? (procsOnDeath ? randEP : randCurse) : (selected % 3 == 1) ? randLB : randCC;
            }
            return selectedAffix;
        }

        private static string calculateAffix2(PowerTypesEnum powerType, List<AffixMetadataEnum> md, Random rand, ref SkillAffixProcStat affixProcData) {
            var isHighCd = md.Contains(AffixMetadataEnum.HighCD);
            var procsOnDeath = md.Contains(AffixMetadataEnum.ProcsOnDeath);
            var selectedAffix = "";
            if (powerType == PowerTypesEnum.AngelicPower)
            {
                selectedAffix = EnumHelper.GetName<LPRsEnum>((LPRsEnum)rand.Next(0, 7));
            }
            if (powerType == PowerTypesEnum.DemonicPower)
            {
                selectedAffix = EnumHelper.GetName<EPs_HighDBsEnum>((EPs_HighDBsEnum)rand.Next(0, 4));
            }
            if (powerType == PowerTypesEnum.AncestralPower) {
                var randEP = EnumHelper.GetName<EPs_HighDBsEnum>((EPs_HighDBsEnum)rand.Next(0, 3));
                var randLB = EnumHelper.GetName<LBsEnum>((LBsEnum)rand.Next(4, isHighCd ? 9 : 8));
                if (randLB == EnumHelper.GetName(LBsEnum.OtherRandomLPROnDeathForX))
                {
                    randLB = EnumHelper.GetName<LPRsEnum>((LPRsEnum)rand.Next(3, 7));
                    affixProcData.IsBuff = true;
                }
                
                var randCurse = EnumHelper.GetName<CursesEnum>((CursesEnum)rand.Next(0, 3));
                var selected = rand.Next(1, 9);
                selectedAffix = (selected % 3 == 0) ? randEP : (selected % 3 == 1) ? randLB : randCurse;
            }

            return selectedAffix;
        }
        
        private static string calculateAffix3(PowerTypesEnum powerType, List<AffixMetadataEnum> md, Random rand, ref SkillAffixProcStat affixProcData) {
            var isHighCd = md.Contains(AffixMetadataEnum.HighCD);
            var procsOnDeath = md.Contains(AffixMetadataEnum.ProcsOnDeath);
            var selectedAffix = string.Empty;
            if (powerType == PowerTypesEnum.AngelicPower)
            {
                selectedAffix = EnumHelper.GetName<LBsEnum>((LBsEnum)rand.Next(0, isHighCd ? 9 : 8));
            }
            if (powerType == PowerTypesEnum.DemonicPower)
            {
                selectedAffix = procsOnDeath
                                ? EnumHelper.GetName<EPs_HighDBsEnum>((EPs_HighDBsEnum)rand.Next(0, 4))
                                : EnumHelper.GetName<CCsEnum>((CCsEnum)rand.Next(0, 4));
            }

            if (powerType == PowerTypesEnum.AncestralPower) {
                var randCC = EnumHelper.GetName<HighTierCCAncEnum>((HighTierCCAncEnum)rand.Next(0, 4));
                var randLB = EnumHelper.GetName<LBsEnum>((LBsEnum)rand.Next(3, isHighCd ? 9 : 8));
                var randEP = EnumHelper.GetName<EPs_HighDBsEnum>((EPs_HighDBsEnum)rand.Next(3, 6));
                var selected = rand.Next(1, 9);
                selectedAffix = (selected % 3 == 0) ? randEP : (selected % 3 == 1) ? randLB : randCC;
            }
            return selectedAffix;
        }

        private static string calculateAffix4(PowerTypesEnum powerType, List<AffixMetadataEnum> md, Random rand, ref SkillAffixProcStat affixProcData) {
            var isHighCd = md.Contains(AffixMetadataEnum.HighCD);
            var procsOnDeath = md.Contains(AffixMetadataEnum.ProcsOnDeath);
            var selectedAffix = string.Empty;
            if (powerType == PowerTypesEnum.AngelicPower)
            {
                selectedAffix = EnumHelper.GetName<LBsEnum>((LBsEnum)rand.Next(0, isHighCd ? 9 : 8));
            }
            if (powerType == PowerTypesEnum.DemonicPower)
            {
                selectedAffix = EnumHelper.GetName<EPs_HighDBsEnum>((EPs_HighDBsEnum)rand.Next(0, 6));
            }

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
    }
}
