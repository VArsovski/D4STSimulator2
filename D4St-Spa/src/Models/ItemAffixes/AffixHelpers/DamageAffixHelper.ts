import { ItemWeaponTypesEnum, ResistanceTypesEnum, DamageTypesEnum } from 'src/_Enums/itemAffixEnums';
import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { ItemDamageStats } from '../Details/ItemDamageStats';

export class DamageAffixHelper {
    public GetByIndex(level: number, powerLevel:number, itemType:ItemWeaponTypesEnum, damageType:number, isPrimary:boolean):ItemAffixOutput {
        var delimiter = 7;

        var selected =
          itemType % delimiter == 1 ? ItemWeaponTypesEnum.Axe
        : itemType % delimiter == 2 ? ItemWeaponTypesEnum.Bow
        : itemType % delimiter == 3 ? ItemWeaponTypesEnum.Hammer
        : itemType % delimiter == 4 ? ItemWeaponTypesEnum.Sword
        : itemType % delimiter == 5 ? ItemWeaponTypesEnum.Javelin
        : itemType % delimiter == 6 ? ItemWeaponTypesEnum.Wand
        : ItemWeaponTypesEnum.Staff;

        delimiter = 8;
        var selectedDamageType =
          damageType % delimiter == 1 ? DamageTypesEnum.BleedOrArmorReduction
        : damageType % delimiter == 2 ? DamageTypesEnum.PoisonOrBurn
        : damageType % delimiter == 3 ? DamageTypesEnum.KnockbackOrStun
        : damageType % delimiter == 4 ? DamageTypesEnum.CleaveOrAoE
        : damageType % delimiter == 5 ? DamageTypesEnum.ChainOrPierceAttack
        : damageType % delimiter == 6 ? DamageTypesEnum.ProjectileOrSummon
        : damageType % delimiter == 7 ? DamageTypesEnum.FreezeOrRoot
        : DamageTypesEnum.Physical;

        var damageAffix = new ItemDamageStats(isPrimary, level, powerLevel, selected, selectedDamageType);
        // if (!omitPrimaryDamage)
        //     damageAffix = damageAffix.GetBasicWeaponStats(selected, selectedDamageType);
        // if (omitDamageEffectEmpower)
        //     damageAffix.GetAppropriateEmpoweredType(new ItemDamageStats(0, 0, 0, 0, 0, 0, 0, null));

        return new ItemAffixOutput(null, null, damageAffix);
    }
}
