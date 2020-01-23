using System;
using D4ST_Api.Models.Enums;
using D4ST_Api.Models.Interfaces;
using D4ST_Api.Models.StatCalculators;

namespace D4ST_Api.Models.MainStats
{
    public class DamagePerHit : IDamageHitAffix
    {
        public int MinValue { get; set; }
        public int MaxValue { get; set; }
        public int BonusMinValue { get; set; }
        public int BonusMaxValue { get; set; }
        public float BonusPercentage { get; set; }

        public DamagePerHit(IClassDefinition classInfo)
        {
            var data = SpellCalculator.CalculateHitData(classInfo);
            this.MinValue = data.From;
            this.MaxValue = data.To;

            // TODO: Return IsMax when Maxxed !!!
            this.BonusMinValue = Math.Min(40, Convert.ToInt32(classInfo.AncestralPower/2));
            this.BonusMaxValue = Math.Min(80, classInfo.AncestralPower);
        }

        public int CalculateMinBase(IClassDefinition classInfo)
        {
            return System.Convert.ToInt32(MinValue  + BonusMinValue);
        }
        public int CalculateMaxBase(IClassDefinition classInfo)
        {
            return System.Convert.ToInt32(MaxValue  + BonusMaxValue);
        }

        public int CalculateMinAmount(IClassDefinition classInfo)
        {
            return System.Convert.ToInt32((MinValue  + BonusMinValue) * (1 + BonusPercentage));
        }
        public int CalculateMaxAmount(IClassDefinition classInfo)
        {
            return System.Convert.ToInt32((MaxValue  + BonusMaxValue) * (1 + BonusPercentage));
        }        
    }
}
