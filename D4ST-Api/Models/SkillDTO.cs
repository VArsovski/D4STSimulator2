using System.Collections.Generic;
using D4ST_Api.Models.Enums;
using D4ST_Api.Models.StatCalculators;

namespace D4ST_Api.Models
{
    public class SkillDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Level { get; set; }
        public ClassTypeEnum CharacterClass { get; set; }
        public List<CastTypesEnum> CastTypes { get; set; }
        public List<DamageTypesEnum> DamageTypes { get; set; }
        public SkillDamageAffixData SkillData { get; set; }        
        public List<AffixMetadataEnum> SkillMetadata { get; set; }
        public List<SkillCategoriesEnum> SkillCategoriesMetadata { get; private set; }
        public SkillPowerAffixData AngelicAffix { get; set; }
        public SkillPowerAffixData DemonicAffix { get; set; }
        public SkillPowerAffixData AncestralAffix { get; set; }
        public int GeneratedByGen { get; set; }
        public int Tier { get; set; }

        public SkillDTO(int id, string name, string description, int level, ISkillDamageAffixData skillStats, ISkillCostStat cs, List<CastTypesEnum> castTypes, List<DamageTypesEnum> damageTypes, List<AffixMetadataEnum> skillMetadata, List<SkillCategoriesEnum> skillCategoriesMetadata, bool IsCC = false)
        {
            this.Id = id;
            this.Name = name;
            this.Description = description;
            this.Level = level != 0 ? level : skillStats?.PowerData?.Level ?? 0;
            this.Tier = skillStats?.PowerData?.Tier ?? 0;
            if (skillStats != null)
            {
                skillStats.PowerData.CD = cs?.CD ?? 0;
                skillStats.PowerData.Cost = cs?.Cost ?? 0;
            }
            this.SkillData = new SkillDamageAffixData(skillStats?.PowerData, skillStats?.PowerUp);
            this.CastTypes = castTypes ?? new List<CastTypesEnum>();
            this.DamageTypes = damageTypes ?? new List<DamageTypesEnum>();
            
            // TODO: Remove this after testing/dev phase done
            this.GeneratedByGen = skillStats?.PowerData?.Tier <= 2 ? IsCC ? 2 : 1 : IsCC ? 4 : 3;
            this.SkillMetadata = skillMetadata ?? new List<AffixMetadataEnum>();
            this.SkillCategoriesMetadata = skillCategoriesMetadata ?? new List<SkillCategoriesEnum>();
        }
    }
}
