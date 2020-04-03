import { ItemWeaponTypesEnum, ResistanceTypesEnum } from 'src/_Enums/itemAffixEnums';
import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { ItemDamageStats } from '../Details/ItemDamageStats';

export class DamageAffixHelper {
    public GetByIndex(level: number, powerLevel:number, itemType:ItemWeaponTypesEnum, damageType:number, omitPrimaryDamage:boolean):ItemAffixOutput {
        var delimiter = 7;

        var selected = itemType % delimiter == 1 ? ItemWeaponTypesEnum.Axe
        : itemType % delimiter == 2 ? ItemWeaponTypesEnum.Bow
        : itemType % delimiter == 3 ? ItemWeaponTypesEnum.Hammer
        : itemType % delimiter == 4 ? ItemWeaponTypesEnum.Sword
        : itemType % delimiter == 5 ? ItemWeaponTypesEnum.Javelin
        : itemType % delimiter == 6 ? ItemWeaponTypesEnum.Wand
        : ItemWeaponTypesEnum.Staff;

        delimiter = 5;
        var selectedResDamageType = damageType % delimiter == 1 ? ResistanceTypesEnum.Physical
        : damageType % delimiter == 2 ? ResistanceTypesEnum.Fire
        : damageType % delimiter == 3 ? ResistanceTypesEnum.Cold
        : damageType % delimiter == 4 ? ResistanceTypesEnum.Lightning
        : ResistanceTypesEnum.Poison;

        var damageAffix = new ItemDamageStats(level, powerLevel, selected, selectedResDamageType);
        if (!omitPrimaryDamage)
            damageAffix = damageAffix.GetBasicWeaponStats(selected, selectedResDamageType);

        return new ItemAffixOutput(null, null, damageAffix);
    }
}
