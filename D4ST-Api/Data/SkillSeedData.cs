using System.Collections.Generic;
using D4ST_Api.Models.Enums;
using D4ST_Api.Models.StatCalculators;

namespace D4St_Api.Data
{
    public class SkillSeedData
    {
        public int ClassType { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public DamageSkillStat SkillData { get; set; }
        public List<CastTypesEnum> AttackTypes { get; set; }
        public List<DamageTypesEnum> DamageTypes { get; set; }
        public List<AffixMetadataEnum> SkillMetadata { get; set; }
        public List<SkillCategoriesEnum> SkillCategoryMetadata { get; set; }

        public SkillSeedData()
        {
            this.AttackTypes = new List<CastTypesEnum>();
            this.DamageTypes = new List<DamageTypesEnum>();
            this.SkillMetadata = new List<AffixMetadataEnum>();
            this.SkillCategoryMetadata = new List<SkillCategoriesEnum>();
        }
    }
}
