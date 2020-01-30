using System.Collections.Generic;
using D4ST_Api.Models.Enums;

namespace D4ST_Api.Models.StatCalculators
{
    public interface ISkillPowerAffixData
    {
        public List<AffixMetadataEnum> AffixMetadata { get; set; }
        string SkillAffixDescription { get; set; }
        ISkillAffixProcStat PowerData { get; set; }
        ISkillAffixProcStat PowerUp { get; set; }
        public int GeneratedByGen { get; set; }
    }
}
