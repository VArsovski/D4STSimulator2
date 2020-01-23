using System;
using D4ST_Api.Models.Helpers;
using D4ST_Api.Models.Interfaces;
using D4ST_Api.Models.MainStats;

namespace D4ST_Api.Models.HitEffects
{
    public class SelfEmpowerHitProc : IHitProcAffix
    {
        public decimal ProcPercentage { get; set; }
        public decimal ProcAmount { get; set; }
        public decimal Duration { get; set; }

        public SelfEmpowerHitProc CalculateProcAmount(IClassDefinition classInfo) {
            var baseProcPerc = classInfo.ClassType == Enums.ClassTypeEnum.Melee ? 0.05m : 0.03m;
            var procPercAdditives = classInfo.AncestralPower * 0.55 + classInfo.AngelicPower * 0.11;
            var bonusMultiplier = 0.45 * (Math.Pow(1.04, procPercAdditives));
            var bonusProcPerc = DecimalHelper.RoundToDecimals(bonusMultiplier * procPercAdditives /100, 3);

            var baseProcRate = classInfo.ClassType == Enums.ClassTypeEnum.Melee ? 0.10m : 0.08m;
            var rateMultiplier = (Math.Pow(1.04, classInfo.DemonicPower / 4));
            var bonusProcRate = DecimalHelper.RoundToDecimals((rateMultiplier * classInfo.AngelicPower * 1.25) / 4, 2);
            var basicDuration = 1;
            var bonusDuration = (classInfo.AngelicPower * 6.5)/100;

            var procAmount = DecimalHelper.RoundToDecimals(Convert.ToDouble(baseProcRate + bonusProcRate), 2);
            var procPerc = Math.Min(0.75m, DecimalHelper.RoundToDecimals(Convert.ToDouble((baseProcPerc + bonusProcPerc)), 2));

            var resourceReturnProc = new SelfEmpowerHitProc { ProcPercentage = procPerc * 100, ProcAmount = procAmount, Duration = DecimalHelper.RoundToDecimals(basicDuration * (1 + bonusDuration), 2) };
            return resourceReturnProc;
        }
    }
}
