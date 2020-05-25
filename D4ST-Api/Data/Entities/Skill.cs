using System.Collections.Generic;
using D4ST_Api.Models.Enums;
using D4ST_Api.Models.StatCalculators;

namespace D4St_Api.Data.Entities
{
    public class Skill
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string PhotoUrl { get; set; }
        public List<CastTypesEnum> CastTypes { get; set; }
        public List<DamageTypesEnum> DamageTypes { get; set; }
        public List<AffixMetadataEnum> SkillMetadata { get; set; }
        public List<SkillCategoriesEnum> SkillCategoryMetadata { get; set; }
        public DamageSkillStat SkillDamageStats { get; set; }
        public SkillCostStat SkillCostStats { get; set; }
        public SkillAffixData SkillAffixes { get; set; }

        // public SkillBuffStats? SkillBuffStats { get; set; }
        // public SkillDebuffStats? SkillDebuffStats { get; set; }
        // public SkillLevelableAffixData? SkillLevelableAffixStats { get; set; }
        public int CharacterClassId { get; set; }
        public CharacterClass CharacterClass { get; set; }
    }
}
