using System;
using System.Collections.Generic;
using D4ST_Api.Models.Enums;
using D4ST_Api.Models.Helpers;

namespace D4ST_Api.Models.StatCalculators
{
    public static class SpellPowerDataCalculator
    {
        public static SkillPowerAffixData GetPowerAffixesForSkill(PowerTypesEnum powerType, SkillCastTypeEnum castType, DamageSkillStat skillData, List<AffixMetadataEnum> skillMetadata) {
            var skillPowerAffixData = new SkillPowerAffixData();
            var level = (powerType == PowerTypesEnum.AngelicPower) ? skillData.AngelicPower
            : (powerType == PowerTypesEnum.DemonicPower) ? skillData.DemonicPower
            : skillData.AncestralPower;
            
            var selectedPowerData = new SkillAffixProcStat();
            var selectedAffix = string.Empty;
            var isCC = skillData.IsCC;
            var rand = SkillStatHelper.GetRNG(powerType);
            var isHighTier = skillData.Tier > 2;
            var procsBuff = false;
            var procChance = SkillStatHelper.GetProcChance(level, powerType, isHighTier, castType, skillMetadata);

            if (!isHighTier) {
                if (isCC) selectedAffix = calculateAffix2(powerType, skillMetadata, rand, ref selectedPowerData);
                else selectedAffix = calculateAffix1(powerType, skillMetadata, rand, ref selectedPowerData);
            }
            else {
                if (isCC) selectedAffix = calculateAffix4(powerType, skillMetadata, rand, ref selectedPowerData);
                else selectedAffix = calculateAffix3(powerType, skillMetadata, rand, ref selectedPowerData);
            }

            if (selectedAffix == EnumHelper.GetName<LBsEnum>(LBsEnum.RandomShoutOrCry))
                procsBuff = true;
            if (selectedAffix == EnumHelper.GetName<LBsEnum>(LBsEnum.OtherRandomLPROnDeathForX))
            {
                var isProjectile = skillMetadata.Contains(AffixMetadataEnum.Projectile);
                var isDoT = skillMetadata.Contains(AffixMetadataEnum.HasDoT);
                var isUltimate = skillMetadata.Contains(AffixMetadataEnum.Ultimate);

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

            if (procsBuff)
                skillMetadata.Add(AffixMetadataEnum.ProcsBuff);
            
            skillPowerAffixData.PowerData = new SkillAffixProcStat(procChance, powerType, selectedAffix, skillData, skillMetadata);
            var skillUp = skillData;
            if (powerType == PowerTypesEnum.AngelicPower) { skillUp.AngelicPower += 1; }
            else if (powerType == PowerTypesEnum.DemonicPower) { skillUp.DemonicPower += 1; }
            else if (powerType == PowerTypesEnum.AncestralPower) { skillUp.AncestralPower += 1; }

            skillPowerAffixData.PowerUp = new SkillAffixProcStat(procChance, powerType, selectedAffix, skillUp, skillMetadata);

            return skillPowerAffixData;
        }

        internal static SkillPowerAffixData RecalculatePowerAffixesForSkill(PowerTypesEnum powerType, SkillCastTypeEnum castType, ISkillAffixProcStat affixStat, DamageSkillStat skillData, List<AffixMetadataEnum> md)
        {
            var empoweredAffixData = new SkillPowerAffixData();
            var level = powerType == PowerTypesEnum.AngelicPower ? skillData.AngelicPower : powerType == PowerTypesEnum.DemonicPower ? skillData.DemonicPower : skillData.AncestralPower;

            var rng = SkillStatHelper.GetRNG(powerType);
            var affix = new SkillAffixProcStat();
            var isHighTier = skillData.Tier > 2;
            var procChance = affixStat.ProcChance;
            // var procBonus = SkillStatHelper.GetProcChance(level, powerType, isHighTier, castType, md);
            // procChance += procBonus;

            var selectedAffix = affixStat.SelectedAffix;

            empoweredAffixData.PowerData = new SkillAffixProcStat(procChance, powerType, selectedAffix, skillData, md);
            empoweredAffixData.PowerData.ProcAmount = affixStat.ProcAmount;
            var skillUp = skillData;
            if (powerType == PowerTypesEnum.AngelicPower) { skillUp.AngelicPower += 1; }
            else if (powerType == PowerTypesEnum.DemonicPower) { skillUp.DemonicPower += 1; }
            else if (powerType == PowerTypesEnum.AncestralPower) { skillUp.AncestralPower += 1; }

            empoweredAffixData.PowerUp = new SkillAffixProcStat(procChance, powerType, selectedAffix, skillUp, md);

            return empoweredAffixData;
        }

        #region AffixSelection

        private static string calculateAffix1(PowerTypesEnum powerType, List<AffixMetadataEnum> md, Random rand, ref SkillAffixProcStat affixProcData)
        {
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

        private static string calculateAffix2(PowerTypesEnum powerType, List<AffixMetadataEnum> md, Random rand, ref SkillAffixProcStat affixProcData)
        {
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
        
        private static string calculateAffix3(PowerTypesEnum powerType, List<AffixMetadataEnum> md, Random rand, ref SkillAffixProcStat affixProcData)
        {
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

        private static string calculateAffix4(PowerTypesEnum powerType, List<AffixMetadataEnum> md, Random rand, ref SkillAffixProcStat affixProcData)
        {
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

        # endregion

    }
}
