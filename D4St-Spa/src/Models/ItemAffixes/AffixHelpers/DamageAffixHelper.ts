import { ItemWeaponTypesEnum, ResistanceTypesEnum, DamageTypesEnum, AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { ItemDamageStats, ItemDamageCategoryStats } from '../Details/ItemDamageStats';

export class DamageAffixHelper {
    public GetByIndex(category: AffixCategoryEnum, level: number, powerLevel:number, itemType:ItemWeaponTypesEnum, damageType:DamageTypesEnum, empowerPercentage:number, elementalDamageType:ResistanceTypesEnum, addPrimary:boolean, addEmpower:boolean):ItemAffixOutput {
        var damageAffix = new ItemDamageStats(category, addPrimary, addEmpower, level, powerLevel, itemType, 0, 0, new ItemDamageCategoryStats(damageType, elementalDamageType, empowerPercentage));
        return new ItemAffixOutput(category, damageAffix);
    }
}
