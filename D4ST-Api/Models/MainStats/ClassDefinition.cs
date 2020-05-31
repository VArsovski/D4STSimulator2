using D4ST_Api.Models.Enums;
using D4ST_Api.Models.Helpers;
using D4ST_Api.Models.Interfaces;

namespace D4ST_Api.Models.MainStats
{
    public class ClassDefinition : IClassDefinition
    {
        private IClassDefinition classDefinition;

        public ClassDefinition()
        {
            
        }

        public ClassDefinition(IClassDefinition classDefinition)
        {
            this.classDefinition = classDefinition;
            this.ClassType = classDefinition.ClassType;
            this.ClassDescription = classDefinition.ClassDescription;
            this.Level = classDefinition.Level;
            this.AngelicPower = classDefinition.AngelicPower;
            this.DemonicPower = classDefinition.DemonicPower;
            this.AncestralPower = classDefinition.AncestralPower;
        }

        public ClassTypeEnum ClassType { get; set; }
        public string ClassTypeStr { get{ return EnumHelper.GetName(this.ClassType);} }
        public string ClassDescription { get; set; }
        string IClassDefinition.ClassTypeStr { get; set; }
        public int Level { get; set; }
        public int AngelicPower { get; set; }
        public int DemonicPower { get; set; }
        public int AncestralPower { get; set; }
        public int TotalPower { get { return this.Level * 3; } }
        public int UnassignedPower { get { return this.TotalPower - (this.AngelicPower + this.DemonicPower + this.AncestralPower); } set {;} }
    }
}
