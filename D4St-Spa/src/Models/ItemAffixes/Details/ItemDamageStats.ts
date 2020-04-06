import { IDescribable } from '../IDescribable';
import { ItemWeaponTypesEnum, DamageTypesEnum, ResistanceTypesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';

export class ItemDamageStats implements IDescribable {
    WeaponType: ItemWeaponTypesEnum;
    MainDamageType: DamageTypesEnum;
    ElementType: ResistanceTypesEnum;
    MinDamage: number;
    MaxDamage: number;
    private Level:number;
    private PowerLevel: number;
    private EmpowerPercentage: number;

    constructor(level:number, powerLevel:number, weaponType: ItemWeaponTypesEnum, damageType?: DamageTypesEnum, damageElement?:ResistanceTypesEnum,  minDamage?: number, maxDamage?: number, empowerPercentage?:number) {
        this.PowerLevel = powerLevel;
        this.Level = level;
        this.WeaponType = weaponType;
        this.MainDamageType = damageType;
        this.ElementType = damageElement;
        this.MinDamage = minDamage;
        this.MaxDamage = maxDamage;
        this.EmpowerPercentage = empowerPercentage;
    }

    GetData():ItemDamageStats {
        var hasDamageData = this.MinDamage && this.MaxDamage;
        // Damage modifier rolled on a non-weapon item
        var empPercAlternate = !(hasDamageData)
            ? Math.round((Helpers.getRandom(7, 9) + this.Level/8)*Helpers.getRandom(80, 120)/100) + Helpers.getRandom(-2, +2)
            : 0;
        
        var selectedDamageCategories = this.GetAppropriateDamageCategories(this.WeaponType);
        // Initial damage types doesn't get buffed by the weapon, swap with something more suitable..
        var mainDamageType = this.MainDamageType;
        if (selectedDamageCategories.indexOf(this.MainDamageType) == -1) {
            mainDamageType = selectedDamageCategories[Helpers.getRandom(0, selectedDamageCategories.length - 1)];
        }

        var damageElements = this.GetAppropriateDamageElements(selectedDamageCategories[Helpers.getRandom(0, selectedDamageCategories.length - 1)]);
        var selectedElement = damageElements[Helpers.getRandom(0, damageElements.length - 1)];
    
        var calculatedData = hasDamageData ? new CalculationsHelper().getDamageCalculatedData(this.Level, this.PowerLevel, this.MinDamage, this.MaxDamage) : [0, 0, empPercAlternate]; // For Effects, not primary damage
        var selectedEmpowerPercentage = hasDamageData ? this.EmpowerPercentage : calculatedData[2];// If weapon don't always give the empowerPercentage
        var data = new ItemDamageStats(this.Level, this.PowerLevel, this.WeaponType, mainDamageType, selectedElement, calculatedData[0], calculatedData[1], selectedEmpowerPercentage);
        return data;
    }

    // Stats for level1, calculate for other levels
    private GetLevelData():ItemDamageStats[]{
        var basicDamageTypes:ItemDamageStats[] = [];
        basicDamageTypes.push(new ItemDamageStats(this.Level, this.PowerLevel, ItemWeaponTypesEnum.Axe,     Helpers.getRandom(1, 6), ResistanceTypesEnum.Physical, 2, 10));
        basicDamageTypes.push(new ItemDamageStats(this.Level, this.PowerLevel, ItemWeaponTypesEnum.Bow,     Helpers.getRandom(1, 6), ResistanceTypesEnum.Physical, 3, 8));
        basicDamageTypes.push(new ItemDamageStats(this.Level, this.PowerLevel, ItemWeaponTypesEnum.Hammer,  Helpers.getRandom(1, 6), ResistanceTypesEnum.Physical, 6, 8));
        basicDamageTypes.push(new ItemDamageStats(this.Level, this.PowerLevel, ItemWeaponTypesEnum.Javelin, Helpers.getRandom(1, 6), ResistanceTypesEnum.Physical, 1, 12));
        basicDamageTypes.push(new ItemDamageStats(this.Level, this.PowerLevel, ItemWeaponTypesEnum.Sword,   Helpers.getRandom(1, 6), ResistanceTypesEnum.Physical, 4, 9));
        basicDamageTypes.push(new ItemDamageStats(this.Level, this.PowerLevel, ItemWeaponTypesEnum.Wand,    Helpers.getRandom(1, 6), ResistanceTypesEnum.Physical, 3, 7));
        basicDamageTypes.push(new ItemDamageStats(this.Level, this.PowerLevel, ItemWeaponTypesEnum.Staff,   Helpers.getRandom(1, 6), ResistanceTypesEnum.Physical, 5, 9));
        return basicDamageTypes;
    };

    public GetBasicWeaponStats(type?:ItemWeaponTypesEnum, damageType?:DamageTypesEnum) {
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

        if (damageType)
            selected.MainDamageType = damageType;

        return selected;
    }

    GetDescription():string {
        var data = this.GetData();
        var damage1 = Math.min(data.MinDamage, data.MaxDamage);
        var damage2 = Math.max(data.MinDamage, data.MaxDamage);
        if (damage1 == damage2)    // Just in case if rolls were THAT biased
            damage2+= (1+ data.Level/2);

        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", data.PowerLevel);
        var empowerTypeStr = this.GetAppropriateEmpoweredType(data);

        var primaryStr = data.MinDamage && data.MaxDamage
            ? damage1 + " - " + damage2 + " " + Helpers.getPropertyByValue(ResistanceTypesEnum, data.ElementType) + " damage" + empoweredStr : "";

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
    
    GetAppropriateEmpoweredType(data:ItemDamageStats) {
        if (!data.EmpowerPercentage)
            return "";

        var appropriateDamageTypes = this.GetAppropriateDamageCategories(data.WeaponType);
        // If appropriate damage type rolled, buff
        if (appropriateDamageTypes.indexOf(data.MainDamageType) != -1) {
            var powerFactor = data.WeaponType == ItemWeaponTypesEnum.Wand || data.WeaponType == ItemWeaponTypesEnum.Staff ? 3 : 1;
            data.EmpowerPercentage = new CalculationsHelper().getWeaponEmpoweredValue(data.EmpowerPercentage, powerFactor);
        }

        var avgDamage = data.MinDamage + data.MaxDamage;

        var compensationFactor = avgDamage ? Math.round((data.Level / (avgDamage)) * 10) / 10 : 0;
        compensationFactor = Math.round(compensationFactor * (18-data.Level/4) * 10)/10;
        data.EmpowerPercentage = Math.round((data.EmpowerPercentage + 2*compensationFactor) * 10)/10;

        return "Damage of " + Helpers.getPropertyByValue(DamageTypesEnum, data.MainDamageType) + " attacks/abilities increased by " + data.EmpowerPercentage + "%";
    }

    SetEmpowerPercentage(epc?:number) {
        this.EmpowerPercentage = epc;
    }
}
