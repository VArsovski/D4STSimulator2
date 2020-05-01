import { ItemWeaponTypesEnum, ResistanceTypesEnum, DamageTypesEnum, AffixCategoryEnum, ItemRarityTypesEnum } from 'src/_Enums/itemAffixEnums';
import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { ItemDamageStats } from '../Details/ItemDamageStats';
import { ItemDamageEmpowerStats, ItemDamageCategoryStats } from '../Details/ItemDamageEmpowerStats';

export class DamageAffixHelper {
    public GetByIndex(category: AffixCategoryEnum, level: number, powerLevel:number, itemType:ItemWeaponTypesEnum, damageType:DamageTypesEnum, elementalDamageType:ResistanceTypesEnum):ItemAffixOutput {
        var damageAffix = new ItemDamageStats(category, level, powerLevel, itemType, 0, 0, damageType, elementalDamageType);
        return new ItemAffixOutput(category, damageAffix);
    }
}

export class DamageEmpowerAffixHelper {
    public GetByIndex(category: AffixCategoryEnum, level: number, powerLevel:number, itemType:ItemWeaponTypesEnum, rarityType:ItemRarityTypesEnum, damageType:DamageTypesEnum, empowerPercentage:number, elementalDamageType:ResistanceTypesEnum):ItemAffixOutput {
        // var amount = Helpers.getRandom(3, 4);
        var damageAffix = new ItemDamageEmpowerStats(category, empowerPercentage, level, powerLevel, itemType, rarityType, new ItemDamageCategoryStats(damageType, elementalDamageType, empowerPercentage));
        return new ItemAffixOutput(category, damageAffix);
    }
}
