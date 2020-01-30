using System;
using System.Collections.Generic;
using D4St_Api.Models.Enums;
using D4ST_Api.Models.Enums;

namespace D4ST_Api.Models.StatCalculators
{
    public interface ISkillAffixProcStat {
        // string Description { get; set; }
        PowerTypesEnum PowerType { get; set; }
        decimal ProcChance { get; set; }
        decimal ProcAmount { get; set; }
        decimal Duration { get; set; }
        string SelectedAffix { get; set; }
        bool Stackable { get; set; }
        bool IsBuff { get; set; }
        int Level { get; set; }
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

    public interface ISkillPowerStat {
        int AngelicPower { get; set; }
        int DemonicPower { get; set; }
        int AncestralPower { get; set; }
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
