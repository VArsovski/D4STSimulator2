import { IDescribable } from '../IDescribable';
import { IPowerUp } from '../IPowerUp';
import { ItemWeaponTypesEnum, DamageTypesEnum, ResistanceTypesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';

export class ItemDamageStats implements IDescribable, IPowerUp {
    WeaponType: ItemWeaponTypesEnum;
    MainDamageType: ResistanceTypesEnum;
    MinDamage: number;
    MaxDamage: number;
    private PowerLevel: number;
    private EmpowerPercentage: number;

    constructor(level:number, weaponType: ItemWeaponTypesEnum, damageType?: ResistanceTypesEnum,  minDamage?: number, maxDamage?: number) {
        this.PowerLevel = 0;
        this.Level = level;
        this.WeaponType = weaponType;
        this.MainDamageType = damageType;
        this.MinDamage = minDamage;
        this.MaxDamage = maxDamage;
    }

    PowerUp(){
        this.PowerLevel++;
    }
    GetData():ItemDamageStats {
        this.EmpowerPercentage = new CalculationsHelper().getBasicStatEmpowerAmount(this.Level, this.PowerLevel);
        this.MinDamage = new CalculationsHelper().getEmpoweredValue(this.MinDamage, this.PowerLevel);
        this.MaxDamage = new CalculationsHelper().getEmpoweredValue(this.MaxDamage, this.PowerLevel);
        return this;
    }
    SetLevel(level: number) { this.Level = level; }
    Level: number;

    // Stats for level1, calculate for other levels
    private GetLevel1Data():ItemDamageStats[]{
        var basicDamageTypes:ItemDamageStats[] = [];
        basicDamageTypes.push(new ItemDamageStats(ItemWeaponTypesEnum.Axe, Helpers.getRandom(1, 6), 3, 9));
        basicDamageTypes.push(new ItemDamageStats(ItemWeaponTypesEnum.Bow, Helpers.getRandom(1, 6), 3, 5));
        basicDamageTypes.push(new ItemDamageStats(ItemWeaponTypesEnum.Hammer, Helpers.getRandom(1, 6), 5, 7));
        basicDamageTypes.push(new ItemDamageStats(ItemWeaponTypesEnum.Javelin, Helpers.getRandom(1, 6), 1, 10));
        basicDamageTypes.push(new ItemDamageStats(ItemWeaponTypesEnum.Sword, Helpers.getRandom(1, 6), 4, 8));
        basicDamageTypes.push(new ItemDamageStats(ItemWeaponTypesEnum.Wand, Helpers.getRandom(1, 6), 2, 6));
        basicDamageTypes.push(new ItemDamageStats(ItemWeaponTypesEnum.Staff, Helpers.getRandom(1, 6), 2, 6));
        return basicDamageTypes;
    };

    public GetBasicWeaponStats(type?:ItemWeaponTypesEnum, damageType?:ResistanceTypesEnum) {
        var level1Data = this.GetLevel1Data();
        var selected = type!= null
        ? type == ItemWeaponTypesEnum.Axe ? level1Data[0]
        : type == ItemWeaponTypesEnum.Bow ? level1Data[1]
        : type == ItemWeaponTypesEnum.Hammer ? level1Data[2]
        : type == ItemWeaponTypesEnum.Javelin ? level1Data[3]
        : type == ItemWeaponTypesEnum.Sword ? level1Data[4]
        : type == ItemWeaponTypesEnum.Wand ? level1Data[5]
        : level1Data[6]
        : level1Data[Helpers.getRandom(0, 5)];

        if (damageType)
            selected.MainDamageType = damageType;

        return selected;
    }

    GetDescription():string {
        var data = this.GetData();

        var empowerTypeStr = this.GetAppropriateEmpoweredType();
        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
        var primaryStr = data.MinDamage && data.MaxDamage ? data.MinDamage + " - " + data.MaxDamage + " " + Helpers.getPropertyByValue(DamageTypesEnum, data.MainDamageType) + " damage" + empoweredStr + "\n" : "";
        return primaryStr + empowerTypeStr;
    }
    
    GetAppropriateEmpoweredType() {
        var data = this.GetData();
        return Helpers.getPropertyByValue(DamageTypesEnum, data.MainDamageType + 1) + " attacks and abilities " + " deal " + data.EmpowerPercentage + "% more damage";
    }
}
