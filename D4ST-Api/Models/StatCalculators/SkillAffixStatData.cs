using D4St_Api.Models.Enums;
using D4ST_Api.Models.StatCalculators;

namespace D4St_Api.Models.StatCalculators
{
    public class SkillAffixStatData : ISkillAffixProcStat
    {
        public AffixProcTypeEnum AffixProcType { get; set; }
        public PrimaryAffixEnum PrimaryAffix { get; set; }
        public ReturnAffixEnum ReturnAffix { get; set; }
        public ProcAffixEnum ProcAffix { get; set; }
    }
}
