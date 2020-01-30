using System.IO;
using System.Collections.Generic;
using System.Linq;
using D4St_Api.Data;
using D4St_Api.Models;
using D4ST_Api.Models;
using D4ST_Api.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using D4St_Api.Models.StatCalculators;
using D4St_Api.Models.Enums;

namespace D4ST_Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SkillBarController : ControllerBase
    {
        private const string _LEVEL_INVALID = "Bad level data inserted";
        private const int _MAX = 12;

        [HttpGet("{classType}")]
        public IActionResult GetAll(int classType) {

            var skills = new SkillList();
            // var selectedSkillset = getClassSkills((ClassTypeEnum)classType);
            var skillSeedData = this.getSkillData();
            var selectedSkillset = skillSeedData.Where(s => s.ClassType == classType).GroupBy(t => t.SkillData.Tier);

            var tier = 0;
            var skillCount = 0;
            foreach (var tierSet in selectedSkillset)
            {
                // tier++;
                tier = tierSet.FirstOrDefault().SkillData.Tier;
                skillCount = 0;
                foreach (var skill in tierSet)
                {
                    // var levelRand = new Random();
                    var randMax = tier == 4 ? 5 : tier == 3 ? 8 : 10;
                    var skillLevel = 1;// levelRand.Next(1, randMax);

                    // var selectedClassType = (ClassTypeEnum)classType;
                    var skillData = skill.SkillData; //getRandomSkillData(selectedClassType, tier);
                    skillData.Level = skillLevel;
                    // THIS IS BAD BUT SO FAR OK, must include isCC as separate otherwise need change low-layer Interface for 1 purpose
                    var skillToAdd = new Skill(skill.Id, skill.Name, skillData, skillData.IsCC);
                    skillToAdd.AngelicAffix = SpellPowerDataCalculator.GetPowerAffixesForSkill(PowerTypesEnum.AngelicPower, (ClassTypeEnum)skill.ClassType,skillToAdd);
                    skillToAdd.DemonicAffix = SpellPowerDataCalculator.GetPowerAffixesForSkill(PowerTypesEnum.DemonicPower, (ClassTypeEnum)skill.ClassType, skillToAdd);
                    skillToAdd.AncestralAffix = SpellPowerDataCalculator.GetPowerAffixesForSkill(PowerTypesEnum.AncestralPower, (ClassTypeEnum)skill.ClassType, skillToAdd);
                    skills.Skills.Add(skillToAdd);
                    skillCount++;
                }
            }

            return Ok(skills);
        }

        [HttpPost]
        [Route("{id}")]
        public IActionResult LevelUp([FromBody]Skill data, [FromQuery]int id) {
            var levelValid = data.SkillData.Level > 0 && data.SkillData.Level < _MAX;
            if (!levelValid)
                return BadRequest(_LEVEL_INVALID);
            else
            {
                var level = data.SkillData.Level;
                data.SkillData.Level = level + 1;
                var skillData = new Skill(id, data.Name, data.SkillData);
                data.SkillData.Level = level + 2;
                var nextLvlSkillData = new Skill(id, data.Name, data.SkillData);
                if (level == _MAX)
                    nextLvlSkillData = skillData;
                return Ok(new { Current = skillData, New = nextLvlSkillData, IsMaxxed = level == _MAX });
            }
        }

        [HttpPost]
        [Route("{id}")]
        public IActionResult PowerUp([FromBody]Skill data, [FromQuery]int id, [FromQuery]int powerType) {
            var levelValid = data.SkillData.Level > 0 && data.SkillData.Level < _MAX;
            if (!levelValid)
                return BadRequest(_LEVEL_INVALID);
            else
            {
                var level = data.SkillData.Level;
                data.SkillData.Level = level + 1;
                var skillData = new Skill(id, data.Name, data.SkillData);
                data.SkillData.Level = level + 2;
                var nextLvlSkillData = new Skill(id, data.Name, data.SkillData);
                if (level == _MAX)
                    nextLvlSkillData = skillData;
                return Ok(new { Current = skillData, New = nextLvlSkillData, IsMaxxed = level == _MAX });
            }
        }

        private List<SkillSeedData> getSkillData() {
            var skillSeedData = new List<SkillSeedData>();
            var path = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory()).FullName, @"D4ST-Api\Data\SkillDataSeed.txt");
            var skillStr = System.IO.File.ReadAllText(path);
            string[] lines = System.IO.File.ReadAllLines(path, System.Text.Encoding.UTF8);

            foreach (string line in lines)
            {
                var data = JsonConvert.DeserializeObject<SkillSeedData>(line);
                skillSeedData.Add(data);
            }
            return skillSeedData;
        }

        private List<List<string>> getClassSkills(ClassTypeEnum classType) {
            var rangedSkills = new List<List<string>> {
                new List<string> { "Lightning", "Arc Lash", "Frost Bolt", "Fire bolt", "Ignite" },
            new List<string> { "Flash", "Charged Bolts", "Glacial spike", "Ice Shards", "Blazing pyre" },
            new List<string> { "Frozen Orb", "Frost Nova", "Firewall", "Hydra", "Chain lightning" },
            new List<string> { "Archon", "Meteor", "Conduit", "Deep Freeze", "Tesla Coil" }};

            var meleeSkills = new List<List<string>> {
                new List<string> { "Bash", "Cleave", "Lunging strike", "Frenzy", "Double strike" },
            new List<string> { "Rend", "Leaping strike", "Rupture", "Upheaval", "Weapon Throw" },
            new List<string> { "Ground Stomp", "Overpower", "Ancient Spear", "Charge", "Double Swing" },
            new List<string> { "Execute", "Hammer of the Ancients", "Wrath of the Berserker", "Call of the Ancients", "Iron Maelstrom" }};

            var alternateSkills = new List<List<string>>{
                new List<string> { "Earthspike", "Sunder", "Shred", "Storm Strike", "Maul"},
                new List<string> { "Wind Shear", "Pulverize", "Landslide", "Tornado", "Cyclone Armor"},
                new List<string> { "Earthen Bulwark", "Trample", "Debilitating Roar", "Ravenous Bite", "Hurricane"},
                new List<string> { "Boulder", "Vine Creeper", "Cataclysm", "Grizzly Rage", "Petrify" }
            };

            return classType == ClassTypeEnum.Ranged ? rangedSkills : classType == ClassTypeEnum.Melee ? meleeSkills : alternateSkills;
        }
    }
}
