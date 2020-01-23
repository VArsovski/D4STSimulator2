using System;
using D4ST_Api.Models.Enums;
using D4ST_Api.Models.Helpers;
using D4ST_Api.Models.Interfaces;

namespace D4ST_Api.Models.MainStats
{
    public class Stamina : IMainStatAffix
    {
        public int BasicAmount { get; set; }
        public int BonusAmount { get; set; }
        public int BonusAmountPercentage { get; set; }
        public int TotalAmount { get; set; }
        public decimal BasicRegen { get; set; }
        public decimal BonusRegen { get; set; }
        public decimal BonusRegenPercentage { get; set; }
        public decimal TotalRegen { get; set; }

        public Stamina(IClassDefinition classInfo)
        {
            var baseAmt = classInfo.ClassType == ClassTypeEnum.Alternate ? 60 : classInfo.ClassType == ClassTypeEnum.Melee ? 50 : 35;
            BasicAmount = baseAmt + classInfo.Level * 1;
            BonusAmount = classInfo.AncestralPower * 3;
            TotalAmount = CalculateAmount(classInfo);
            var regenCoeff = DecimalHelper.RoundToDecimals(Math.Pow(Convert.ToDouble(1.05), classInfo.Level/2), 3);
            var classCoeff = Math.Round((classInfo.ClassType == ClassTypeEnum.Alternate ? 0.050m : 0.040m) * baseAmt, 3);
            BasicRegen = DecimalHelper.RoundToDecimalsD(classCoeff, 2);
            var ratio = Math.Round((decimal)classInfo.AngelicPower * 3 /40, 3);
            BonusRegen = Math.Round(ratio * regenCoeff, 2);
            TotalRegen = CalculateRegen(classInfo);
        }

        public int CalculateAmount(IClassDefinition classInfo)
        {
            return System.Convert.ToInt32((BasicAmount  + BonusAmount) * (1 + BonusAmountPercentage));
        }

        public decimal CalculateRegen(IClassDefinition classInfo)
        {
            // var life = CalculateAmount(level, classType);
            var totalRegen = Convert.ToDouble(BasicRegen  + BonusRegen);
            return DecimalHelper.RoundToDecimals(totalRegen * Convert.ToDouble(1 + BonusRegenPercentage), 2);
        }
    }
}
