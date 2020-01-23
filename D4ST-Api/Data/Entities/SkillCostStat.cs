using D4St_Api.Data.Entities.Interfaces;

namespace D4St_Api.Data.Entities
{
    public class SkillCostStat : ILevelableSkillAffix
    {
        public int Id { get; set; }
        public int Level { get; set; }
        public int CD { get; set; }
        public int Cost { get; set; }
        public int Charges { get; set; }
        public Skill Skill { get; set; }
    }
}
