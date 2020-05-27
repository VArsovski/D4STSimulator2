import { AffixCategoryEnum, SecondaryStatTypesEnum, ResistanceTypesEnum, BasicStatsEnum, ItemWeaponTypesEnum, ItemRarityTypesEnum } from 'src/_Enums/itemAffixEnums';
import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { ItemSecondaryBasicStats } from '../Details/ItemSecondaryBasicStats';
import { ItemBasicResistanceStatsDetail, ItemSimpleStats } from '../Details/ItemSimpleStats';
import { Helpers } from 'src/_Helpers/helpers';
import { ItemCCStatsDetail } from '../Details/ItemCCStatsDetail';
import { ItemTrapsDetail } from '../Details/ItemTrapsDetail';
import { ItemDamageEmpowerStats, ItemDamageCategoryStats } from '../Details/ItemDamageEmpowerStats';
import { ItemSkillTypeStats } from '../Details/ItemSkillTypeStats';
import { SkillSpellStatsEnum, SkillCategoryTypesEnum } from 'src/_Enums/triggerAffixEnums';

export class SecondaryStatAffixHelper {
    GetByIndex(category: AffixCategoryEnum, level: number, powerLevel: number, type: SecondaryStatTypesEnum, amount: number, amountPerc:number): ItemAffixOutput {
        var delimiter = 6;
        var selected =
        // Resistance = 1,           // EmpowerTrapsAndSummons = 4,
        // ReduceCCTaken = 2,        // ReduceDamageTaken = 5,
        // IncreaseStatSunder = 3,   // EmpowerSkillType = 6
          type % delimiter == 1 ? SecondaryStatTypesEnum.Resistance
        : type % delimiter == 2 ? SecondaryStatTypesEnum.ReduceCCTaken
        : type % delimiter == 3 ? SecondaryStatTypesEnum.IncreaseStatSunder
        : type % delimiter == 4 ? SecondaryStatTypesEnum.EmpowerTrapsAndSummons
        : type % delimiter == 5 ? SecondaryStatTypesEnum.ReduceDamageTaken
        : SecondaryStatTypesEnum.EmpowerSkillType;

        var selectedRes = Helpers.getRandom(2, 6);
        if (selectedRes == 6)
            // If allRes, then reduce the amount, not less than 3% though
            amount = Math.min(3, Math.round(amount * Helpers.getRandom(45, 60)/100));

        var statRes = selected == 1 ? new ItemBasicResistanceStatsDetail(level, powerLevel, amount, selectedRes) : null;
        var statCC = selected == 2 ? new ItemCCStatsDetail(level, powerLevel, amount, amountPerc, Helpers.getRandom(1,6)) : null;
        var statSunder = selected == 3 ? new ItemSimpleStats(level, powerLevel, amount, amountPerc, Helpers.getPropertyByValue(BasicStatsEnum, Helpers.getRandom(2,4))) : null;
        var statTrapsSummons = selected == 4 ? new ItemTrapsDetail(level, powerLevel, Helpers.getRandom(0,6), Helpers.getRandom(1,3), amount, amountPerc) : null;
        var statDamage = selected == 5 ? new ItemDamageEmpowerStats(category, amount, level, powerLevel, ItemWeaponTypesEnum.Wand, ItemRarityTypesEnum.Legendary, new ItemDamageCategoryStats(Helpers.getRandom(1,5), selectedRes, amountPerc)) : null;

        var hasData = statRes || statCC || statSunder || statTrapsSummons || statDamage;
        if (!hasData) {
            debugger;
        }

        var selectedSkillCategory = Helpers.getRandom(1,10);
        // Summons get Buffed with the "statTrapsSummons" stat, whilest Barriers are VERY rare to be considered here
        if (selectedSkillCategory == SkillCategoryTypesEnum.Summon || selectedSkillCategory == SkillCategoryTypesEnum.Barrier)
            selectedSkillCategory += 2;
        // Since TBS is also rare, increase it's PowerLevel by quite a bit..
        if (selected == 5 && selectedSkillCategory == SkillCategoryTypesEnum.BannerTotemShout)
            powerLevel += 3;
        var selectedSkillSelectedType = this.GetAppropriateSkillSpellStatForCategory(selectedSkillCategory);

        var statSkillEmpower = selected == 6 ? new ItemSkillTypeStats(level, powerLevel, selectedSkillCategory, selectedSkillSelectedType, amount, amount) : null;
        var secondaryBasicStat = new ItemSecondaryBasicStats(category, level, powerLevel, selected, statRes, statCC, statSunder, statTrapsSummons, statDamage, statSkillEmpower);
        return new ItemAffixOutput(category, secondaryBasicStat);
    }

    GetAppropriateSkillSpellStatForCategory(skillCategory: number): SkillSpellStatsEnum {
        debugger;
        var appropriateAffixes: SkillSpellStatsEnum[] = [];

        if (skillCategory == SkillCategoryTypesEnum.Finisher) { appropriateAffixes.push(SkillSpellStatsEnum.IncreaseDamage); }
        if (skillCategory == SkillCategoryTypesEnum.Ultimate) { appropriateAffixes.push(SkillSpellStatsEnum.ReduceCD); appropriateAffixes.push(SkillSpellStatsEnum.IncreaseDuration); }
        if (skillCategory == SkillCategoryTypesEnum.Stackable) { appropriateAffixes.push(SkillSpellStatsEnum.IncreaseDamage); appropriateAffixes.push(SkillSpellStatsEnum.IncreaseDuration); }
        // if (skillCategory == SkillCategoryTypesEnum.Summon) { appropriateAffixes.push(SkillSpellStatsEnum.IncreaseDamage); appropriateAffixes.push(SkillSpellStatsEnum.IncreaseDuration); }
        // if (skillCategory == SkillCategoryTypesEnum.Barrier) { appropriateAffixes.push(SkillSpellStatsEnum.ReduceCost); appropriateAffixes.push(SkillSpellStatsEnum.IncreaseDuration); }
        if (skillCategory == SkillCategoryTypesEnum.HighCost) { appropriateAffixes.push(SkillSpellStatsEnum.ReduceCost); appropriateAffixes.push(SkillSpellStatsEnum.IncreaseDamage); }
        if (skillCategory == SkillCategoryTypesEnum.HighCD) { appropriateAffixes.push(SkillSpellStatsEnum.ReduceCD); }
        if (skillCategory == SkillCategoryTypesEnum.Weak) { appropriateAffixes.push(SkillSpellStatsEnum.IncreaseDamage); }
        if (skillCategory == SkillCategoryTypesEnum.BannerTotemShout) { appropriateAffixes.push(SkillSpellStatsEnum.IncreaseProcChance); appropriateAffixes.push(SkillSpellStatsEnum.IncreaseDuration); }
        if (skillCategory == SkillCategoryTypesEnum.Setup) { appropriateAffixes.push(SkillSpellStatsEnum.ReduceCost); appropriateAffixes.push(SkillSpellStatsEnum.ReduceCD); appropriateAffixes.push(SkillSpellStatsEnum.IncreaseDuration); }

        return appropriateAffixes[Helpers.getRandom(0, appropriateAffixes.length - 1)];
    }
}
