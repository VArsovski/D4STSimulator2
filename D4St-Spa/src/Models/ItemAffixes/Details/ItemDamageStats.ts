import { IDescribable } from '../IDescribable';
import { ItemWeaponTypesEnum, DamageTypesEnum, ResistanceTypesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';

export class ItemDamageStats implements IDescribable {
    WeaponType: ItemWeaponTypesEnum;
    MainDamageType: ResistanceTypesEnum;
    MinDamage: number;
    MaxDamage: number;
    private PowerLevel: number;
    private EmpowerPercentage: number;

    constructor(level:number, powerLevel:number, weaponType: ItemWeaponTypesEnum, damageType?: ResistanceTypesEnum,  minDamage?: number, maxDamage?: number, empowerPercentage?:number) {
        this.PowerLevel = powerLevel;
        this.Level = level;
        this.WeaponType = weaponType;
        this.MainDamageType = damageType;
        this.MinDamage = minDamage;
        this.MaxDamage = maxDamage;
        this.EmpowerPercentage = empowerPercentage;
    }

    GetData():ItemDamageStats {
        var hasDamageData = (this.MinDamage && !this.MaxDamage);
        // Damage modifier rolled on a non-weapon item
        debugger;
        var empPercAlternate = (!hasDamageData)
            ? Math.round((Helpers.getRandom(8, 10) + this.Level/8)*Helpers.getRandom(80, 120)/100) + Helpers.getRandom(-2, +2)
            : 0;
        
        var calculatedData = hasDamageData ? new CalculationsHelper().getDamageCalculatedData(this.Level, this.PowerLevel, this.MinDamage, this.MaxDamage) : [0, 0, empPercAlternate]; // For Effects, not primary damage
        var data = new ItemDamageStats(this.Level, this.PowerLevel, this.WeaponType, this.MainDamageType, calculatedData[0], calculatedData[1], calculatedData[2]);
        return data;
    }
    SetLevel(level: number) { this.Level = level; }
    Level: number;

    // Stats for level1, calculate for other levels
    private GetLevelData():ItemDamageStats[]{
        var basicDamageTypes:ItemDamageStats[] = [];
        basicDamageTypes.push(new ItemDamageStats(this.Level, this.PowerLevel, ItemWeaponTypesEnum.Axe,     Helpers.getRandom(1, 6), 2, 10));
        basicDamageTypes.push(new ItemDamageStats(this.Level, this.PowerLevel, ItemWeaponTypesEnum.Bow,     Helpers.getRandom(1, 6), 3, 8));
        basicDamageTypes.push(new ItemDamageStats(this.Level, this.PowerLevel, ItemWeaponTypesEnum.Hammer,  Helpers.getRandom(1, 6), 6, 8));
        basicDamageTypes.push(new ItemDamageStats(this.Level, this.PowerLevel, ItemWeaponTypesEnum.Javelin, Helpers.getRandom(1, 6), 1, 12));
        basicDamageTypes.push(new ItemDamageStats(this.Level, this.PowerLevel, ItemWeaponTypesEnum.Sword,   Helpers.getRandom(1, 6), 4, 9));
        basicDamageTypes.push(new ItemDamageStats(this.Level, this.PowerLevel, ItemWeaponTypesEnum.Wand,    Helpers.getRandom(1, 6), 3, 7));
        basicDamageTypes.push(new ItemDamageStats(this.Level, this.PowerLevel, ItemWeaponTypesEnum.Staff,   Helpers.getRandom(1, 6), 5, 9));
        return basicDamageTypes;
    };

    public GetBasicWeaponStats(type?:ItemWeaponTypesEnum, damageType?:ResistanceTypesEnum) {
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
        if (damage1 == damage2)
            damage2+= (1+ data.Level/2);

        var empowerTypeStr = this.GetAppropriateEmpoweredType(data);
        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
    
        var primaryStr = data.MinDamage && data.MaxDamage ? damage1 + " - " + damage2 + " " + Helpers.getPropertyByValue(DamageTypesEnum, data.MainDamageType) + " damage" + empoweredStr + "\n\n" : "";
        return primaryStr + empowerTypeStr;
    }
    
    GetAppropriateEmpoweredType(data:ItemDamageStats) {
        if (data.WeaponType == ItemWeaponTypesEnum.Wand)
            data.EmpowerPercentage = new CalculationsHelper().getEmpoweredValue(data.EmpowerPercentage, 2);
        var avgDamage = data.MinDamage + data.MaxDamage;

        var compensationFactor = avgDamage ? Math.round((data.Level / (avgDamage)) * 10) / 10 : 0;
        compensationFactor = Math.round(compensationFactor * (18-data.Level/4) * 10)/10;
        data.EmpowerPercentage = Math.round((data.EmpowerPercentage + 2*compensationFactor) * 10)/10;

        return Helpers.getPropertyByValue(DamageTypesEnum, data.MainDamageType) + " attacks and abilities deal " + data.EmpowerPercentage + "% more damage";
    }
}
