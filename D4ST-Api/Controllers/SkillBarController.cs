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
                        var data = new SimpleSkillDamageAffixData();
                        data.PowerData = skill.SkillData;
                        var sd = new SkillDTO(skill.Id, skill.Name, skill.Description, skillLevel, data, scs, skill.AttackTypes, skill.DamageTypes, skill.SkillMetadata, skill.SkillClassification, skillData.IsCC);
                        var skillToAdd = new Skill(skill.Id, sd, scs);
                        var castTypesData = "CastTypes: [" + string.Join(", ", skillToAdd.Data.CastTypes.Select(t => EnumHelper.GetName<CastTypesEnum>(t))) + "]";
                        var damageTypesData = "EmpoweredByDamageTypes: [" + string.Join(", ", skillToAdd.Data.DamageTypes.Select(t => EnumHelper.GetName<DamageTypesEnum>(t))) + "]";
                        // [" + string.Join(", ", skillToAdd.Data.SkillCategoriesMetadata.Select(t => EnumHelper.GetName<SkillCategoriesEnum>(t))) + "]";

                        var descriptionWithDetails = skillToAdd.Description + "<br/>" + "<br/>" + castTypesData + "<br/>" + damageTypesData + "<br/>";
                        skillToAdd.Description = descriptionWithDetails;
                        skillToAdd.Data.Description = descriptionWithDetails;

                        var skillMetadata = skill.SkillMetadata; //SkillStatHelper.GetSkillMetadata(PowerTypesEnum.AngelicPower, (ClassTypeEnum)skill.ClassType, skillToAdd.Data);
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
                        skillToAdd.Data.AngelicAffix = SpellPowerDataCalculator.GetPowerAffixesForSkill(PowerTypesEnum.AngelicPower, skill.AttackTypes ?? new List<CastTypesEnum>(), skill.DamageTypes, skillToAdd.Data.SkillData.PowerData, md1);
                        skillToAdd.Data.DemonicAffix = SpellPowerDataCalculator.GetPowerAffixesForSkill(PowerTypesEnum.DemonicPower, skill.AttackTypes ?? new List<CastTypesEnum>(), skill.DamageTypes, skillToAdd.Data.SkillData.PowerData, md2);
                        skillToAdd.Data.AncestralAffix = SpellPowerDataCalculator.GetPowerAffixesForSkill(PowerTypesEnum.AncestralPower, skill.AttackTypes ?? new List<CastTypesEnum>(), skill.DamageTypes, skillToAdd.Data.SkillData.PowerData, md3);

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
        [Route("LevelUp")]
        public IActionResult LevelUp([FromBody]SkillDTO data) {
            var id = data.Id;
            var sd = data.SkillData.PowerData;
            var su = data.SkillData.PowerUp;
            // var levelValid = sd.Level > 0 && sd.Level < _MAX;
            // if (!levelValid)
            //     return BadRequest(_LEVEL_INVALID);
            // else
            // {
                var level = sd.Level;
                sd.Level = level + 1;
                var scs = new SkillCostStat(sd);
                var skillData = new Skill(id, data, scs);
                sd.Level = level + 2;
                var nextLvlSkillData = new Skill(id, data, scs);
                if (level == _MAX)
                    nextLvlSkillData = skillData;
                return Ok(new { Current = skillData, New = nextLvlSkillData, IsMaxxed = level == _MAX });
            //}
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
                var skillData = new Skill(id, data, scs);
                data.SkillData.PowerData.Level = level + 2;
                var nextLvlSkillData = new Skill(id, data, scs);
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
            skillSeedData.ForEach(ssd => {
                ssd.From = ssd.SkillData.From;
                ssd.To = ssd.SkillData.To;
                ssd.Duration = (float)ssd.SkillData.Duration;
                ssd.Percentage = ssd.SkillData.Percentage ?? 0;
                ssd.Description = ssd.Description.Replace("<<Percentage>>", ssd.Percentage.ToString())
                                                 .Replace("<<Duration>>", ssd.Duration.ToString())
                                                 .Replace("<<From>>", ssd.From.ToString())
                                                 .Replace("<<To>>", ssd.To.ToString());

                var skillCharacteristics = new List<string>();
                if (ssd.SkillClassification.Contains(SkillCategoriesEnum.Finisher)) { skillCharacteristics.Add("Finisher"); }
                if (ssd.SkillClassification.Contains(SkillCategoriesEnum.Ultimate)) { skillCharacteristics.Add("Ultimate"); }
                if (ssd.SkillClassification.Contains(SkillCategoriesEnum.Stackable)) { skillCharacteristics.Add("Stackable"); }
                if (ssd.SkillClassification.Contains(SkillCategoriesEnum.Setup)) { skillCharacteristics.Add("Setup"); }
                if (ssd.SkillClassification.Contains(SkillCategoriesEnum.Barrier)) { skillCharacteristics.Add("Barrier"); } // Not sure if this is needed tbh
                if (ssd.SkillMetadata.Contains(AffixMetadataEnum.Summon)) { skillCharacteristics.Add("Summon"); }
                if (ssd.SkillMetadata.Contains(AffixMetadataEnum.HighCost)) { skillCharacteristics.Add("HighCost"); }
                if (ssd.SkillMetadata.Contains(AffixMetadataEnum.HighCD)) { skillCharacteristics.Add("HighCD"); }
                if (ssd.SkillMetadata.Contains(AffixMetadataEnum.IsWeak)) { skillCharacteristics.Add("Weak"); }
                if (ssd.SkillMetadata.Contains(AffixMetadataEnum.BannerOrTotem)) { skillCharacteristics.Add("BannerTotemShout"); }
                var skillCharacteristicsStr = skillCharacteristics.Any() ? " [" + string.Join(", ", skillCharacteristics) + "]" : "";
                ssd.Description = ssd.Description + skillCharacteristicsStr;
            });

            return skillSeedData;
        }
    }
}
