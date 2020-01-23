using D4St_Api.Data.Entities.Interfaces;

namespace D4St_Api.Data.Entities
{
    public class SkillEffectStats : ILevelableSkillAffix
    {
        public int Id { get; set; }
        public int Level { get; set; }
        public int Range { get; set; }
        public decimal Channel { get; set; }
        public decimal Duration { get; set; }
        public decimal AoE { get; set; }
        public SkillDamageStats DamageStatsData { get; set; }
        public Skill Skill { get; set; }
    }
}
