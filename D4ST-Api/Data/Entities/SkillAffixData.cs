using D4St_Api.Data.Entities.Interfaces;
using D4St_Api.Models.Enums;

namespace D4St_Api.Data.Entities
{
    public class SkillAffixData : ISkillAffixOption
    {
        public AffixProcTypeEnum AffixProcType { get; set; }
        public PrimaryAffixEnum PrimaryAffix { get; set; }
        public ReturnAffixEnum ReturnAffix { get; set; }
        public ProcAffixEnum ProcAffix { get; set; }
    }
}
