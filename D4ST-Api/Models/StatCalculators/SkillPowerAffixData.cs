using System.Collections.Generic;
using D4St_Api.Models.Enums;
using D4ST_Api.Models.Enums;
using D4ST_Api.Models.StatCalculators;

namespace D4St_Api.Models.StatCalculators
{
    public class SkillPowerAffixData : ISkillPowerAffixData
    {
        public string SkillAffixDescription { get; set; }
        public List<AffixMetadataEnum> SkillMetadata { get; set; }
        public ISkillAffixProcStat AngelicProcAffix { get; set; }
        public ISkillAffixProcStat DemonicProcAffix { get; set; }
        public ISkillAffixProcStat AncestralProcAffix { get; set; }
        public SkillPowerAffixData()
        {
            this.SkillMetadata = new List<AffixMetadataEnum>();
            this.AngelicProcAffix = new SkillAffixProcStat();
            this.DemonicProcAffix = new SkillAffixProcStat();
            this.AncestralProcAffix = new SkillAffixProcStat();
        }
    }
}
