using System.Collections.Generic;
using D4ST_Api.Models.Enums;

namespace D4ST_Api.Models.StatCalculators
{
    public class SkillPowerAffixData: ISkillPowerAffixData
    {
        public List<AffixMetadataEnum> AffixMetadata { get; set; }
        public string SkillAffixDescription { get; set; }
        public ISkillAffixProcStat PowerData { get; set; }
        public ISkillAffixProcStat PowerUp { get; set; }
        public int GeneratedByGen { get; set; }

        public SkillPowerAffixData()
        {
            this.PowerData = new SkillAffixProcStat();
            this.PowerUp = new SkillAffixProcStat();
            this.AffixMetadata = new List<AffixMetadataEnum>();
        }
    }
}
