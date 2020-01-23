namespace D4ST_Api.Data
{
    public class StatCalculator
    {
        // function getAngelicPowerData(angelic, angelicMastery) {
        //     var angelicBonuses = new AngelicAffixesModel(
        //         //ProcPercentage:
        //         (25 + angelic/2 * Math.pow(1.1, angelicMastery || 0)).toFixed(2)
        //         //LifeBonus
        //         , (angelic*5 * Math.pow(1.1, angelicMastery || 0)).toFixed(2)
        //         //LifePerHit:
        //         , ((1 + parseInt(angelic/6)) * Math.pow(1.2, angelicMastery || 0)).toFixed(2) // in % of damage done
        //         //LifeReturn:
        //         , ((1 + parseInt(angelic/8)) * Math.pow(1.1, angelicMastery || 0)).toFixed(2) // in spell % of damage done
        //         //LifeRegenRate:
        //         , ((1 + (parseInt(angelic/4) + 1)) * Math.pow(1.2, angelicMastery || 0)).toFixed(2) //per sec
        //         //DamageTakenReduction:
        //         , ((1 + (parseInt(angelic/8) + 1)) * Math.pow(1.1, angelicMastery || 0)).toFixed(2) //per hit
        //         //MagicDamageReduction:
        //         , ((1 + (parseInt(angelic/2) + 1)) * Math.pow(1.1, angelicMastery || 0)).toFixed(2) //spell
        //         //DecayRate:
        //         , (parseInt(angelic*2) * Math.pow(1.1, angelicMastery || 0)).toFixed(2) // increase in % (default = 5/sec)
        //         //FasterCastRate:
        //         , (1 + parseInt(angelic*0.75) * Math.pow(1.05, angelicMastery || 0)).toFixed(2) // in %
        //         //DebuffReduction:
        //         , ((5 + angelic/2) * Math.pow(1.1, angelicMastery || 0)).toFixed(2) // in %
        //         //CCReduction:
        //         , 5 + (angelicMastery || 0) * 2 // in %
        //     );
        //     return angelicBonuses
        // };

        // function getDemonicPowerData(demonic, demonicMastery) {
        //     var demonicBonuses = new DemonicAffixesModel(
        //         //ProcPercentage:
        //         (25 + demonic/2 * Math.pow(1.1, demonicMastery || 0)).toFixed(2)
        //         //ResourceBonus:
        //         , (demonic*3 * Math.pow(1.1, demonicMastery || 0)).toFixed(2)
        //         // ResourceGenerationRate:
        //         , ((parseInt(demonic/6) + 1) * Math.pow(1.1, demonicMastery || 0)).toFixed(2) // in %, amplifier of generators
        //         // CostReduction:
        //         , ((parseInt(demonic/4) + 1) * Math.pow(1.1, demonicMastery || 0)).toFixed(2) // in %, resource cost reduction
        //         // CDThreshold:
        //         , (60 - (demonicMastery * 2)).toFixed(2) // spells that have cooldown longer than 10 sec get additional charges // * (Math.pow(1.1, demonicMastery || 0)))
        //         // ReduceDamagePerHit:
        //         , (demonic * Math.pow(1.1, demonicMastery || 0)).toFixed(2) // per hit (target) for ReductionDuration seconds
        //         // ReduceSpellDamage:
        //         , (1 + parseInt(demonic/4) * Math.pow(1.1, demonicMastery || 0)).toFixed(2) // in % (target) for 2 seconds
        //         // DebuffDuration:
        //         , ((1 + demonic/10) * Math.pow(1.1, demonicMastery || 0)).toFixed(2)
        //         // StaggerRed:
        //         , (parseInt(demonic*2) * Math.pow(1.05, demonicMastery || 0)).toFixed(2)
        //         // StaggerRedPerSpell:
        //         , (parseInt(demonic*4) * Math.pow(1.1, demonicMastery || 0)).toFixed(2)
        //         // CCReduction:
        //         , 5  + (demonicMastery || 0) * 2 // in %
        //         // CheatDeath:
        //         , 300 - demonicMastery * 10
        //     );
        //     return demonicBonuses
        // };

        // function getAncestralPowerData(ancestral, ancestralMastery) {
        //     var ancestralBonuses = new AncestralAffixesModel(
        //         //, ProcRate:
        //         (5 + (ancestral/2 * Math.pow(1.1, ancestralMastery || 0))).toFixed(2)              // bonus points
        //         //DamagePerHit:
        //         , 1 + (ancestral*2 * Math.pow(1.1, ancestralMastery || 0)).toFixed(2)  // per hit
        //         //, SpellPower:
        //         , (ancestral/2 * Math.pow(1.05, ancestralMastery || 0)).toFixed(2) // bonus in %
        //         //, StaggerPerHit:
        //         , (parseInt(ancestral*2) * Math.pow(1.05, ancestralMastery || 0)).toFixed(2) // per hit
        //         //, StaggerRate:
        //         , (parseInt(ancestral*2) * Math.pow(1.1, ancestralMastery || 0)).toFixed(2)    // per spell
        //         //, StaggerPool:
        //         , (ancestral*4 * Math.pow(1.1, ancestralMastery || 0)).toFixed(2)              // bonus points
        //         //, MoveSpeed:
        //         , (parseInt(ancestral/2) * Math.pow(1.05, ancestralMastery || 0)).toFixed(2)   // in %
        //         //, AttackSpeed:
        //         , (parseInt(ancestral/2) * Math.pow(1.05, ancestralMastery || 0)).toFixed(2)   // in %
        //         //, CooldownRedRate:
        //         , (parseInt(ancestral/2) * Math.pow(1.1, ancestralMastery || 0)).toFixed(2)  // in %
        //         //, DebuffReduction:
        //         , ((5 + ancestral/2) * Math.pow(1.1, ancestralMastery || 0)).toFixed(2) // in %
        //         //, CCReduction:
        //         , 5 + (ancestralMastery || 0) * 2 // in %
        //     );
        //     return ancestralBonuses
        // };

        // function getAffixPowersTemplate(angelic, demonic, ancestral, angelicMastery, demonicMastery, ancestralMastery) {
        //     return { Angelic: getAngelicPowerData(angelic, angelicMastery), Demonic: getDemonicPowerData(demonic, demonicMastery), Ancestral: getAncestralPowerData(ancestral, ancestralMastery) }
        // }

        // function calculateSkillPower(from, to, level, tier) {
        //     var range = parseInt(to-from);
        //     var initFactor = level <= 3 ? level * 2 : level;
        //     var increaseFactor = level <= 4 ? initFactor : level/(5-tier);

        //     var fromNew = range > from/initFactor ? parseInt(from + range/3 + initFactor)
        //     : parseInt(from + 2*range/initFactor + increaseFactor);
        //     var toNew = range > from/3 ? parseInt(to + range/3 + initFactor)
        //     : parseInt(to + 2*range/3 + increaseFactor);

        //     return { From: fromNew, To: toNew, Level: level, Tier: tier };
        // }

        // function calculateSkill2Power(from, to, level, tier) {
        //     var range = parseInt(to-from);
        //     var increaseFactor = level/(5-tier);
        //     var fromNew = range > from/3 ? parseInt(from + range/3 + increaseFactor)
        //     : parseInt(from + 2*range/3 + increaseFactor);
        //     var toNew = range > from/3 ? parseInt(to + range/3 + increaseFactor)
        //     : parseInt(to + 2*range/3 + increaseFactor*2);

        //     return { From: fromNew, To: toNew, Level: level, Tier: tier };
        // }

        // function calculateSkillPowers(from, to, tier){
        //     var sampleData = [{From: from, To: to, Level: 0, Tier: tier}];
        //     for (lvl = 1; lvl < 20; lvl++) {
        //         var data = lvl >= 6  + tier || lvl <= 15-tier ? calculateSkill2Power(from, to, lvl, tier) : calculateSkillPower(from, to, lvl, tier);
        //         if (data.From == sampleData[sampleData.length - 1].From)
        //             data.From = data.From + 1;
        //         if (data.From == data.To)
        //             data.To = data.From + 1;

        //         sampleData.push(data);
        //         from = data.From;
        //         to = data.To;
        //     }

        //     return sampleData;
        // }

        // function calculateSkillAffixPowers(data, tier, power1, power2, power3) {
        //     var sampleData = new SkillAffixesModel(power1, power2, power3);

        //     return sampleData;
        // }

        // // Signature = returns (SkillWithAffixesModel) from (SkillModel, PowerModel, MasteryModel, SkillAffixesModel)
        // function procRateCalculator(data, powerData, masteryData, affixData, powerType, skillType) {
        //     // TODO: Connect affix model to data model to gain proc chances and A/D bonuses for them to calculate skill bonuses
        // }

        // function procBonusCalculator(data, powerData, masteryData, affixData, powerType, skillType) {
        //     // TODO: Connect affix model to data model to gain proc chances and A/D bonuses for them to calculate skill bonuses
        // }

        // function procPercCalculator(data, powerData, masteryData, affixData, powerType, skillType) {
        //     // TODO: Connect affix model to data model to gain proc chances and A/D bonuses for them to calculate skill bonuses
        // }

        // function procDurationCalculator(data, powerData, masteryData, affixData, powerType, skillType) {
        //     // TODO: Connect affix model to data model to gain proc chances and A/D bonuses for them to calculate skill bonuses
        // }

    }
}
