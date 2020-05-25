using System.Collections.Generic;
using D4ST_Api.Models.Enums;
using D4ST_Api.Models.Helpers;

namespace D4ST_Api.Models.StatCalculators
{
    public class SkillAffixProcStat : ISkillAffixProcStat
    {
        // public string Description { get; set; }
        public int Level { get; set; }
        public PowerTypesEnum PowerType { get; set; }
        public decimal ProcChance { get; set; }
        public string SelectedAffix { get; set; }
        public bool Stackable { get; set; }
        public bool IsBuff { get; set; }
        public decimal Duration { get; set; }
        public decimal ProcAmount { get; set; }
        public bool ProcsOnDeath { get; set; }

        public SkillAffixProcStat() { }

        public SkillAffixProcStat(decimal procChance, PowerTypesEnum powerType, string selectedAffix, DamageSkillStat skillData, List<AffixMetadataEnum> md)
        {
            var rand = SkillStatHelper.GetRNG(powerType);
            var level = powerType == PowerTypesEnum.AngelicPower ? skillData.AngelicPower : powerType == PowerTypesEnum.DemonicPower ? skillData.DemonicPower : skillData.AncestralPower;
            this.Level = level;
            this.PowerType = powerType;
            this.SelectedAffix = selectedAffix;
            this.Stackable = md.Contains(AffixMetadataEnum.Stackable);
            this.IsBuff = md.Contains(AffixMetadataEnum.BuffDebuff);

            var highTier = skillData.Tier >= 3;
            var HighCD = md.Contains(AffixMetadataEnum.HighCD);
            var spender = md.Contains(AffixMetadataEnum.HighCost);
            var procsOnDeath = md.Contains(AffixMetadataEnum.ProcsOnDeath);
            this.ProcsOnDeath = procsOnDeath;

            // if (procsOnDeath) {
            //     // Probably is a buff if LPR on death as well ?
            //     var isBuff = EnumHelper.Contains<LBsEnum>(selectedAffix);
            // }
            
            var minBuffOrTotemDur = procsOnDeath ? (!highTier? 75 : 200) : (!highTier? 250 : 400);
            var maxBuffOrTotemDur = procsOnDeath ? (!highTier? 175 : 350) : (!highTier? 350 : 600);
            var minBuffDurIncr = procsOnDeath ? (!highTier? 10 : 30) : (!highTier? 20 : 50);
            var maxBuffDurIncr = procsOnDeath ? (!highTier? 30 : 50) : (!highTier? 40 : 100);
            var randDurBonus = rand.Next(minBuffDurIncr, maxBuffDurIncr) * level;

            var average = DecimalHelper.RoundToDecimals((skillData.From + skillData.To) / 2, 2);
            var minDPSIncr = procsOnDeath ? (!highTier? 8 : 8) : (!highTier? 20 : 18);
            var maxDPSIncr = procsOnDeath ? (!highTier? 25 : 20) : (!highTier? 40 : 25);
            var randBonus = rand.Next(minDPSIncr, maxDPSIncr) * level;

            if (md.Contains(AffixMetadataEnum.BuffDebuff) || md.Contains(AffixMetadataEnum.BannerOrTotem))
            {
                this.Duration = DecimalHelper.RoundToDecimals(randDurBonus/100, 2);
                this.ProcAmount = DecimalHelper.RoundToDecimalsD(average * (randBonus/250), 2);
            }
            else if (md.Contains(AffixMetadataEnum.HasDoT))
            {
                this.Duration = DecimalHelper.RoundToDecimals(randDurBonus/250, 2);
                this.ProcAmount = DecimalHelper.RoundToDecimalsD(average * (randBonus/100), 2);
            }
            else if (md.Contains(AffixMetadataEnum.Summon))
            {
                this.Duration = DecimalHelper.RoundToDecimals(randDurBonus/50, 2);
                this.ProcAmount = DecimalHelper.RoundToDecimalsD(average * (randBonus/75), 2);
            }
            // else if (md.Contains(AffixMetadataEnum.Curse))
            // {
            //     this.Duration = DecimalHelper.RoundToDecimals(randDurBonus/125, 2);
            //     this.ProcAmount = DecimalHelper.RoundToDecimalsD(average * (randBonus/75), 2);
            // }
            else
            {
                var durIncr = highTier ? rand.Next(level * 25, level * 45) : rand.Next(level * 15, level * 25);
                this.Duration = skillData.Duration * (1 + durIncr/100);
                this.ProcAmount = DecimalHelper.RoundToDecimalsD(average * randBonus/100, 2);
            }

            // TODO: Set procChance upgrades per level, i.e. level
            this.ProcChance = procChance;
        }
    }
}
