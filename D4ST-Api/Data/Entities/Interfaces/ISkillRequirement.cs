namespace D4St_Api.Data.Entities.Interfaces
{
    public interface ISkillRequirement
    {
         int LevelRequirement { get; set; }
         int AngelicPowerRequirement { get; set; }
         int DemonicPowerRequirement { get; set; }
         int AncestralPowerRequirement { get; set; }
    }
}