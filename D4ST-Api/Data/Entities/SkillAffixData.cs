using System;
using System.Collections.Generic;
using D4St_Api.Data.Entities.Interfaces;
using D4ST_Api.Models.Enums;

namespace D4St_Api.Data.Entities
{
    public class SkillAffixData : ISkillAffixOption
    {
        public AffixMetadataEnum SkillMetadata { get; set; }
        public List<Enum> AngelicProcAffixes { get; set; }
        public List<Enum> DemonicProcAffixes { get; set; }
        public List<Enum> AncestralProcAffixes { get; set; }
    }
}
