using D4ST_Api.Models.StatCalculators;

namespace D4ST_Api.Models
{
    public class Skill {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string PhotoUrl { get; set; }
        public int CharacterClassId { get; set; }
        
        public SkillDTO Data { get; set; }
        public SkillDTO LevelUp { get; set; }

        public Skill(int id, string name, ISkillDamageStat ds, ISkillCostStat cs, bool isCC = false)
        {
            this.Id = id;
            this.Name = name;
            this.Data = new SkillDTO(id, name, ds, cs, isCC);
            var dsUp = (ds as DamageSkillStat).CalculateSkillPower(ds.Level+1).CalculateSkillCosts(ds.Level+1);
            this.LevelUp = new SkillDTO(id, name, dsUp, cs, isCC);
        }
    }
}
