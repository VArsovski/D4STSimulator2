using System;
using System.Linq;

namespace D4ST_Api.Models.StatCalculators
{
    public class DamageSkillStat : ISkillDamageStat, ISkillCostStat, ISkillPowerStat
    {
        public int From { get; set; }
        public int To { get; set; }
        public int Level { get; set; }
        public int Tier { get; set; }
        public int CD { get; set; }
        public int Cost { get; set; }
        public int Charges { get; set; }
        public decimal Duration { get; set; }
        public bool IsCC { get; set; }
        public int AngelicPower { get; set; }
        public int DemonicPower { get; set; }
        public int AncestralPower { get; set; }

        public DamageSkillStat()
        {
            
        }

        public DamageSkillStat(ISkillDamageStat ds, ISkillCostStat cs, bool IsCC = false)
        {
            this.From = ds.From;
            this.To = ds.To;
            this.Level = ds.Level;
            this.Tier = ds.Tier;
            this.Cost = cs?.Cost ?? 0;
            this.CD = cs?.CD ?? 0;
            this.Charges = cs?.Charges ?? 1;
            this.IsCC = IsCC;
        }

        public DamageSkillStat(ISkillDamageStat ds, bool IsCC = false)
        {
            this.From = ds.From;
            this.To = ds.To;
            this.Level = ds.Level;
            this.Tier = ds.Tier;
            this.Cost = ds.CD != 0 ? ds.Tier * 5 + ds.Level : 0;
            this.CD = ds.CD;
            this.Charges = Math.Max(ds.Charges, 1);
            this.IsCC = IsCC;
        }

        public DamageSkillStat(int from, int to, int tier)
        {
            this.From = from;
            this.To = to;
            this.Tier = tier;
        }
        public DamageSkillStat(int from, int to, int level, int tier, bool IsCC = false) : this(from, to, tier)
        {
            this.From = from;
            this.To = to;
            // var data = CalculateSkillPower(level);
            this.Level = level;
            this.Tier = tier;
            this.IsCC = IsCC;
        }

        public DamageSkillStat(int from, int to, int tier, int cost, int CD, int charges, bool IsCC = false) : this(from, to, tier)
        {
            this.Cost = cost == 0 && CD == 0 ? tier * 5 : cost;
            this.CD = CD;
            this.Charges = Math.Max(charges, 1);
            this.IsCC = IsCC;
        }

        public DamageSkillStat CalculateSkillPower(int level)
        {
            var data = SpellCalculator.CalculateSkillDamageLevels(this).FirstOrDefault(x => x.Level == level);
            this.From = data.From;
            this.To = data.To;

            var selected = new DamageSkillStat(this.From, this.To, this.Tier, this.Cost, this.CD, this.Charges);
            selected.Level = level;
            return selected;
        }

        public DamageSkillStat CalculateSkillCosts(int level)
        {
            var costIncreaseRate = level * (this.Tier <= 2 ? 1 : this.Tier == 3 ? 2 : 3);
            this.Cost = this.Cost == 0 && this.CD == 0 ? this.Tier * 5 : this.Cost;
            if (this.Cost != 0) {
                this.Cost += costIncreaseRate;
            }

            this.CD = this.CD;
            this.Charges = Math.Max(this.Charges, 1);

            var selected = new DamageSkillStat(this.From, this.To, this.Tier, this.Cost, this.CD, this.Charges);
            selected.Level = level;
            return selected;
        }

        public DamageSkillStat CalculateHitData(Interfaces.IClassDefinition classInfo)
        {
            this.Cost = 0;
            this.CD = 0;
            this.Charges = 0;

            var data = SpellCalculator.CalculateHitData(classInfo);
            var selected = new DamageSkillStat(data.From, data.To, this.Tier, this.Cost, this.CD, this.Charges);
            selected.Level = this.Level;
            return selected;
        }
    }
}
