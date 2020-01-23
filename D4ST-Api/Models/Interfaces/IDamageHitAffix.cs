namespace D4ST_Api.Models.Interfaces
{
    public interface IDamageHitAffix
    {
         int MinValue { get; set; }
         int MaxValue { get; set; }
         int BonusMinValue { get; set; }
         int BonusMaxValue { get; set; }
         float BonusPercentage { get; set; }
    }
}
