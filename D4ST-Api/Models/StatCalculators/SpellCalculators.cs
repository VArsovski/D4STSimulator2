using System;
using System.Collections.Generic;
using System.Linq;
using D4ST_Api.Models.Enums;
using D4ST_Api.Models.Interfaces;

namespace D4ST_Api.Models.StatCalculators
{
    public static class SpellCalculator
    {
        private static ISkillDamageStat CalculateSkillPower1(ISkillDamageStat skillStats) {

            var tier = skillStats.Tier;
            var level = skillStats.Level;
            var from = skillStats.From;
            var to = skillStats.To;

            var range = to-from;
            var initFactor = level <= 3 ? level*2 : level;
            var increaseFactor = level <= 4 ? initFactor : level/(5-tier);

            var fromCalculated = range > from/initFactor ? Convert.ToInt32(from + range/3 + initFactor)
                : Convert.ToInt32(from + 2*range/initFactor + increaseFactor);
            var toCalculated = range > from/3 ? Convert.ToInt32(to + range/3 + initFactor)
                : Convert.ToInt32(to + 2*range/3 + increaseFactor);

            return new DamageSkillStat(fromCalculated, toCalculated, tier);
        }
        private static ISkillDamageStat CalculateSkillPower2(ISkillDamageStat skillStats) {
            var tier = skillStats.Tier;
            var level = skillStats.Level;
            var from = skillStats.From;
            var to = skillStats.To;

            var range = to-from;
            var increaseFactor = level/(5-tier);

            var fromCalculated = range > from/3 ? Convert.ToInt32(from + range/3 + increaseFactor)
                : Convert.ToInt32(from + 2*range/3 + increaseFactor);
            var toCalculated = range > from/3 ? Convert.ToInt32(to + range/3 + increaseFactor)
                : Convert.ToInt32(to + 2*range/3 + increaseFactor*2);

            return new DamageSkillStat(fromCalculated, toCalculated, level, tier);
        }

        public static List<ISkillDamageStat> CalculateSkillDamageLevels(ISkillDamageStat startStats) {
            var sampleData = new List<ISkillDamageStat>() { startStats };
            var stats = startStats;
            var tier = startStats.Tier;

            for (int lvl = stats.Level; lvl <= 20; lvl++) {
                stats.Level = lvl;

                var data = stats;
                stats = lvl >= 6  + tier*2 || lvl <= 14-tier ? CalculateSkillPower2(data) : CalculateSkillPower1(data);
                if (stats.From == data.From)
                    stats.From = data.From + 1;
                if (stats.From == stats.To)
                    stats.To = stats.From + 1;
                if (stats.To == data.To)
                    stats.To = stats.To + 1;

                stats.Level = lvl+1;
                stats.Tier = tier;
                sampleData.Add(stats);
            }

            return sampleData;
        }

        private static ISkillDamageStat CalculateSkillPowerPrimary (IClassDefinition classInfo) {
            var skillDamageStat = new DamageSkillStat(1, 1, 1);

            var fibonacciLine = new List<int> { 1, 2, 3, 5, 8, 13, 21, 34, 55 };
            var squareRootLine = new List<int> { 1, 4, 9, 16, 25, 36, 49 };

            var from = fibonacciLine.IndexOf(fibonacciLine.FirstOrDefault(c => c > classInfo.Level));
            var skillBonus = Convert.ToInt32(Math.Sqrt(squareRootLine.IndexOf(squareRootLine.FirstOrDefault(c => c > classInfo.Level))));

            if (classInfo.ClassType == ClassTypeEnum.Sorceress)
                skillBonus += Convert.ToInt32(Math.Sqrt(1 + skillBonus));

            skillDamageStat.From = from;
            skillDamageStat.To = from + skillBonus;
            skillDamageStat.Level = classInfo.Level;

            return skillDamageStat;
        }

        public static List<ISkillDamageStat> CalculateHitDamageLevels(IClassDefinition classInfo) {
            var sampleData = new List<ISkillDamageStat>();

            for (int lvl = 1; lvl < 20; lvl++) {
                var data = CalculateSkillPowerPrimary(classInfo);
                sampleData.Add(data);
            }

            return sampleData;
        }

        public static DamageSkillStat CalculateHitData(IClassDefinition classInfo) {
            var data = CalculateHitDamageLevels(classInfo).FirstOrDefault(x => x.Level == classInfo.Level);

            var selected = new DamageSkillStat(data.From, data.To, 0, 0, 0, 0);
            selected.Level = classInfo.Level;
            return selected;
        }
    }
}
