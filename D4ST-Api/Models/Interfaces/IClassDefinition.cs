using D4ST_Api.Models.Enums;

namespace D4ST_Api.Models.Interfaces
{
    public interface IClassDefinition
    {
        ClassTypeEnum ClassType { get; set; }
        string ClassTypeStr { get; }
        int Level { get; set; }
        int TotalPower { get; }
        int UnassignedPower { get; }
        int AngelicPower { get; set; }
        int DemonicPower { get; set; }
        int AncestralPower { get; set; }
    }
}
