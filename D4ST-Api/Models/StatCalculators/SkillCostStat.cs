namespace D4ST_Api.Models.StatCalculators
{
    public class SkillCostStat : ISkillCostStat
    {
        public int CD { get; set; }
        public int Cost { get; set; }
        public int Charges { get; set; }
        public SkillCostStat(ISkillCostStat data)
        {
            this.CD = data?.CD ?? 0;
            this.Cost = data?.Cost ?? 0;
            this.Charges = data?.Charges ?? 1;
        }
    }
}
