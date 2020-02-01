namespace D4ST_Api.Models.StatCalculators
{
    public class SkillDamageAffixData: ISkillDamageAffixData
    {
        public DamageSkillStat PowerData { get; set; }
        public DamageSkillStat PowerUp { get; set; }

        public SkillDamageAffixData(ISkillDamageStat sd, ISkillDamageStat su, ISkillCostStat cs = null, ISkillCostStat ucs = null)
        {
            this.PowerData = new DamageSkillStat(sd, cs);
            if (cs != null && ucs == null)
            {
                var dsup = (sd as DamageSkillStat).CalculateSkillCosts(sd.Level + 1);
                ucs = new SkillCostStat(dsup);
            }
            this.PowerUp = new DamageSkillStat(su, ucs);
        }
    }
}
