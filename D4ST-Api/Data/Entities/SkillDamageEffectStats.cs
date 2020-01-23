using D4St_Api.Data.Entities.Interfaces;
using D4St_Api.Models.Enums;

namespace D4St_Api.Data.Entities
{
    public class SkillDamageStats: ILevelableSkillAffix
    {
        public int Id { get; set; }
        public int From { get; set; }
        public int To { get; set; }
        public DamageAffixEnum DamageType { get; set; }
        public int Level { get; set; }
        public Skill Skill { get; set; }
    }
}
