using D4ST_Api.Models.Interfaces;
using D4ST_Api.Models.MainStats;

namespace D4ST_Api.Models
{
    public class BasicStats
    {
        public IClassDefinition ClassDefinition { get; set; }
        public Life Life { get; set; }
        public Resource Resource { get; set; }
        public Stamina Stamina { get; set; }
        public IDamageHitAffix DamagePerHit { get; set; }
        public IHitProcAffix LifeReturn { get; set; }
        public IHitProcAffix ResourceReturn { get; set; }
        public IHitProcAffix StaminaReturn { get; set; }
        public IHitProcAffix StaminaSunder { get; internal set; }
        public IHitProcAffix SpellPowerBonus { get; set; }
        public IHitProcAffix SpellPowerReduction { get; set; }
    }
}
