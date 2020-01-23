using D4ST_Api.Models.Enums;

namespace D4ST_Api.Models.Interfaces
{
    public interface IMainStatAffix
    {
        int BasicAmount { get; set; }
        int BonusAmount { get; set; }
        int BonusAmountPercentage { get; set; }
        int TotalAmount { get; set; }
        decimal BasicRegen { get; set; }
        decimal BonusRegen { get; set; }
        decimal BonusRegenPercentage { get; set; }
        decimal TotalRegen { get; set; }
        int CalculateAmount(IClassDefinition classStats);
        decimal CalculateRegen(IClassDefinition classStats);
    }
}
