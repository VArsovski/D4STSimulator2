import { ItemWeaponTypesEnum, DamageTypesEnum, ResistanceTypesEnum, AffixCategoryEnum, ItemRarityTypesEnum } from 'src/_Enums/itemAffixEnums';
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
    CategoryStats: AffixCategoryEnum;
    Amount:number;
    private AddPrimaryDamage: boolean;
    private AddEmpowerPercentage:boolean;
    WeaponType: ItemWeaponTypesEnum;
    RarityType: ItemRarityTypesEnum;
    MinDamage: number;
    MaxDamage: number;
    DamageData:ItemDamageCategoryStats;
    private Level:number;
    private PowerLevel: number;

    constructor(category: AffixCategoryEnum, addPrimary:boolean, addEmpower:boolean, level:number, powerLevel:number, weaponType: ItemWeaponTypesEnum, minDamage?: number, maxDamage?: number, damageData?:ItemDamageCategoryStats) {

        this.CategoryStats = category;
        this.Amount = -1; // Just make sure it's not 0, (again) for outside check
        this.AddPrimaryDamage = addPrimary;
        this.AddEmpowerPercentage = addEmpower;
        this.WeaponType = weaponType;
        this.MinDamage = minDamage;
        this.MaxDamage = maxDamage;
        this.Level = level;
        this.PowerLevel = powerLevel;

        var physicalWeapons = [ItemWeaponTypesEnum.Axe, ItemWeaponTypesEnum.Hammer, ItemWeaponTypesEnum.Sword, ItemWeaponTypesEnum.Javelin];
        var bludgeonWeapons = [ItemWeaponTypesEnum.Hammer, ItemWeaponTypesEnum.Staff];
        var spellWeapons = [ItemWeaponTypesEnum.Bow, ItemWeaponTypesEnum.Wand, ItemWeaponTypesEnum.Staff];
        var chainPierceWeapons = [ItemWeaponTypesEnum.Bow, ItemWeaponTypesEnum.Javelin, ItemWeaponTypesEnum.Sword];

        this.DamageData = damageData || (addPrimary ? this.GetCategoryWeaponStats(this.WeaponType)
                        : new ItemDamageCategoryStats(Helpers.getRandom(1, 6), Helpers.getRandom(1, 6), Helpers.getRandom(3,4)));

        var adequateDamageTypeEmpower = this.WeaponType == parseInt(this.DamageData.MainDamageType.toString(), 10);
        if (this.AddPrimaryDamage) {
            var primaryDamageData = this.GetBasicWeaponStats(this.WeaponType);
            this.MinDamage = primaryDamageData.MinDamage;
            this.MaxDamage = primaryDamageData.MaxDamage;
        }
        else { this.MinDamage = 0; this.MaxDamage = 0; }

        if (this.AddEmpowerPercentage) {
            var powerFactor:number = 0;
            
            var physicalDamageTypes = [DamageTypesEnum.PhysicalOrCC, DamageTypesEnum.CleaveOrAoE, DamageTypesEnum.ChainOrProjectile];
            var bludgeonDamageTypes = [DamageTypesEnum.PhysicalOrCC, DamageTypesEnum.TrapOrSummon];
            var chainPierceDamageTypes = [DamageTypesEnum.TrapOrSummon, DamageTypesEnum.ChainOrProjectile];
            var spellDamageTypes = [DamageTypesEnum.ChainOrProjectile, DamageTypesEnum.TrapOrSummon, DamageTypesEnum.PhysicalOrCC];
            
            powerFactor += physicalWeapons.includes(this.WeaponType) ? physicalDamageTypes.includes(this.DamageData.MainDamageType) ? 3 : 1 : 0;
            powerFactor += bludgeonWeapons.includes(this.WeaponType) ? bludgeonDamageTypes.includes(this.DamageData.MainDamageType) || spellDamageTypes.includes(this.DamageData.MainDamageType) ? 2 : 2 : 0;
            powerFactor += chainPierceWeapons.includes(this.WeaponType) ? chainPierceDamageTypes.includes(this.DamageData.MainDamageType) ? 3 : 1 : 0;
            powerFactor += spellWeapons.includes(this.WeaponType) ? spellDamageTypes.includes(this.DamageData.MainDamageType) ? 3 : 1 : 0;

            if (adequateDamageTypeEmpower)
                powerFactor += this.WeaponType == ItemWeaponTypesEnum.Wand || this.WeaponType == ItemWeaponTypesEnum.Axe ? 3 : 2;

            this.DamageData.EmpowerPercentage = new CalculationsHelper().getWeaponEmpoweredValue(this.DamageData.EmpowerPercentage, powerFactor);
        } else this.DamageData.EmpowerPercentage = 0;

        this.SetDamageFactor(1, "Min");
        if (this.MinDamage != 0)
            this.MinDamage = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getDamageStatForLevel(this.MinDamage, this.Level), this.PowerLevel + (physicalWeapons.includes(this.WeaponType) ? adequateDamageTypeEmpower ? 2 : 1 : 0));
        if (this.MaxDamage != 0)
            this.MaxDamage = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getDamageStatForLevel(this.MaxDamage, this.Level), this.PowerLevel + (physicalWeapons.includes(this.WeaponType) ? adequateDamageTypeEmpower ? 2 : 1 : 0));
    }

    SetDamageFactor(factor: number, damageType:string) {
        var currentDamage = this[damageType + "Damage"];
        this[damageType + "Damage"] = Math.round(currentDamage * factor);

        // If reversed, reverse to fit right
        if (this.MinDamage > this.MaxDamage) {
            var damageTemp = this.MinDamage;
            this.MinDamage = this.MaxDamage;
            this.MaxDamage = damageTemp;
        }
        // Just in case if rolls were THAT biased
        else if (this.MinDamage != 0 && this.MinDamage == this.MaxDamage)
            this.MaxDamage += Math.round(1+ this.Level/2);
    }

    // Stats for level1, calculate for other levels
    private GetLevelData():ItemDamageNumberStats[]{
        var basicDamageTypes:ItemDamageNumberStats[] = [];
        basicDamageTypes.push(new ItemDamageNumberStats(ItemWeaponTypesEnum.Axe, 3, 9));
        basicDamageTypes.push(new ItemDamageNumberStats(ItemWeaponTypesEnum.Bow, 3, 6));
        basicDamageTypes.push(new ItemDamageNumberStats(ItemWeaponTypesEnum.Hammer, 5, 6));
        basicDamageTypes.push(new ItemDamageNumberStats(ItemWeaponTypesEnum.Sword, 4, 7));
        basicDamageTypes.push(new ItemDamageNumberStats(ItemWeaponTypesEnum.Javelin, 2, 10));
        basicDamageTypes.push(new ItemDamageNumberStats(ItemWeaponTypesEnum.Wand, 3, 7));
        basicDamageTypes.push(new ItemDamageNumberStats(ItemWeaponTypesEnum.Staff, 4, 8));

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
        var appropriateDamageTypes = new CalculationsHelper().GetAppropriateDamageTypesForWeaponType(this.WeaponType, this.RarityType);
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

    public GetAppropriateDamageElements(type: DamageTypesEnum):ResistanceTypesEnum[] {
        var appropriateDamageTypes:ResistanceTypesEnum[] = [ResistanceTypesEnum.Physical, ResistanceTypesEnum.Fire, ResistanceTypesEnum.Cold
        , ResistanceTypesEnum.Lightning, ResistanceTypesEnum.Poison];

        if (type == DamageTypesEnum.PhysicalOrCC) { }
            appropriateDamageTypes = appropriateDamageTypes.filter(c => c != ResistanceTypesEnum.Poison);
        if (type == DamageTypesEnum.CleaveOrAoE)
            appropriateDamageTypes = appropriateDamageTypes.filter(c => c != ResistanceTypesEnum.Lightning)
        if (type == DamageTypesEnum.ChainOrProjectile)
            appropriateDamageTypes = appropriateDamageTypes.filter(c => c != ResistanceTypesEnum.Cold && c != ResistanceTypesEnum.Fire)
        if (type == DamageTypesEnum.TrapOrSummon)
            appropriateDamageTypes = appropriateDamageTypes.filter(c => c != ResistanceTypesEnum.Physical && c != ResistanceTypesEnum.Fire)
        if (type == DamageTypesEnum.TickOrCurse)
            appropriateDamageTypes = appropriateDamageTypes.filter(c => c == ResistanceTypesEnum.Fire || c == ResistanceTypesEnum.Poison);

        return appropriateDamageTypes;
    }
    
    private GetAppropriateEmpoweredType(data:ItemDamageCategoryStats) {
        if (!this.DamageData.EmpowerPercentage)
            return "";

        return Helpers.getPropertyByValue(DamageTypesEnum, data.MainDamageType) + " damage increased by " + data.EmpowerPercentage + "%";
    }
}
