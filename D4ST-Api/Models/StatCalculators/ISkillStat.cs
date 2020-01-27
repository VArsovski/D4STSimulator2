using System;
using System.Collections.Generic;
using D4St_Api.Models.Enums;
using D4ST_Api.Models.Enums;

namespace D4ST_Api.Models.StatCalculators
{
    public interface ISkillPowerAffixData
    {
        List<AffixMetadataEnum> SkillMetadata { get; set; }
        ISkillAffixProcStat AngelicProcAffix { get; set; }
        ISkillAffixProcStat DemonicProcAffix { get; set; }
        ISkillAffixProcStat AncestralProcAffix { get; set; }
    }

    public interface ISkillAffixProcStat {
        string Description { get; set; }
        PowerTypesEnum PowerType { get; set; }
        decimal ProcChance { get; set; }
        decimal Duration { get; set; }
        decimal Amount { get; set; }
        string SelectedAffix { get; set; }
        bool ProcsOnDeath { get; set; }
        bool Stackable { get; set; }
        bool IsBuff { get; set; }
    }
    
    public interface ISkillStat
    {
        int Level { get; set; }
        int Tier { get; set; }
    }

    public interface ISkillCostStat {
        int CD { get; set; }
        int Cost { get; set; }
        int Charges { get; set; }
    }

    public interface ISkillDamageStat : ISkillStat, ISkillCostStat
    {
        int From { get; set; }
        int To { get; set; }
    }

    public interface ISkillRangeStat
    {
        float Range { get; set; }
        float Radius { get; set; }
    }

    public interface ISkillDoTStat
    {
        float DoT { get; set; }
        float Duration { get; set; }
    }
}
