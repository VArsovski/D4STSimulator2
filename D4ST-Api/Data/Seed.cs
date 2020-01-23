using System.Collections.Generic;
using System.Linq;
using D4St_Api.Data.Entities;
using Newtonsoft.Json;

namespace D4St_Api.Data
{
    public static class Seed
    {
        public static void SeedCharacterClasses(DataContext context)
        {
            if (!context.CharacterClasses.Any())
            {
                var charClassesJson = System.IO.File.ReadAllText("./D4St_Api/Data/CharacterClassesSeed.json");
                var charClasses = JsonConvert.DeserializeObject<List<CharacterClass>>(charClassesJson);
                
                foreach (var charClass in charClasses)
                {
                    context.CharacterClasses.Add(charClass);
                }
                context.SaveChanges();
            }
        }

        public static void SeedSkills(DataContext context) {
            // if (!context.Skills.Any()) {
            //     var classTypesData = System.IO.File.ReadAllText("./D4St_Api/Data/skillsSeed.json");
            // }
        }
    }
}
