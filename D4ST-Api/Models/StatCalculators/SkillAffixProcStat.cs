using D4St_Api.Models.Enums;

namespace D4ST_Api.Models.StatCalculators
{
    public class SkillAffixProcStat : ISkillAffixProcStat
    {
        public PowerTypesEnum PowerType { get; set; }
        public decimal ProcChance { get; set; }
        public decimal Duration { get; set; }
        public decimal Amount { get; set; }
        public string SelectedAffix { get; set; }
        public bool ProcsOnDeath { get; set; }
        public bool ProcsBuff { get; set; }
        public bool Stackable { get; set; }
        public bool IsBuff { get; set; }
        public string Description { get; set; }
    }
}
