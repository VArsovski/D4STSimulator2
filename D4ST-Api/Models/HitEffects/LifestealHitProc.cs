using System;
using D4ST_Api.Models.Helpers;
using D4ST_Api.Models.Interfaces;
using D4ST_Api.Models.MainStats;

namespace D4ST_Api.Models.HitEffects
{
    public class LifestealHitProc : IHitProcAffix
    {
        public decimal ProcPercentage { get; set; }
        public decimal ProcAmount { get; set; }
        public decimal Duration { get; set; }

        public LifestealHitProc CalculateProcAmount(IClassDefinition classInfo) {
            var mainDps = new DamagePerHit(classInfo);

            var baseProcPerc = classInfo.ClassType == Enums.ClassTypeEnum.Barbarian ? 0.05m : 0.03m;
            var procPercAdditives = classInfo.AngelicPower * 0.125 + classInfo.AncestralPower * 0.55;
            var bonusMultiplier = 0.35 * (Math.Pow(1.04, procPercAdditives));
            var bonusProcPerc = DecimalHelper.RoundToDecimals(bonusMultiplier * procPercAdditives / 100, 3);
            var baseProcRate = classInfo.ClassType == Enums.ClassTypeEnum.Barbarian ? 0.08m : 0.10m;
            var bonusProcRate = 0.66m * DecimalHelper.RoundToDecimals((classInfo.AngelicPower * 1.4) / 100, 3);

            var average = DecimalHelper.RoundToDecimals((mainDps.CalculateMinBase(classInfo) + mainDps.CalculateMaxBase(classInfo))/2, 3);
            var procAmountVal = DecimalHelper.RoundToDecimals(Convert.ToDouble(baseProcRate) + Convert.ToDouble(bonusProcRate), 3);
            var procAmount = DecimalHelper.RoundToDecimals(Convert.ToDouble(average) * Convert.ToDouble(procAmountVal), 2);
            var procPerc = Math.Min(0.75m, DecimalHelper.RoundToDecimals(Convert.ToDouble((baseProcPerc + bonusProcPerc)), 2));

            var lifestealProc = new LifestealHitProc { ProcPercentage = procPerc * 100, ProcAmount = procAmount, Duration = 0 };
            return lifestealProc;
        }
    }
}
