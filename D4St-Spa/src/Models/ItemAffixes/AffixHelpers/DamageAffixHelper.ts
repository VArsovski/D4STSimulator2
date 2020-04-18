import { ItemWeaponTypesEnum, ResistanceTypesEnum, DamageTypesEnum } from 'src/_Enums/itemAffixEnums';
import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { ItemDamageStats, ItemDamageCategoryStats } from '../Details/ItemDamageStats';

export class DamageAffixHelper {
    public GetByIndex(level: number, powerLevel:number, itemType:ItemWeaponTypesEnum, damageType:DamageTypesEnum, elementalDamageType:ResistanceTypesEnum, addPrimary:boolean, addEmpower:boolean):ItemAffixOutput {
        var damageAffix = new ItemDamageStats(addPrimary, addEmpower, level, powerLevel, itemType, 0, 0, new ItemDamageCategoryStats(damageType, elementalDamageType, 0));
        return new ItemAffixOutput(null, null, damageAffix);
    }
}
