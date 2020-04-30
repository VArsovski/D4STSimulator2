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
using System;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;

namespace D4ST_Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize]
    public class SkillBarController : ControllerBase
    {
        private const string _LEVEL_INVALID = "Bad level data inserted";
        private const int _MAX = 12;

        private readonly IConfiguration _config;
        public SkillBarController(IConfiguration config) {
            _config = config;
        }        

        [HttpGet("{classType}")]
        public IActionResult GetAll([FromQuery]int classType) {
            var skills = new SkillList();
            try {
                // var selectedSkillset = getClassSkills((ClassTypeEnum)classType);
                var skillSeedData = this.getSkillData();
                var selectedSkillset = classType != 0 ? skillSeedData.Where(s => s.ClassType == classType).GroupBy(t => t.SkillData.Tier) : skillSeedData.GroupBy(t => t.SkillData.Tier);

                var tier = 0;
                var skillCount = 0;
                foreach (var tierSet in selectedSkillset)
                {
                    tier = tierSet.FirstOrDefault().SkillData.Tier;
                    skillCount = 0;
                    foreach (var skill in tierSet)
                    {
                        var skillTier = skill.SkillData.Tier;
                        var skillLevel = 1;// levelRand.Next(1, randMax);
                        var skillData = skill.SkillData; //getRandomSkillData(selectedClassType, tier);
                        skillData.Level = skillLevel;
                        var scs = new SkillCostStat(skillData);
                        var skillToAdd = new Skill(skill.Id, skill.Name, skillTier, skill.SkillData, scs, skillData.IsCC);
                        // skillToAdd.Data.SkillData.Level = skill.SkillData.Level;
                        // skillToAdd.Data.SkillData.PowerData.Tier = skillTier;
                        // skillToAdd.Data.SkillData.PowerUp.Tier = skillTier;

                        var skillMetadata = SkillStatHelper.GetSkillMetadata(PowerTypesEnum.AngelicPower, (ClassTypeEnum)skill.ClassType, skillToAdd.Data);
                        var PoDAng = SkillStatHelper.GetRNG(PowerTypesEnum.AngelicPower).Next(1, 18) % 5 == 0;
                        var PoDDem = SkillStatHelper.GetRNG(PowerTypesEnum.DemonicPower).Next(1, 18) % 4 == 0;
                        var PoDAnc = SkillStatHelper.GetRNG(PowerTypesEnum.AncestralPower).Next(1, 18) % 3 == 0;

                        var md1 = new List<AffixMetadataEnum>(); md1.AddRange(skillMetadata);
                        var md2 = new List<AffixMetadataEnum>(); md2.AddRange(skillMetadata);
                        var md3 = new List<AffixMetadataEnum>(); md3.AddRange(skillMetadata);
                        if (PoDAng) md1.Add(AffixMetadataEnum.ProcsOnDeath);
                        if (PoDDem) md2.Add(AffixMetadataEnum.ProcsOnDeath);
                        if (PoDAnc) md3.Add(AffixMetadataEnum.ProcsOnDeath);

                        skillToAdd.ClassId = skill.ClassType;// classType;
                        skillToAdd.ClassName = EnumHelper.GetName<ClassTypeEnum>((ClassTypeEnum)skill.ClassType);
                        skillToAdd.Data.AngelicAffix = SpellPowerDataCalculator.GetPowerAffixesForSkill(PowerTypesEnum.AngelicPower, (SkillCastTypeEnum)skill.CastType, skillToAdd.Data.SkillData.PowerData, md1);
                        skillToAdd.Data.DemonicAffix = SpellPowerDataCalculator.GetPowerAffixesForSkill(PowerTypesEnum.DemonicPower, (SkillCastTypeEnum)skill.CastType, skillToAdd.Data.SkillData.PowerData, md2);
                        skillToAdd.Data.AncestralAffix = SpellPowerDataCalculator.GetPowerAffixesForSkill(PowerTypesEnum.AncestralPower, (SkillCastTypeEnum)skill.CastType, skillToAdd.Data.SkillData.PowerData, md3);

                        // Recalculate for same affix selected from above..
                        // skillToAdd.LevelUp.AngelicAffix = SpellPowerDataCalculator.RecalculatePowerAffixesForSkill(PowerTypesEnum.AngelicPower, (SkillCastTypeEnum)skill.CastType, skillToAdd.Data.AngelicAffix.PowerUp, skillToAdd.LevelUp.SkillData, md1);
                        // skillToAdd.LevelUp.DemonicAffix = SpellPowerDataCalculator.RecalculatePowerAffixesForSkill(PowerTypesEnum.DemonicPower, (SkillCastTypeEnum)skill.CastType, skillToAdd.Data.DemonicAffix.PowerUp, skillToAdd.LevelUp.SkillData, md2);
                        // skillToAdd.LevelUp.AncestralAffix = SpellPowerDataCalculator.RecalculatePowerAffixesForSkill(PowerTypesEnum.AncestralPower, (SkillCastTypeEnum)skill.CastType, skillToAdd.Data.AncestralAffix.PowerUp, skillToAdd.LevelUp.SkillData, md3);

                        // skillToAdd.Data.Tier = skillTier;
                        // skillToAdd.Data.Level = skillLevel;
                        skills.Skills.Add(skillToAdd);
                        skillCount++;
                    }
                }
            }
            catch (Exception ex) {
                var exMessage = ex.Message;
                if ((ex.InnerException?.Message ?? "").Length != 0)
                    exMessage += ex.InnerException.Message;
                return BadRequest(ex.Message);
            }

            return Ok(skills);
        }

        [HttpPost]
        public IActionResult LevelUp([FromBody]SkillDTO data) {
            var id = data.Id;
            var sd = data.SkillData.PowerData;
            var su = data.SkillData.PowerUp;
            var levelValid = sd.Level > 0 && sd.Level < _MAX;
            if (!levelValid)
                return BadRequest(_LEVEL_INVALID);
            else
            {
                var level = sd.Level;
                sd.Level = level + 1;
                var scs = new SkillCostStat(sd);
                var skillData = new Skill(id, data.Name, data.SkillData, scs);
                sd.Level = level + 2;
                var nextLvlSkillData = new Skill(id, data.Name, data.SkillData, scs);
                if (level == _MAX)
                    nextLvlSkillData = skillData;
                return Ok(new { Current = skillData, New = nextLvlSkillData, IsMaxxed = level == _MAX });
            }
        }

        [HttpPost]
        [Route("{id}")]
        public IActionResult PowerUp([FromBody]SkillDTO data, [FromQuery]int id, [FromQuery]int powerType) {
            var sd = data.SkillData.PowerData;
            var levelValid = sd.Level >= 0 && sd.Level < _MAX;
            if (!levelValid)
                return BadRequest(_LEVEL_INVALID);
            else
            {
                var level = sd.Level;
                data.SkillData.PowerData.Level = level + 1;
                var scs = new SkillCostStat(sd);
                var skillData = new Skill(id, data.Name, data.SkillData, scs);
                data.SkillData.PowerData.Level = level + 2;
                var nextLvlSkillData = new Skill(id, data.Name, data.SkillData, scs);
                if (level == _MAX)
                    nextLvlSkillData = skillData;
                return Ok(new { Current = skillData, New = nextLvlSkillData, IsMaxxed = level == _MAX });
            }
        }

        private List<SkillSeedData> getSkillData() {
            var skillSeedData = new List<SkillSeedData>();
            var publishFolder =_config["DataFolders:PublishFolder"];
            var dataFolder =_config["DataFolders:DataFolder"];
            // _config.ContentRootPath
            var path = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory()).FullName, publishFolder, dataFolder, "SkillDataSeed.json");
            var skillStr = System.IO.File.ReadAllText(path);
            string lines = System.IO.File.ReadAllText(path, System.Text.Encoding.UTF8);
            skillSeedData = JsonConvert.DeserializeObject<List<SkillSeedData>>(lines);

            return skillSeedData;
        }
    }
}
