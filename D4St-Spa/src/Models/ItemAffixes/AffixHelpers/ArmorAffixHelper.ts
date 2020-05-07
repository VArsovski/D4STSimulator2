import { ItemArmorTypesEnum, ArmorTypesEnum, AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { ItemArmorStats } from '../Details/ItemArmorStats';

export class ArmorAffixHelper {
    public GetByIndex(category:AffixCategoryEnum, level:number, powerLevel:number, itemType:ItemArmorTypesEnum, armorType:ArmorTypesEnum, isPrimary:boolean):ItemAffixOutput {

        var delimiter = 5;
        var selected =
          itemType % delimiter == 1 ? ItemArmorTypesEnum.Boots
        : itemType % delimiter == 2 ? ItemArmorTypesEnum.Chest
        : itemType % delimiter == 3 ? ItemArmorTypesEnum.Gloves
        : itemType % delimiter == 4 ? ItemArmorTypesEnum.Helm
        : ItemArmorTypesEnum.Pants;

        delimiter = 3;
        var selectedType = armorType % delimiter == 1 ? ArmorTypesEnum.Heavy
        : armorType % delimiter == 2 ? ArmorTypesEnum.Light
        : ArmorTypesEnum.Mystic;
    
        var armorStat = new ItemArmorStats(category, level, powerLevel, selected, selectedType);
        return new ItemAffixOutput(category, armorStat);
    }
}
