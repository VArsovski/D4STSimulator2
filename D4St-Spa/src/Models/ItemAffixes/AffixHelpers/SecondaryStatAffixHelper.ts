import { AffixCategoryEnum, SecondaryStatTypesEnum, ResistanceTypesEnum } from 'src/_Enums/itemAffixEnums';
import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { ItemSecondaryBasicStats } from '../Details/ItemSecondaryBasicStats';
import { ItemBasicResistanceStatsDetail, ItemSimpleStats } from '../Details/ItemSimpleStats';
import { Helpers } from 'src/_Helpers/helpers';

export class SecondaryStatAffixHelper {
    GetByIndex(category: AffixCategoryEnum, level: number, powerLevel: number, type: SecondaryStatTypesEnum, amount: number, amountPerc:number): ItemAffixOutput {
        var delimiter = 6;
        var selected =
        // Resistance = 1,              // EmpowerTrapsAndSummons = 4,
        // CCReduction = 2,             // RedirectDamage = 5,
        // DamageTakenReduced = 3,      // IncreaseStatSunder = 6
          type % delimiter == 1 ? SecondaryStatTypesEnum.Resistance
        : type % delimiter == 2 ? SecondaryStatTypesEnum.CCReduction
        : type % delimiter == 3 ? SecondaryStatTypesEnum.DamageTakenReduced
        : type % delimiter == 4 ? SecondaryStatTypesEnum.EmpowerTrapsAndSummons
        : type % delimiter == 5 ? SecondaryStatTypesEnum.RedirectDamage
        : SecondaryStatTypesEnum.IncreaseStatSunder;

        var selectedRes = Helpers.getRandom(2, 6);
        if (selectedRes == 6)
            // If allRes, then reduce the amount, not less than 3% though
            amount = Math.min(3, Math.round(amount * Helpers.getRandom(45, 55)/100));

        var statData = selected != 1 ? new ItemSimpleStats(level, powerLevel, amount, amountPerc, Helpers.getPropertyByValue(SecondaryStatTypesEnum, selected)) : null;
        var statRes = selected == 1 ? new ItemBasicResistanceStatsDetail(level, powerLevel, amount, selectedRes) : null;
        var stat1 = selected == 2 ? statData : null;
        var stat2 = selected == 3 ? statData : null;
        var stat3 = selected == 4 ? statData : null;
        var stat4 = selected == 5 ? statData : null;
        var stat5 = selected == 6 ? statData : null;

        var triggerStat = new ItemSecondaryBasicStats(category, level, powerLevel, selected, statRes, stat1, stat2, stat3, stat4, stat5);
        return new ItemAffixOutput(category, triggerStat);
    }
}
