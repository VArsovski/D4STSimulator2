namespace D4ST_Api.Models.Interfaces
{
    public interface IHitEffectAffix
    {
        int MainChange { get; set; }
        float BonusChange { get; set; }
        float BonusPercentage { get; set; }

        int CalculateChange();
        int ReCalculateMainStat (IClassDefinition classInfo, IMainStatAffix mainStat, IHitEffectAffix affix);
    }
}
