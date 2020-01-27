using System.Collections.Generic;
using D4ST_Api.Models;

namespace D4St_Api.Models
{
    public class SkillList
    {
        public SkillList()
        {
            this.Skills = new List<Skill>();
        }
        public List<Skill> Skills { get; set; }
    }
}
