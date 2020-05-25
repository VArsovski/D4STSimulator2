namespace D4ST_Api.Models.StatCalculators
{
    public class SimpleSkillDamageAffixData : ISkillDamageAffixData
    {
        public DamageSkillStat PowerData { get; set; }
        public DamageSkillStat PowerUp { get; set; }

        public SimpleSkillDamageAffixData()
        {
            this.PowerData = new DamageSkillStat();
            this.PowerUp = new DamageSkillStat();
        }
    }
}
