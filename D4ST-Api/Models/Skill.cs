using System.Collections.Generic;
using D4ST_Api.Models.Enums;
using D4ST_Api.Models.StatCalculators;

namespace D4ST_Api.Models
{
    public class Skill {
        public int ClassId { get; set; }
        public string ClassName { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string PhotoUrl { get; set; }
        public int Tier { get; set; }
        public int Level { get; set; }
        public SkillDTO Data { get; set; }

        public Skill(int id, SkillDTO data, ISkillCostStat cs)
        {
            this.Id = data.Id;
            this.Name = data.Name;
            this.Description = data.Description;
            this.Tier = data.Tier;
            this.Level = data.Level;
            var ds = data.SkillData.PowerData;
            ds.Cost = cs.Cost;
            ds.CD = cs.CD;
            ds.Charges = cs.Charges;
            var dsUp = new DamageSkillStat(ds);
            dsUp = dsUp.CalculateSkillPower(ds.Level+1).CalculateSkillCosts(ds.Level+1);
            // var sdad = new SkillDamageAffixData(ds, dsUp, cs);
            data.SkillData.PowerUp = dsUp;
            this.Data = data;
        }

        // public Skill(int id, string name, ISkillDamageAffixData ds, ISkillCostStat cs, List<CastTypesEnum> castTypes, List<DamageTypesEnum> damageTypes, bool isCC = false)
        // {
        //     this.Id = id;
        //     this.Name = name;
        //     this.Tier = ds?.PowerData?.Tier ?? 0;
        //     this.Level = ds?.PowerData?.Level ?? 0;
        //     var dsUp = new DamageSkillStat(ds.PowerData);
        //     dsUp = dsUp.CalculateSkillPower(ds.PowerData.Level+1).CalculateSkillCosts(ds.PowerData.Level+1);
        //     this.Data = new SkillDTO(id, name, this.Level, ds, cs, castTypes, damageTypes, isCC);
        // }
    }
}
