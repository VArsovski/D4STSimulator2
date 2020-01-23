using D4St_Api.Models.Enums;
using D4St_Api.Models.StatCalculators;
using D4ST_Api.Models.StatCalculators;

namespace D4ST_Api.Models
{
    public class SkillData {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public SkillTypeEnum SkillType { get; set; }
        public DamageSkillStat skillData { get; set; }
        public PowerAffixesSkillStat powerData { get; set; }

        public SkillData(int id, string name, ISkillDamageStat skillStats, bool calculatePowerup = false)
        {
            this.Id = id;
            this.Name = name;
            this.skillData = new DamageSkillStat(skillStats, null);
            this.skillData.Level = skillStats.Level;
            if (calculatePowerup)
                this.skillData = StatCalculators.SpellCalculator.CalculateSkillData(skillStats);
        }
    }

    public class SkillBar
    {
        public SkillData PrimarySkill { get; set; }
        public SkillData SecondarySkill { get; set; }
        public SkillData Skill1 { get; set; }
        public SkillData Skill2 { get; set; }
        public SkillData Skill3 { get; set; }
        public SkillData Skill4 { get; set; }

        public SkillBar(SkillData ps, SkillData ss, SkillData s1, SkillData s2, SkillData s3, SkillData s4)
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
