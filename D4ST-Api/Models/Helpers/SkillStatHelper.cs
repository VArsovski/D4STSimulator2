using System;
using System.Collections.Generic;
using System.Linq;
using D4ST_Api.Models.Enums;

namespace D4ST_Api.Models.Helpers
{
    public static class SkillStatHelper
    {
        private static Random _randA; private static Random randA { get { if (_randA == null) _randA = new Random(); return _randA; } }
        private static Random _randB; private static Random randB { get { if (_randB == null) _randB = new Random(); return _randB; } }
        private static Random _randC; private static Random randC { get { if (_randC == null) _randC = new Random(); return _randC; } }
        
        public static Random GetRNG(PowerTypesEnum powerType)
        {
            var rand = powerType == PowerTypesEnum.AngelicPower ? randA : powerType == PowerTypesEnum.DemonicPower ? randB : randC;
            return rand;
        }

        public static decimal GetProcChance(int affixLevel, PowerTypesEnum powerType, bool isHighTier, List<CastTypesEnum> castTypes, List<AffixMetadataEnum> skillMetadata) {
            var isStrong = skillMetadata.Contains(AffixMetadataEnum.IsStrong);
            var isWeak = skillMetadata.Contains(AffixMetadataEnum.IsWeak);
            var procChance = isStrong ? 10 : isWeak ? 22 : 15;
            
            var rand = powerType == PowerTypesEnum.AngelicPower ? randA : powerType == PowerTypesEnum.DemonicPower ? randB : randC;
            if (!isHighTier)
                procChance -= 4;
            if (castTypes.Contains(CastTypesEnum.MeleeHit) || castTypes.Contains(CastTypesEnum.Projectile))
                procChance += rand.Next(3, 8);

            // Make sure percentages are somewhat diverse
            var randFactor = (rand.Next(0, 7) - 4);
            procChance += randFactor;

            // Not the first upgrade, but make sure no less than 8% upgrade
            if (affixLevel != 1) {
                procChance -= 4;
                procChance = Math.Max(procChance, 8);
            }

            return procChance;
        }
    }
}
