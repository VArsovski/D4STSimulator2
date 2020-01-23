using D4St_Api.Models.Enums;

namespace D4St_Api.Data.Entities.Interfaces
{
    public interface ISkillAffixOption
    {
        AffixProcTypeEnum AffixProcType { get; set; }
        PrimaryAffixEnum PrimaryAffix { get; set; }
        ReturnAffixEnum ReturnAffix { get; set; }
        ProcAffixEnum ProcAffix { get; set; }
    }
}