import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { AffixCategoryEnum, BasicStatTypesEnum } from 'src/_Enums/itemAffixEnums';
import { ItemBasicStats } from '../Details/ItemBasicStats';
import { Helpers } from 'src/_Helpers/helpers';
import { SkillVM } from 'src/Models/SkillVM';

export class BasicAffixHelper {
    public GetByIndex(category:AffixCategoryEnum, level:number, powerLevel:number, index:BasicStatTypesEnum, amount:number, skillData:SkillVM):ItemAffixOutput {
        var selected:BasicStatTypesEnum;
        var basicAffix:ItemBasicStats = new ItemBasicStats(category, level, powerLevel);
        var delimiter = 8;

        if (index % delimiter == BasicStatTypesEnum.PowerStats) {
            selected = BasicStatTypesEnum.PowerStats;
            basicAffix.SetPowers(level, powerLevel, amount, Helpers.getRandom(1,4));
        }
        if (index % delimiter == BasicStatTypesEnum.StatAmount) {
            selected = BasicStatTypesEnum.StatAmount;
            basicAffix.SetBasicStat(level, powerLevel, amount, Helpers.getRandom(1,3));
        }
        if (index % delimiter == BasicStatTypesEnum.StatRegen) {
            selected = BasicStatTypesEnum.StatRegen;
            basicAffix.SetStatRegen(level, powerLevel, amount, Helpers.getRandom(1,3));
        }
        if (index % delimiter == BasicStatTypesEnum.StatPercentage) {
            selected = BasicStatTypesEnum.StatPercentage;
            basicAffix.SetBasicStatPercentage(level, powerLevel, amount, Helpers.getRandom(1,3));
        }
        if (index % delimiter == BasicStatTypesEnum.StatPercentageRegen) {
            selected = BasicStatTypesEnum.StatPercentageRegen;
            basicAffix.SetRegenPercentage(level, powerLevel, amount, Helpers.getRandom(1,3));
        }
        if (index % delimiter == BasicStatTypesEnum.StatReturn) {
            selected = BasicStatTypesEnum.StatPercentageRegen;
            basicAffix.SetStatReturn(level, powerLevel, amount, Helpers.getRandom(1,2));
        }
        if (index % delimiter == BasicStatTypesEnum.Resistance) {
            selected = BasicStatTypesEnum.Resistance;
            basicAffix.SetResistance(level, powerLevel, amount, Helpers.getRandom(1,3));
        }
        if (index % delimiter == BasicStatTypesEnum.SkillEmpower) {
            selected = BasicStatTypesEnum.SkillEmpower;
            basicAffix.SetSkill(level, skillData, powerLevel);
        }
        if (index % delimiter == 0) {
            selected = BasicStatTypesEnum.Socket;
            basicAffix.SetSocket();
        }

        return new ItemAffixOutput(category, basicAffix);
    }
}
