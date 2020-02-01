using D4ST_Api.Models.Enums;
using D4ST_Api.Models.StatCalculators;

namespace D4ST_Api.Models
{
    public class SkillDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ClassTypeEnum CharacterClass { get; set; }
        public SkillCastTypeEnum CastType { get; set; }
        public DamageSkillStat SkillData { get; set; }
        public SkillPowerAffixData AngelicAffix { get; set; }
        public SkillPowerAffixData DemonicAffix { get; set; }
        public SkillPowerAffixData AncestralAffix { get; set; }
        public int GeneratedByGen { get; set; }

        public SkillDTO(int id, string name, ISkillDamageStat skillStats, ISkillCostStat cs, bool IsCC = false)
        {
            this.Id = id;
            this.Name = name;
            this.SkillData = new DamageSkillStat(skillStats, cs, IsCC);
            this.SkillData.Level = skillStats.Level;
            
            // TODO: Remove this after testing/dev phase done
            this.GeneratedByGen = skillStats.Tier <= 2 ? IsCC ? 2 : 1 : IsCC ? 4 : 3;
        }
    }
}