using System.IO;
using System.Collections.Generic;
using System.Linq;
using D4St_Api.Data;
using D4St_Api.Models;
using D4ST_Api.Models;
using D4ST_Api.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using D4ST_Api.Models.StatCalculators;
using D4ST_Api.Models.Helpers;

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
                tier = tierSet.FirstOrDefault().SkillData.Tier;
                skillCount = 0;
                foreach (var skill in tierSet)
                {
                    var skillLevel = 1;// levelRand.Next(1, randMax);
                    var skillData = skill.SkillData; //getRandomSkillData(selectedClassType, tier);
                    skillData.Level = skillLevel;
                    var scs = new SkillCostStat(){ CD = skillData.CD, Cost = skillData.Cost, Charges = skillData.Charges };
                    var skillToAdd = new Skill(skill.Id, skill.Name, skillData, scs, skillData.IsCC);
                    // skillToAdd.Data.SkillData.Level = skill.SkillData.Level;
                    skillToAdd.Data.SkillData.Tier = skill.SkillData.Tier;
                    skillToAdd.LevelUp.SkillData.Tier = skill.SkillData.Tier;

                    var skillMetadata = SkillStatHelper.GetSkillMetadata(PowerTypesEnum.AngelicPower, (ClassTypeEnum)skill.ClassType, skillToAdd.Data);
                    var PoDAng = SkillStatHelper.GetRNG(PowerTypesEnum.AngelicPower).Next(1, 18) % 5 == 0;
                    var PoDDem = SkillStatHelper.GetRNG(PowerTypesEnum.DemonicPower).Next(1, 18) % 4 == 0;
                    var PoDAnc = SkillStatHelper.GetRNG(PowerTypesEnum.AncestralPower).Next(1, 18) % 3 == 0;

                    var md1 = skillMetadata;
                    var md2 = skillMetadata;
                    var md3 = skillMetadata;
                    if (PoDAng) md1.Add(AffixMetadataEnum.ProcsOnDeath);
                    if (PoDDem) md2.Add(AffixMetadataEnum.ProcsOnDeath);
                    if (PoDAnc) md3.Add(AffixMetadataEnum.ProcsOnDeath);

                    skillToAdd.Data.AngelicAffix = SpellPowerDataCalculator.GetPowerAffixesForSkill(PowerTypesEnum.AngelicPower, (SkillCastTypeEnum)skill.CastType, skillToAdd.Data.SkillData, md1);
                    skillToAdd.Data.DemonicAffix = SpellPowerDataCalculator.GetPowerAffixesForSkill(PowerTypesEnum.DemonicPower, (SkillCastTypeEnum)skill.CastType, skillToAdd.Data.SkillData, md2);
                    skillToAdd.Data.AncestralAffix = SpellPowerDataCalculator.GetPowerAffixesForSkill(PowerTypesEnum.AncestralPower, (SkillCastTypeEnum)skill.CastType, skillToAdd.Data.SkillData, md3);

                    // Recalculate for same affix selected from above..
                    skillToAdd.LevelUp.AngelicAffix = SpellPowerDataCalculator.RecalculatePowerAffixesForSkill(PowerTypesEnum.AngelicPower, (SkillCastTypeEnum)skill.CastType, skillToAdd.Data.AngelicAffix.PowerUp, skillToAdd.LevelUp.SkillData, md1);
                    skillToAdd.LevelUp.DemonicAffix = SpellPowerDataCalculator.RecalculatePowerAffixesForSkill(PowerTypesEnum.DemonicPower, (SkillCastTypeEnum)skill.CastType, skillToAdd.Data.DemonicAffix.PowerUp, skillToAdd.LevelUp.SkillData, md2);
                    skillToAdd.LevelUp.AncestralAffix = SpellPowerDataCalculator.RecalculatePowerAffixesForSkill(PowerTypesEnum.AncestralPower, (SkillCastTypeEnum)skill.CastType, skillToAdd.Data.AncestralAffix.PowerUp, skillToAdd.LevelUp.SkillData, md3);
                    skills.Skills.Add(skillToAdd);
                    skillCount++;
                }
            }

            return Ok(skills);
        }

        [HttpPost]
        [Route("{id}")]
        public IActionResult LevelUp([FromBody]SkillDTO data, [FromQuery]int id) {
            var levelValid = data.SkillData.Level > 0 && data.SkillData.Level < _MAX;
            if (!levelValid)
                return BadRequest(_LEVEL_INVALID);
            else
            {
                var level = data.SkillData.Level;
                data.SkillData.Level = level + 1;
                var scs = new SkillCostStat(){ CD = data.SkillData.CD, Cost = data.SkillData.Cost, Charges = data.SkillData.Charges };
                var skillData = new Skill(id, data.Name, data.SkillData, scs);
                data.SkillData.Level = level + 2;
                var nextLvlSkillData = new Skill(id, data.Name, data.SkillData, scs);
                if (level == _MAX)
                    nextLvlSkillData = skillData;
                return Ok(new { Current = skillData, New = nextLvlSkillData, IsMaxxed = level == _MAX });
            }
        }

        [HttpPost]
        [Route("{id}")]
        public IActionResult PowerUp([FromBody]SkillDTO data, [FromQuery]int id, [FromQuery]int powerType) {
            var levelValid = data.SkillData.Level > 0 && data.SkillData.Level < _MAX;
            if (!levelValid)
                return BadRequest(_LEVEL_INVALID);
            else
            {
                var level = data.SkillData.Level;
                data.SkillData.Level = level + 1;
                var scs = new SkillCostStat(){ CD = data.SkillData.CD, Cost = data.SkillData.Cost, Charges = data.SkillData.Charges };
                var skillData = new Skill(id, data.Name, data.SkillData, scs);
                data.SkillData.Level = level + 2;
                var nextLvlSkillData = new Skill(id, data.Name, data.SkillData, scs);
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

        // private List<List<string>> getClassSkills(ClassTypeEnum classType) {
        //     var rangedSkills = new List<List<string>> {
        //         new List<string> { "Lightning", "Arc Lash", "Frost Bolt", "Fire bolt", "Ignite" },
        //     new List<string> { "Flash", "Charged Bolts", "Glacial spike", "Ice Shards", "Blazing pyre" },
        //     new List<string> { "Frozen Orb", "Frost Nova", "Firewall", "Hydra", "Chain lightning" },
        //     new List<string> { "Archon", "Meteor", "Conduit", "Deep Freeze", "Tesla Coil" }};

        //     var meleeSkills = new List<List<string>> {
        //         new List<string> { "Bash", "Cleave", "Lunging strike", "Frenzy", "Double strike" },
        //     new List<string> { "Rend", "Leaping strike", "Rupture", "Upheaval", "Weapon Throw" },
        //     new List<string> { "Ground Stomp", "Overpower", "Ancient Spear", "Charge", "Double Swing" },
        //     new List<string> { "Execute", "Hammer of the Ancients", "Wrath of the Berserker", "Call of the Ancients", "Iron Maelstrom" }};

        //     var alternateSkills = new List<List<string>>{
        //         new List<string> { "Earthspike", "Sunder", "Shred", "Storm Strike", "Maul"},
        //         new List<string> { "Wind Shear", "Pulverize", "Landslide", "Tornado", "Cyclone Armor"},
        //         new List<string> { "Earthen Bulwark", "Trample", "Debilitating Roar", "Ravenous Bite", "Hurricane"},
        //         new List<string> { "Boulder", "Vine Creeper", "Cataclysm", "Grizzly Rage", "Petrify" }
        //     };

        //     return classType == ClassTypeEnum.Ranged ? rangedSkills : classType == ClassTypeEnum.Melee ? meleeSkills : alternateSkills;
        // }
    }
}
