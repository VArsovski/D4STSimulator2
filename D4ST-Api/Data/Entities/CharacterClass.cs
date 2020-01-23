using System.Collections.Generic;

namespace D4St_Api.Data.Entities
{
    public class CharacterClass
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int HP { get; set; }
        public int Resource { get; set; }
        public int Stamina { get; set; }
        public decimal HPRegen { get; set; }
        public decimal ResourceRegen { get; set; }
        public decimal StaminaRegen { get; set; }
        ICollection<Skill> Skills { get; set; }
    }
}
