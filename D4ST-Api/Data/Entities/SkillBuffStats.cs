using D4St_Api.Data.Entities.Interfaces;

namespace D4St_Api.Data.Entities
{
    public class SkillBuffStats : ILevelableSkillAffix
    {
        public int Id { get; set; }
        public int Level { get; set; }
        public int Duration { get; set; }
        public Skill Skill { get; set; }
    }
}
