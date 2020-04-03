import { ItemArmorTypesEnum, ArmorTypesEnum } from 'src/_Enums/itemAffixEnums';
import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { ItemArmorStats } from '../Details/ItemArmorStats';

export class ArmorAffixHelper {
    public GetByIndex(level:number, powerLevel:number, itemType:ItemArmorTypesEnum, armorType:ArmorTypesEnum):ItemAffixOutput {

        var delimiter = 5;
        var selected = itemType % delimiter == 1 ? ItemArmorTypesEnum.Boots
        : itemType % delimiter == 2 ? ItemArmorTypesEnum.Chest
        : itemType % delimiter == 3 ? ItemArmorTypesEnum.Gloves
        : itemType % delimiter == 4 ? ItemArmorTypesEnum.Helm
        : ItemArmorTypesEnum.Pants;

        delimiter = 3;
        var selectedType = armorType % delimiter == 1 ? ArmorTypesEnum.Heavy
        : armorType % delimiter == 2 ? ArmorTypesEnum.Light
        : ArmorTypesEnum.Mystic;
    
        var armorStat = new ItemArmorStats(level, powerLevel, selected, null, null, selectedType).GetBasicArmorStats(selected, selectedType, level);
        return new ItemAffixOutput(null, armorStat);
    }
}
