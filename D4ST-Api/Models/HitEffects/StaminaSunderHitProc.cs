using System;
using D4ST_Api.Models.Helpers;
using D4ST_Api.Models.Interfaces;

namespace D4ST_Api.Models.HitEffects
{
    public class StaminaSunderHitProc : IHitProcAffix
    {
        public decimal ProcPercentage { get; set; }
        public decimal ProcAmount { get; set; }
        public decimal Duration { get; set; }

        public SelfEmpowerHitProc CalculateProcAmount(IClassDefinition classInfo) {
            var baseProcRate = DecimalHelper.RoundToDecimals((classInfo.ClassType == Enums.ClassTypeEnum.Barbarian ? 10 : 5)/100, 3);
            var bonusProcRate = DecimalHelper.RoundToDecimals(0.66*classInfo.AncestralPower * (classInfo.ClassType == Enums.ClassTypeEnum.Barbarian ? 0.6 : 0.5), 3);
            var procAmount = DecimalHelper.RoundToDecimals(Convert.ToDouble(baseProcRate + bonusProcRate), 2);

            var resourceReturnProc = new SelfEmpowerHitProc { ProcPercentage = 1, ProcAmount = procAmount, Duration = 0 };
            return resourceReturnProc;
        }
    }
}
