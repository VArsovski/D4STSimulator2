using D4St_Api.Models.Enums;

namespace D4St_Api.Models.StatCalculators
{
    public class PowerAffixesSkillStat
    {
        public int Id { get; set; }
        public int Level { get; set; }
        public double ProcChance { get; set; }
        public PowerTypesEnum PowerType { get; set; }
    }
}
