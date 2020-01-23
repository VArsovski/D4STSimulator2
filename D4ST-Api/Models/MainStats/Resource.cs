using System;
using D4ST_Api.Models.Enums;
using D4ST_Api.Models.Helpers;
using D4ST_Api.Models.Interfaces;

namespace D4ST_Api.Models.MainStats
{
    public class Resource : IMainStatAffix
    {
        public int BasicAmount { get; set; }
        public int BonusAmount { get; set; }
        public int BonusAmountPercentage { get; set; }
        public int TotalAmount {get; set; }
        public decimal BasicRegen { get; set; }
        public decimal BonusRegen { get; set; }
        public decimal BonusRegenPercentage { get; set; }
        public decimal TotalRegen {get; set; }


        public Resource(IClassDefinition classInfo)
        {
            var baseAmt = classInfo.ClassType == ClassTypeEnum.Melee ? 35 : classInfo.ClassType == ClassTypeEnum.Ranged ? 60 : 50;
            BasicAmount = baseAmt + classInfo.Level * 1;
            BonusAmount = classInfo.DemonicPower * 3;
            TotalAmount = CalculateAmount(classInfo);
            var regenCoeff = DecimalHelper.RoundToDecimals(Math.Pow(Convert.ToDouble(1.05), classInfo.Level / 2), 3);
            var classCoeff = Math.Round((classInfo.ClassType == ClassTypeEnum.Ranged ? 0.033m : 0.025m) * baseAmt, 3);
            BasicRegen = DecimalHelper.RoundToDecimalsD(classCoeff, 2);
            var ratio = Math.Round((decimal)BonusAmount/60, 3);
            BonusRegen = Math.Round(ratio * regenCoeff, 2);
            TotalRegen = CalculateRegen(classInfo);
        }

        public int CalculateAmount(IClassDefinition classInfo)
        {
            return System.Convert.ToInt32((BasicAmount  + BonusAmount) * (1 + BonusAmountPercentage));
        }

        public decimal CalculateRegen(IClassDefinition classInfo)
        {
            var totalRegen = Convert.ToDouble(BasicRegen  + BonusRegen);
            return DecimalHelper.RoundToDecimals(totalRegen * Convert.ToDouble(1 + BonusRegenPercentage), 2);
        }
    }
}
