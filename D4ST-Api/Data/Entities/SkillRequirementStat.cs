using D4St_Api.Data.Entities.Interfaces;

namespace D4St_Api.Data.Entities
{
    public class SkillRequirementStat : ISkillRequirement//, ILevelableSkillAffix
    {
        public int Id { get; set; }
        public Skill Skill { get; set; }
        public int LevelRequirement { get; set; }
        public int AngelicPowerRequirement { get; set; }
        public int DemonicPowerRequirement { get; set; }
        public int AncestralPowerRequirement { get; set; }
    }
}
