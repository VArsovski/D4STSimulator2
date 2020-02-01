using System;
using System.Collections.Generic;
using D4ST_Api.Models.Enums;

namespace D4St_Api.Data.Entities.Interfaces
{
    public interface ISkillAffixOption
    {
        AffixMetadataEnum SkillMetadata { get; set; }
        List<Enum> AngelicProcAffixes { get; set; }
        List<Enum> DemonicProcAffixes { get; set; }
        List<Enum> AncestralProcAffixes { get; set; }
    }
}