using D4ST_Api.Models.Interfaces;

namespace D4ST_Api.Models.Interactions
{
    public class HitInteraction : IHitEffectAffix
    {
        public int MainChange { get; set; }
        public float BonusChange { get; set; }
        public float BonusPercentage { get; set; }

        public int CalculateChange()
        {
            throw new System.NotImplementedException();
        }

        public int ReCalculateMainStat(IClassDefinition classInfo, IMainStatAffix mainStat, IHitEffectAffix affix)
        {
            var damagePerHit = mainStat.CalculateAmount(classInfo);
            throw new System.NotImplementedException();
        }
    }
}
