import { IDescribable } from '../IDescribable';
import { IPowerUp } from '../IPowerUp';
import { ItemWeaponTypesEnum, DamageTypesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';

export class ItemDamageStats implements IDescribable, IPowerUp {
    WeaponType: ItemWeaponTypesEnum;
    MainDamageType: DamageTypesEnum;
    MinDamage: number;
    MaxDamage: number;
    private PowerLevel: number;

    constructor(weaponType: ItemWeaponTypesEnum, damageType?: DamageTypesEnum,  minDamage?: number, maxDamage?: number) {
        this.WeaponType = weaponType;
        this.MainDamageType = damageType;
        this.MinDamage = minDamage;
        this.MaxDamage = maxDamage;
    }

    PowerUp(){
        this.PowerLevel++;
    }
    GetData() {
        var varianceToEmpower = (100 + Helpers.getRandom(120, 140))/100;
        this.MinDamage *= Math.pow(varianceToEmpower, this.PowerLevel);
        this.MaxDamage *= Math.pow(varianceToEmpower, this.PowerLevel);
        return this;
    }
    SetLevel(level: number) { this.Level = level; }
    Level: number;

    // Stats for level1, calculate for other levels
    private GetLevel1Data():ItemDamageStats[]{
        var basicDamageTypes:ItemDamageStats[] = [];
        basicDamageTypes.push(new ItemDamageStats(ItemWeaponTypesEnum.Axe, DamageTypesEnum.BleedOrArmorReduction, 3, 9));
        basicDamageTypes.push(new ItemDamageStats(ItemWeaponTypesEnum.Bow, DamageTypesEnum.PoisonOrBurn, 3, 5));
        basicDamageTypes.push(new ItemDamageStats(ItemWeaponTypesEnum.Hammer, DamageTypesEnum.KnockbackOrRoot, 5, 7));
        basicDamageTypes.push(new ItemDamageStats(ItemWeaponTypesEnum.Javelin, DamageTypesEnum.ChainOrPierceAttack, 1, 10));
        basicDamageTypes.push(new ItemDamageStats(ItemWeaponTypesEnum.Sword, DamageTypesEnum.Physical, 4, 8));
        basicDamageTypes.push(new ItemDamageStats(ItemWeaponTypesEnum.Wand, DamageTypesEnum.SpellOrSummon, 2, 6));
        return basicDamageTypes;
    };

    public GetBasicWeaponStats(type?:ItemWeaponTypesEnum, damageType?:DamageTypesEnum,  level?:number) {
        var level1Data = this.GetLevel1Data();
        var selected = type!= null
        ? type == ItemWeaponTypesEnum.Axe ? level1Data[0]
        : type == ItemWeaponTypesEnum.Bow ? level1Data[1]
        : type == ItemWeaponTypesEnum.Hammer ? level1Data[2]
        : type == ItemWeaponTypesEnum.Javelin ? level1Data[3]
        : type == ItemWeaponTypesEnum.Sword ? level1Data[4]
        : level1Data[5]
        : level1Data[Helpers.getRandom(0, 5)];

        if (damageType)
            selected.MainDamageType = damageType;

        return selected;
    }

    GetDescription():string {
        return this.MinDamage + " - " + this.MaxDamage + " " + Helpers.getPropertyByValue(DamageTypesEnum, this.MainDamageType) + " damage";
    }
}
