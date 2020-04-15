import { IDescribable } from '../IDescribable';
import { ItemWeaponTypesEnum, DamageTypesEnum, ResistanceTypesEnum, ItemCategoriesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';

export class ItemDamageNumberStats {
    WeaponType: ItemWeaponTypesEnum;
    MinDamage: number;
    MaxDamage: number;

    constructor(weaponType:ItemWeaponTypesEnum, minDamage:number, maxDamage:number) {
        this.WeaponType = weaponType;
        this.MinDamage = minDamage;
        this.MaxDamage = maxDamage;
    }
}

export class ItemDamageCategoryStats {
    MainDamageType: DamageTypesEnum;
    ElementType: ResistanceTypesEnum;
    EmpowerPercentage: number;

    constructor(damageType:DamageTypesEnum, elementType:ResistanceTypesEnum, percentage:number) {
        this.MainDamageType = damageType;
        this.ElementType = elementType;
        this.EmpowerPercentage = percentage;
    }
}

export class ItemDamageStats implements IDescribable {
    IsPrimaryDamage: boolean;
    WeaponType: ItemWeaponTypesEnum;
    MinDamage: number;
    MaxDamage: number;
    DamageData:ItemDamageCategoryStats;
    private Level:number;
    private PowerLevel: number;

    constructor(isPrimary:boolean, level:number, powerLevel:number, weaponType: ItemWeaponTypesEnum, minDamage?: number, maxDamage?: number, damageData?:ItemDamageCategoryStats) {
        this.IsPrimaryDamage = isPrimary;
        this.PowerLevel = powerLevel;
        this.Level = level;
        this.WeaponType = weaponType;
        this.MinDamage = minDamage;
        this.MaxDamage = maxDamage;
        this.DamageData = damageData;

        var data = this.GetBasicWeaponStats(this.WeaponType);
        if (isPrimary) {
            if (!(minDamage || maxDamage)) {
                this.MinDamage = data.MinDamage;
                this.MaxDamage = data.MaxDamage;
            }
        }

        if (!this.DamageData) {
            this.DamageData = this.GetCategoryWeaponStats(this.WeaponType);
    
            // Initialize EmpowerPercentage Logic
            var powerFactor = this.WeaponType == ItemWeaponTypesEnum.Wand || this.WeaponType == ItemWeaponTypesEnum.Staff ? 3 : 1;
            this.DamageData.EmpowerPercentage = new CalculationsHelper().getWeaponEmpoweredValue(this.DamageData.EmpowerPercentage, powerFactor);
        }
    }

    // Stats for level1, calculate for other levels
    private GetLevelData():ItemDamageNumberStats[]{
        var basicDamageTypes:ItemDamageNumberStats[] = [];
        basicDamageTypes.push(new ItemDamageNumberStats(ItemWeaponTypesEnum.Axe, 2, 10));
        basicDamageTypes.push(new ItemDamageNumberStats(ItemWeaponTypesEnum.Bow, 3, 8));
        basicDamageTypes.push(new ItemDamageNumberStats(ItemWeaponTypesEnum.Hammer, 6, 8));
        basicDamageTypes.push(new ItemDamageNumberStats(ItemWeaponTypesEnum.Javelin, 1, 12));
        basicDamageTypes.push(new ItemDamageNumberStats(ItemWeaponTypesEnum.Sword, 4, 9));
        basicDamageTypes.push(new ItemDamageNumberStats(ItemWeaponTypesEnum.Wand, 3, 7));
        basicDamageTypes.push(new ItemDamageNumberStats(ItemWeaponTypesEnum.Staff, 5, 9));

        return basicDamageTypes;
    };

    private GetBasicWeaponStats(type?:ItemWeaponTypesEnum) {
        var levelData = this.GetLevelData();
        var selected = type!= null
        ? type == ItemWeaponTypesEnum.Axe ? levelData[0]
        : type == ItemWeaponTypesEnum.Bow ? levelData[1]
        : type == ItemWeaponTypesEnum.Hammer ? levelData[2]
        : type == ItemWeaponTypesEnum.Javelin ? levelData[3]
        : type == ItemWeaponTypesEnum.Sword ? levelData[4]
        : type == ItemWeaponTypesEnum.Wand ? levelData[5]
        : levelData[6]
        : levelData[Helpers.getRandom(0, 6)];

        return selected;
    }

    private GetCategoryWeaponStats(type?:ItemWeaponTypesEnum) {
        var appropriateDamageTypes = this.GetAppropriateDamageCategories(this.WeaponType);
        var selectedDamageType = appropriateDamageTypes[Helpers.getRandom(0, appropriateDamageTypes.length - 1)];
        var damageElements = this.GetAppropriateDamageElements(selectedDamageType);
        var selectedElement = damageElements[Helpers.getRandom(0, damageElements.length - 1)];
        var categoryDamageStats = new ItemDamageCategoryStats(selectedDamageType, selectedElement, 0);

        if (this.IsPrimaryDamage)
            categoryDamageStats.EmpowerPercentage = Math.round(Helpers.getRandom(1,3) + Helpers.getRandom(-1,1) + Helpers.getRandom(0, (50 - this.Level)/10));

        return categoryDamageStats;
    }

    GetDescription():string {
        var empowerTypeStr = this.GetAppropriateEmpoweredType(this.DamageData);
        var damage1 = Math.min(this.MinDamage, this.MaxDamage);
        var damage2 = Math.max(this.MinDamage, this.MaxDamage);
        if (damage1 == damage2)    // Just in case if rolls were THAT biased
            damage2 += (1+ this.Level/2);

        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
        var primaryStr = this.MinDamage && this.MaxDamage
            ? damage1 + " - " + damage2 + " " + Helpers.getPropertyByValue(ResistanceTypesEnum, this.DamageData.ElementType) + " damage" + empoweredStr : "";

        return primaryStr ? primaryStr + (empowerTypeStr ? ", " + empowerTypeStr : "") : empowerTypeStr;
    }

    GetAppropriateDamageCategories(type: ItemWeaponTypesEnum):DamageTypesEnum[] {
        var str:string = "";
        var appropriateDamageTypes:DamageTypesEnum[] = [];

        // Same as sword.. (For now), perhaps differentiate the bonuses, Sword more Cleave, Axe more Bleed
        if (type == ItemWeaponTypesEnum.Axe) {
            appropriateDamageTypes.push(DamageTypesEnum.BleedOrArmorReduction);
            appropriateDamageTypes.push(DamageTypesEnum.CleaveOrAoE);
            appropriateDamageTypes.push(DamageTypesEnum.Physical);
        }

        if (type == ItemWeaponTypesEnum.Bow) {
            appropriateDamageTypes.push(DamageTypesEnum.PoisonOrBurn);
            appropriateDamageTypes.push(DamageTypesEnum.ChainOrPierceAttack);
            appropriateDamageTypes.push(DamageTypesEnum.FreezeOrRoot);
        }

        if (type == ItemWeaponTypesEnum.Hammer) {
            appropriateDamageTypes.push(DamageTypesEnum.KnockbackOrStun);
            appropriateDamageTypes.push(DamageTypesEnum.FreezeOrRoot);
            appropriateDamageTypes.push(DamageTypesEnum.Physical);
        }

        if (type == ItemWeaponTypesEnum.Sword) {
            appropriateDamageTypes.push(DamageTypesEnum.Physical);
            appropriateDamageTypes.push(DamageTypesEnum.CleaveOrAoE);
            appropriateDamageTypes.push(DamageTypesEnum.BleedOrArmorReduction);
        }

        if (type == ItemWeaponTypesEnum.Javelin) {
            appropriateDamageTypes.push(DamageTypesEnum.ChainOrPierceAttack);
            appropriateDamageTypes.push(DamageTypesEnum.Physical);
            appropriateDamageTypes.push(DamageTypesEnum.BleedOrArmorReduction);
        }

        if (type == ItemWeaponTypesEnum.Wand) {
            appropriateDamageTypes.push(DamageTypesEnum.ProjectileOrSummon);
            appropriateDamageTypes.push(DamageTypesEnum.FreezeOrRoot);
            appropriateDamageTypes.push(DamageTypesEnum.PoisonOrBurn);
            appropriateDamageTypes.push(DamageTypesEnum.ChainOrPierceAttack);
        }

        if (type == ItemWeaponTypesEnum.Staff) {
            appropriateDamageTypes.push(DamageTypesEnum.FreezeOrRoot);
            appropriateDamageTypes.push(DamageTypesEnum.KnockbackOrStun);
            appropriateDamageTypes.push(DamageTypesEnum.PoisonOrBurn);
        }

        return appropriateDamageTypes;
    }

    GetAppropriateDamageElements(type: DamageTypesEnum):ResistanceTypesEnum[] {
        var str:string = "";
        var appropriateDamageTypes:ResistanceTypesEnum[] = [];

        if (type == DamageTypesEnum.BleedOrArmorReduction || type == DamageTypesEnum.CleaveOrAoE) {
            appropriateDamageTypes.push(ResistanceTypesEnum.Physical);
            appropriateDamageTypes.push(ResistanceTypesEnum.Lightning);
            appropriateDamageTypes.push(ResistanceTypesEnum.Fire);
        }

        if (type == DamageTypesEnum.PoisonOrBurn) {
            appropriateDamageTypes.push(ResistanceTypesEnum.Poison);
            appropriateDamageTypes.push(ResistanceTypesEnum.Fire);
            appropriateDamageTypes.push(ResistanceTypesEnum.Physical);
        }

        if (type == DamageTypesEnum.KnockbackOrStun) {
            appropriateDamageTypes.push(ResistanceTypesEnum.Cold);
            appropriateDamageTypes.push(ResistanceTypesEnum.Lightning);
            appropriateDamageTypes.push(ResistanceTypesEnum.Physical);
        }

        if (type == DamageTypesEnum.ChainOrPierceAttack) {
            appropriateDamageTypes.push(ResistanceTypesEnum.Physical);
            appropriateDamageTypes.push(ResistanceTypesEnum.Lightning);
            appropriateDamageTypes.push(ResistanceTypesEnum.Poison);
        }

        if (type == DamageTypesEnum.ProjectileOrSummon) {
            appropriateDamageTypes.push(ResistanceTypesEnum.Fire);
            appropriateDamageTypes.push(ResistanceTypesEnum.Lightning);
            appropriateDamageTypes.push(ResistanceTypesEnum.Cold);
        }

        if (type == DamageTypesEnum.FreezeOrRoot) {
            appropriateDamageTypes.push(ResistanceTypesEnum.Cold);
            appropriateDamageTypes.push(ResistanceTypesEnum.Poison);
            appropriateDamageTypes.push(ResistanceTypesEnum.Physical);
        }

        if (type == DamageTypesEnum.Physical) {
            appropriateDamageTypes.push(ResistanceTypesEnum.Physical);
        }

        return appropriateDamageTypes;
    }    
    
    GetAppropriateEmpoweredType(data:ItemDamageCategoryStats) {
        if (!this.DamageData && !this.DamageData.EmpowerPercentage)
            return "";

        return Helpers.getPropertyByValue(DamageTypesEnum, data.MainDamageType) + " damage increased by " + data.EmpowerPercentage + "%";
    }
}
