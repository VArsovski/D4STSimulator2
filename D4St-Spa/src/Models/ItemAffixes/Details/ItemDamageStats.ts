import { ItemWeaponTypesEnum, DamageTypesEnum, ResistanceTypesEnum, ItemCategoriesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { IItemAffixStats } from './IItemAffixStats';

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

export class ItemDamageStats implements IItemAffixStats {
    private AddPrimaryDamage: boolean;
    private AddEmpowerPercentage:boolean;
    WeaponType: ItemWeaponTypesEnum;
    MinDamage: number;
    MaxDamage: number;
    DamageData:ItemDamageCategoryStats;
    private Level:number;
    private PowerLevel: number;
    Amount:number; //Just to check whether there is data in here (from outside method)

    constructor(addPrimary:boolean, addEmpower:boolean, level:number, powerLevel:number, weaponType: ItemWeaponTypesEnum, minDamage?: number, maxDamage?: number, damageData?:ItemDamageCategoryStats) {

        this.Amount = -1; // Just make sure it's not 0, (again) for outside check
        this.AddPrimaryDamage = addPrimary;
        this.AddEmpowerPercentage = addEmpower;
        this.PowerLevel = powerLevel;
        this.Level = level;
        this.WeaponType = weaponType;
        this.MinDamage = minDamage;
        this.MaxDamage = maxDamage;
        this.DamageData = damageData;

        if (!this.DamageData) {
            if (this.AddPrimaryDamage) {
                var primaryDamageData = this.GetBasicWeaponStats(this.WeaponType);
                this.MinDamage = new CalculationsHelper().getDamageStatForLevel(primaryDamageData.MinDamage, this.Level);
                this.MaxDamage = new CalculationsHelper().getDamageStatForLevel(primaryDamageData.MaxDamage, this.Level);
                this.DamageData = this.GetCategoryWeaponStats(this.WeaponType);

                var powerFactor:number = 0;

                var physicalDamageTypes = [DamageTypesEnum.Physical, DamageTypesEnum.PoisonOrBurn, DamageTypesEnum.CleaveOrAoE, DamageTypesEnum.BleedOrArmorReduction];
                var bludgeonDamageTypes = [DamageTypesEnum.Physical, DamageTypesEnum.KnockbackOrStun, DamageTypesEnum.FreezeOrRoot];
                var chainPierceDamageTypes = [DamageTypesEnum.PoisonOrBurn, DamageTypesEnum.ChainOrPierceAttack, DamageTypesEnum.ProjectileOrSummon];
                var spellDamageTypes = [DamageTypesEnum.CleaveOrAoE, DamageTypesEnum.ChainOrPierceAttack, DamageTypesEnum.ProjectileOrSummon, DamageTypesEnum.FreezeOrRoot];

                var physicalWeapons = [ItemWeaponTypesEnum.Axe, ItemWeaponTypesEnum.Hammer, ItemWeaponTypesEnum.Sword, ItemWeaponTypesEnum.Javelin];
                var bludgeonWeapons = [ItemWeaponTypesEnum.Hammer, ItemWeaponTypesEnum.Staff];
                var spellWeapons = [ItemWeaponTypesEnum.Bow, ItemWeaponTypesEnum.Wand, ItemWeaponTypesEnum.Staff];
                var chainPierceWeapons = [ItemWeaponTypesEnum.Bow, ItemWeaponTypesEnum.Javelin, ItemWeaponTypesEnum.Sword];
                
                powerFactor += physicalWeapons.includes(this.WeaponType) ? physicalDamageTypes.includes(this.DamageData.MainDamageType) ? 3 : 1 : 0;
                powerFactor += bludgeonWeapons.includes(this.WeaponType) ? bludgeonDamageTypes.includes(this.DamageData.MainDamageType) || spellDamageTypes.includes(this.DamageData.MainDamageType) ? 2 : 2 : 0;
                powerFactor += chainPierceWeapons.includes(this.WeaponType) ? chainPierceDamageTypes.includes(this.DamageData.MainDamageType) ? 3 : 1 : 0;
                powerFactor += spellWeapons.includes(this.WeaponType) ? spellDamageTypes.includes(this.DamageData.MainDamageType) ? 3 : 1 : 0;

                var adequateDamageTypeEmpower = this.WeaponType == parseInt(this.DamageData.MainDamageType.toString(), 10);

                if (physicalWeapons.includes(this.WeaponType)) {
                    this.MinDamage = new CalculationsHelper().getEmpoweredValue(this.MinDamage, adequateDamageTypeEmpower ? 2 : 1);
                    this.MaxDamage = new CalculationsHelper().getEmpoweredValue(this.MaxDamage, adequateDamageTypeEmpower ? 2 : 1);
                }

                if (adequateDamageTypeEmpower)
                    powerFactor += this.WeaponType == ItemWeaponTypesEnum.Wand || this.WeaponType == ItemWeaponTypesEnum.Axe ? 3 : 2;

                this.DamageData.EmpowerPercentage = new CalculationsHelper().getWeaponEmpoweredValue(this.DamageData.EmpowerPercentage, powerFactor);
            }
            if (!this.AddEmpowerPercentage)
                this.DamageData.EmpowerPercentage = 0;
        }

        // If reversed, reverse to fit right
        if (this.MinDamage > this.MaxDamage) {
            var damageTemp = this.MinDamage;
            this.MinDamage = this.MaxDamage;
            this.MaxDamage = damageTemp;
        }
        // Just in case if rolls were THAT biased
        else if (this.MinDamage == this.MaxDamage)
            this.MaxDamage += Math.round(1+ this.Level/2);
    }

    // Stats for level1, calculate for other levels
    private GetLevelData():ItemDamageNumberStats[]{
        var basicDamageTypes:ItemDamageNumberStats[] = [];
        basicDamageTypes.push(new ItemDamageNumberStats(ItemWeaponTypesEnum.Axe, 6, 10));
        basicDamageTypes.push(new ItemDamageNumberStats(ItemWeaponTypesEnum.Bow, 3, 8));
        basicDamageTypes.push(new ItemDamageNumberStats(ItemWeaponTypesEnum.Hammer, 7, 9));
        basicDamageTypes.push(new ItemDamageNumberStats(ItemWeaponTypesEnum.Sword, 6, 9));
        basicDamageTypes.push(new ItemDamageNumberStats(ItemWeaponTypesEnum.Javelin, 3, 12));
        basicDamageTypes.push(new ItemDamageNumberStats(ItemWeaponTypesEnum.Wand, 3, 7));
        basicDamageTypes.push(new ItemDamageNumberStats(ItemWeaponTypesEnum.Staff, 5, 11));

        return basicDamageTypes;
    };

    private GetBasicWeaponStats(type:ItemWeaponTypesEnum) {
        var levelData = this.GetLevelData();
        var selected = type != null
        ? type == ItemWeaponTypesEnum.Axe ? levelData[0]
        : type == ItemWeaponTypesEnum.Bow ? levelData[1]
        : type == ItemWeaponTypesEnum.Hammer ? levelData[2]
        : type == ItemWeaponTypesEnum.Sword ? levelData[5]
        : type == ItemWeaponTypesEnum.Javelin ? levelData[3]
        : type == ItemWeaponTypesEnum.Wand ? levelData[4]
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

        if (this.AddEmpowerPercentage)
            categoryDamageStats.EmpowerPercentage = Math.round(Helpers.getRandom(2, 4) + Helpers.getRandom(-1, 1) + Helpers.getRandom(0, 5 - Math.abs(30 - this.Level)/10));

        return categoryDamageStats;
    }

    GetDescription():string {
        var empowerTypeStr = this.GetAppropriateEmpoweredType(this.DamageData);
 
        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
        var primaryStr = this.MinDamage && this.MaxDamage
            ? this.MinDamage + " - " + this.MaxDamage + " " + Helpers.getPropertyByValue(ResistanceTypesEnum, this.DamageData.ElementType) + " damage" + empoweredStr : "";

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
        if (!this.DamageData.EmpowerPercentage)
            return "";

        return Helpers.getPropertyByValue(DamageTypesEnum, data.MainDamageType) + " damage increased by " + data.EmpowerPercentage + "%";
    }
}
