using System;
using D4St_Api.Data.Entities;
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

        public Stamina(IClassDefinition classInfo, CharacterClass classData)
        {
            var baseAmt = classInfo.ClassType == ClassTypeEnum.Druid ? 60 : classInfo.ClassType == ClassTypeEnum.Barbarian ? 50 : 35;
            BasicAmount = classData.Stamina + classInfo.Level * 1;
            BonusAmount = classInfo.AncestralPower * 4;
            TotalAmount = CalculateAmount(classInfo);
            var regenCoeff = DecimalHelper.RoundToDecimals(Math.Pow(Convert.ToDouble(1.05), classInfo.Level/2), 3);
            var classCoeff = Math.Round((classInfo.ClassType == ClassTypeEnum.Druid ? 0.050m : 0.040m) * baseAmt, 3);
            BasicRegen = Math.Round(classCoeff * classData.StaminaRegen, 3);
            var ratio = Math.Round((decimal)BonusAmount/classData.Stamina, 3);
            BonusRegen = Math.Round(regenCoeff * ratio, 2);
            TotalRegen = CalculateRegen(classInfo);            
        }

        public int CalculateAmount(IClassDefinition classInfo)
        {
            return System.Convert.ToInt32((BasicAmount + BonusAmount) * (1 + BonusAmountPercentage));
        }

        public decimal CalculateRegen(IClassDefinition classInfo)
        {
            // var life = CalculateAmount(level, classType);
            var totalRegen = Convert.ToDouble(BasicRegen + BonusRegen);
            return DecimalHelper.RoundToDecimals(totalRegen * Convert.ToDouble(1 + BonusRegenPercentage), 2);
        }
    }
}
