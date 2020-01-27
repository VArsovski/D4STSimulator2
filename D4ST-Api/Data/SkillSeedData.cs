using D4St_Api.Models.Enums;
using D4ST_Api.Models;
using D4ST_Api.Models.StatCalculators;

namespace D4St_Api.Data
{
    public class SkillSeedData
    {
        public int ClassType { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public DamageSkillStat SkillData { get; set; }
        public int CastType { get; set; }
    }
}
