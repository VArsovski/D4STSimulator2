using D4St_Api.Models.Enums;

namespace D4St_Api.Data.Entities
{
    public class Skill
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string PhotoUrl { get; set; }
        public SkillTypeEnum SkillType { get; set; }
        public int Tier { get; set; }
        public SkillRequirementStat? SkillRequirement { get; set; }
        public SkillCostStat? SkillCostStats { get; set; }
        public SkillDamageStats? SkillDamageStats { get; set; }
        public SkillBuffStats? SkillBuffStats { get; set; }
        public SkillDebuffStats? SkillDebuffStats { get; set; }
        public SkillLevelableAffixData? SkillLevelableAffixStats { get; set; }
        public int CharacterClassId { get; set; }
        public CharacterClass CharacterClass { get; set; }
    }
}
