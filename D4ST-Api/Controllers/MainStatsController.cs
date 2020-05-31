using System.Collections.Generic;
using System.Linq;
using D4St_Api.Data.Entities;
using D4ST_Api.Models;
using D4ST_Api.Models.Enums;
using D4ST_Api.Models.HitEffects;
using D4ST_Api.Models.MainStats;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace D4ST_Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize]
    public class MainStatsController : ControllerBase
    {
        private readonly ILogger<MainStatsController> _logger;
        private const int _MAX = 40;
        private const string _LEVEL_INVALID = "Bad level data inserted";
        private const string _POWER_INVALID = "Bad power data, maximum power reached, or all powers used";

        public MainStatsController(ILogger<MainStatsController> logger)
        {
            _logger = logger;
        }

        [Route("{classType}")]
        [HttpGet]
        public IActionResult Get(ClassTypeEnum classType, int level = 1)
        {
            // var totalPower = 3 * lvl;
            // var demPower = 0;// rand.Next(0, totalPower/2 + lvl/4);
            // var angPower = 0;// rand.Next(0, totalPower - demPower - totalPower/2 + lvl/4);
            // var ancPower = 0;// totalPower - demPower - angPower;
            var levelValid = level > 0 && level<=_MAX;
            if (!levelValid) {
                return(BadRequest(_LEVEL_INVALID));
            }

            var charData = GetCharStats(classType, level);
            var newChar = GetCharStats(classType, level + 1);
            if (level == _MAX)
                newChar = charData;

            // if Even return ranged char, if Odd return a melee one
            return Ok(new { Current = charData, New = newChar, IsMaxxed = level == _MAX });
        }

        [HttpPost]
        [Route("LevelUp")]
        public IActionResult LevelUp([FromBody]ClassDefinition classInfo, [FromQuery]int levels = 1)
        {
            // var totalPower = classInfo.Level * 3;
            var unused = classInfo.UnassignedPower;//.AngelicPower + classInfo.DemonicPower + classInfo.AncestralPower;
            var level = classInfo.Level;
            var levelValid = level <= _MAX;
            if (!levelValid)
            {
                return (BadRequest(_LEVEL_INVALID));
            }

            if (classInfo.Level + levels <= _MAX)
            {
                classInfo.Level += levels;
                classInfo = new ClassDefinition(classInfo);
                var charData = GetCharStats(classInfo.ClassType, classInfo.Level, classInfo.AngelicPower, classInfo.DemonicPower, classInfo.AncestralPower);
                var newChar = GetCharStats(classInfo.ClassType, classInfo.Level + 1, classInfo.AngelicPower, classInfo.DemonicPower, classInfo.AncestralPower);
                if (classInfo.Level == _MAX)
                    newChar = charData;

                return Ok(new { Current = charData, New = newChar, IsMaxxed = level == _MAX });
            }
            else return BadRequest(_POWER_INVALID);
        }

        [HttpPost]
        [Route("PowerUp")]
        public IActionResult PowerUp([FromBody]ClassDefinition classInfo, [FromQuery]int powerType, [FromQuery]int levels = 1) {
            // var totalPower = classInfo.Level * 3;
            var unused = classInfo.UnassignedPower;
            if (classInfo.Level == 0 && classInfo.UnassignedPower == 0)
                unused = 3;

            var powersValid = unused >= levels;
            if (!powersValid) {
                return (BadRequest(_LEVEL_INVALID));
            }

            if (unused > 0)
            {
                var angPower = classInfo.AngelicPower;
                var demPower = classInfo.DemonicPower;
                var ancPower = classInfo.AncestralPower;

                var charCurrent = GetCharStats(classInfo.ClassType, classInfo.Level, classInfo.AngelicPower, classInfo.DemonicPower, classInfo.AncestralPower);

                if (powerType != 0)
                {
                    for (int i = 0; i< levels; i++)
                    {
                        switch((PowerTypesEnum)powerType) {
                            case PowerTypesEnum.AngelicPower: { classInfo.AngelicPower++; angPower++; classInfo.UnassignedPower--; break; }
                            case PowerTypesEnum.DemonicPower: { classInfo.DemonicPower++; demPower++; classInfo.UnassignedPower--; break; }
                            case PowerTypesEnum.AncestralPower: { classInfo.AncestralPower++; ancPower++; classInfo.UnassignedPower--; break; }
                            default: { break; }
                        }
                        unused--;
                    }
                }

                var newChar = GetCharStats(classInfo.ClassType, classInfo.Level, angPower, demPower, ancPower);
                var newCharAng = GetCharStats(classInfo.ClassType, classInfo.Level, angPower + 1, demPower, ancPower);
                var newCharDem = GetCharStats(classInfo.ClassType, classInfo.Level, angPower, demPower + 1, ancPower);
                var newCharAnc = GetCharStats(classInfo.ClassType, classInfo.Level, angPower, demPower, ancPower + 1);

                return Ok(new { Current = charCurrent, New = newChar, NewAngelic = newCharAng, NewDemonic = newCharDem, NewAncestral = newCharAnc });
            }
            else return BadRequest(_POWER_INVALID);
        }

        private BasicStats GetCharStats(ClassTypeEnum classType, int lvl, int angPower = 0, int demPower = 0, int ancPower = 0)
        {
            var charClassesJson = System.IO.File.ReadAllText("./Data/CharacterClassesSeed.json");
            var charClasses = JsonConvert.DeserializeObject<List<CharacterClass>>(charClassesJson);
            var selectedClass = charClasses.FirstOrDefault(c => c.Id == (int)classType);

            var classSample = new ClassDefinition { Level = lvl, ClassType = classType, ClassDescription = selectedClass.Description, AngelicPower = angPower, DemonicPower = demPower, AncestralPower = ancPower };

            var charData = new BasicStats { ClassDefinition = classSample
                , Life = new Life(classSample, selectedClass)
                , Resource = new Resource(classSample, selectedClass)
                , Stamina = new Stamina(classSample, selectedClass)
                , DamagePerHit = new DamagePerHit(classSample)
                , LifeReturn = new LifestealHitProc().CalculateProcAmount(classSample)
                , ResourceReturn = new ResourceReturnHitProc().CalculateProcAmount(classSample)
                , StaminaReturn = new StaminaReturnHitProc().CalculateProcAmount(classSample)
                , StaminaSunder = new StaminaSunderHitProc().CalculateProcAmount(classSample)
                , SpellPowerBonus = new SelfEmpowerHitProc().CalculateProcAmount(classSample)
                , SpellPowerReduction = new DamageReductionHitProc().CalculateProcAmount(classSample)
            };

            return charData;
        }
    }
}
