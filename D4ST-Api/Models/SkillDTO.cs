using D4ST_Api.Models.Enums;
using D4ST_Api.Models.StatCalculators;

namespace D4ST_Api.Models
{
    public class SkillDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Level { get; set; }
        public ClassTypeEnum CharacterClass { get; set; }
        public SkillCastTypeEnum CastType { get; set; }
        public SkillDamageAffixData SkillData { get; set; }        
        public SkillPowerAffixData AngelicAffix { get; set; }
        public SkillPowerAffixData DemonicAffix { get; set; }
        public SkillPowerAffixData AncestralAffix { get; set; }
        public int GeneratedByGen { get; set; }
        public int Tier { get; set; }

        public SkillDTO(int id, string name, int level, ISkillDamageAffixData skillStats, ISkillCostStat cs, bool IsCC = false)
        {
            this.Id = id;
            this.Name = name;
            this.Level = level != 0 ? level : skillStats?.PowerData?.Level ?? 0;
            this.Tier = skillStats?.PowerData?.Tier ?? 0;
            this.SkillData = new SkillDamageAffixData(skillStats?.PowerData, skillStats?.PowerUp);
            
            // TODO: Remove this after testing/dev phase done
            this.GeneratedByGen = skillStats?.PowerData?.Tier <= 2 ? IsCC ? 2 : 1 : IsCC ? 4 : 3;
        }
    }
}