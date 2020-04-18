import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { BasicAffixEnum } from 'src/_Enums/itemAffixEnums';
import { ItemBasicStats, BasicStatTypesEnum } from '../Details/ItemBasicStats';
import { Helpers } from 'src/_Helpers/helpers';
import { SkillVM } from 'src/Models/SkillVM';

export class BasicAffixHelper {
    public GetByIndex(level:number, powerLevel:number, index:number, amount:number, skillData:SkillVM):ItemAffixOutput {
        var selected:BasicAffixEnum;
        var basicAffix:ItemBasicStats = new ItemBasicStats(level);
        var delimiter = 6;

        BasicStatTypesEnum.PowerStats
        if (index % delimiter == 1) {
            selected = BasicAffixEnum.IncreaseBasicPower;
            basicAffix.SetPowers(level, powerLevel, amount, Helpers.getRandom(1,4));
        }
        if (index % delimiter == 2) {
            selected = BasicAffixEnum.IncreaseBasicStat;
            basicAffix.SetBasicStat(level, powerLevel, amount, Helpers.getRandom(1,3));
        }
        if (index % delimiter == 3) {
            selected = BasicAffixEnum.IncreaseStatRegen;
            basicAffix.SetBasicStat(level, powerLevel, amount, Helpers.getRandom(1,3));
        }
        if (index % delimiter == 4) {
            selected = BasicAffixEnum.IncreaseResistance;//  BasicAffixEnum.IncreaseStatRegenPercentage;
            basicAffix.SetBasicStat(level, powerLevel, amount, Helpers.getRandom(1,3));
        }
        if (index % delimiter == 5) {
            selected = BasicAffixEnum.IncreaseSkillStat;
            basicAffix.SetSkill(level, skillData, powerLevel);
        }
        if (index % delimiter == 0) {
            selected = BasicAffixEnum.Socket;
            basicAffix.SetSocket();
        }

        return new ItemAffixOutput(null, null, null, basicAffix);
    }
}
