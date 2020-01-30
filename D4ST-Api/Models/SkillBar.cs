using D4St_Api.Models.Enums;
using D4St_Api.Models.StatCalculators;
using D4ST_Api.Models.Enums;
using D4ST_Api.Models.StatCalculators;

namespace D4ST_Api.Models
{
    public class Skill {
        public int Id { get; set; }
        public string Name { get; set; }
        public ClassTypeEnum CharacterClass { get; set; }
        public string Description { get; set; }
        public string PhotoUrl { get; set; }
        public SkillCastTypeEnum CastType { get; set; }
        // public SkillTypeEnum? SkillType { get; set; }
        public DamageSkillStat SkillData { get; set; }
        public int CharacterClassId { get; set; }
        public SkillPowerAffixData AngelicAffix { get; set; }
        public SkillPowerAffixData DemonicAffix { get; set; }
        public SkillPowerAffixData AncestralAffix { get; set; }
        public int GeneratedByGen { get; set; }

        public Skill(int id, string name, ISkillDamageStat skillStats, bool IsCC = false, bool calculatePowerup = false)
        {
            this.Id = id;
            this.Name = name;
            this.SkillData = new DamageSkillStat(skillStats, null, IsCC);
            this.SkillData.Level = skillStats.Level;
            if (calculatePowerup)
                this.SkillData = StatCalculators.SpellCalculator.CalculateSkillData(skillStats);
            
            // TODO: Remove this after testing/dev phase done
            this.GeneratedByGen = skillStats.Tier <= 2 ? IsCC ? 2 : 1 : IsCC ? 4 : 3;
        }
    }

    public class SkillBar
    {
        public Skill PrimarySkill { get; set; }
        public Skill SecondarySkill { get; set; }
        public Skill Skill1 { get; set; }
        public Skill Skill2 { get; set; }
        public Skill Skill3 { get; set; }
        public Skill Skill4 { get; set; }

        public SkillBar(Skill ps, Skill ss, Skill s1, Skill s2, Skill s3, Skill s4)
        {
            this.PrimarySkill = ps;
            this.SecondarySkill = ss;
            this.Skill1 = s1;
            this.Skill2 = s2;
            this.Skill3 = s3;
            this.Skill4 = s4;
        }
    }
}
