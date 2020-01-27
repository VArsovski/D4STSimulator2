using System;
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
                    var skillToAdd = new Skill(skill.Id, skill.Name, skillData);
                    skillToAdd.PowerData = SpellPowerDataCalculator.GetPowerAffixesForSkill((ClassTypeEnum)skill.ClassType, (SkillCastTypeEnum)skill.CastType, skillToAdd);
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

        // private DamageSkillStat getRandomSkillDetails(ClassTypeEnum classType, int tier) {

        //     var skillsList = getClassSkills(classType);

        //     var rand = new Random();
        //     var skillStat = new DamageSkillStat(0, 0, 0);
        //     var skillRng = rand.Next(0, 4);

        //     var tier1From = rand.Next(2, 3);
        //     var tier1To = rand.Next(3, 5);
        //     if (tier1To <= tier1From)
        //         tier1To = tier1From+1;

        //     var tier2From = rand.Next(4, 8);
        //     var tier2To = rand.Next(6, 12);
        //     if (tier2To <= tier2From)
        //         tier2To = tier2From + rand.Next(2,4);

        //     var tier3From = rand.Next(14, 20);
        //     var tier3To = rand.Next(22, 30);
        //     if (tier3To <= tier3From)
        //         tier3To = tier3From + rand.Next(3, 10);

        //     var tier4From = rand.Next(30, 45);
        //     var tier4To = rand.Next(50, 80);
        //     if (tier4To <= tier4From)
        //         tier4To = tier4From + rand.Next(8, 20);
            
        //     var selectedFrom = tier == 1 ? tier1From : tier == 2 ? tier2From : tier == 3 ? tier3From : tier4From;
        //     var selectedTo = tier == 1 ? tier1To : tier == 2 ? tier2To : tier == 3 ? tier3To : tier4To;
        //     var selectedCD = tier == 1 ? rand.Next(2, 4) : tier == 2 ? rand.Next(3, 6) : tier == 3 ? rand.Next(4, 9) : 15 + rand.Next(2, 5) * 5;
        //     var selectedCost = tier == 1 ? rand.Next(4, 8) : tier == 2 ? rand.Next(6, 12) : tier == 3 ? rand.Next(8, 16) : rand.Next(24, 35);

        //     skillStat.From = selectedFrom;
        //     skillStat.To = selectedTo;
        //     var rngData = CalculateCostsCDAndCharges(selectedCD, selectedCost, tier);
        //     skillStat.CD = rngData.CD;
        //     skillStat.Cost = rngData.Cost;
        //     skillStat.Charges = rngData.Charges;

        //     skillStat.Tier = tier;
        //     return skillStat;
        // }

        // private DamageSkillStat CalculateCostsCDAndCharges(int cd, int cost, int tier) {
        //     var rand = new Random();
        //     var skillStat = new DamageSkillStat(0, 0, 0);
        //     skillStat.Charges = 1;

        //     skillStat.CD = rand.Next(0, 10) % 2 == 1 ? cd : 0;
        //     if (skillStat.CD == 0)
        //         skillStat.Cost = cost;
        //     else if (rand.Next(0, 10) % 2 == 1)
        //     {
        //         var charges = rand.Next(1, 4);
        //         var tierDelay = tier < 3 ? tier : tier == 3 ? 5 : 20;
        //         skillStat.CD += tierDelay + Convert.ToInt32(Math.Round(DecimalHelper.RoundToDecimalsD(Convert.ToDecimal(cd/(5-charges)), 1)));
        //         skillStat.Charges = charges;
        //     }

        //     return skillStat;
        // }
    }
}
