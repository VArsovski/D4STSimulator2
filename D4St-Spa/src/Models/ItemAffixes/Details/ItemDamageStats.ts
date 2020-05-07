import { ItemWeaponTypesEnum, DamageTypesEnum, ResistanceTypesEnum, AffixCategoryEnum, ItemRarityTypesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { IItemAffixStats, IItemAffixStatsMetadata, SimpleItemAffixStatsMetadata } from './IItemAffixStats';
import { IEquippableStat } from 'src/Models/InventoryModels/InventoryDetailModels/IEquippableStat';
import { IItemAffix } from '../IItemAffix';
import { DamageStatMinMaxEquippable } from '../../IEquippableStatDetails/DamageStatEquippable';

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

export class ItemDamageStats implements IItemAffixStats, IEquippableStat {
    CategoryStats: AffixCategoryEnum;
    Amount:number;
    WeaponType: ItemWeaponTypesEnum;
    RarityType: ItemRarityTypesEnum;
    MinDamage: number;
    MaxDamage: number;
    private Level:number;
    private PowerLevel: number;
    MainDamageType: DamageTypesEnum;
    ElementType: ResistanceTypesEnum;
    InputMeta: IItemAffixStatsMetadata;
    OutputMeta: IItemAffixStatsMetadata;

    constructor(category: AffixCategoryEnum, level:number, powerLevel:number, weaponType: ItemWeaponTypesEnum, minDamage?: number, maxDamage?: number, mainDamageType?: DamageTypesEnum, elementType?: ResistanceTypesEnum) {

        this.Amount = -1; // Just make sure it's not 0, (again) for outside check
        this.CategoryStats = category;
        this.Level = level;
        this.PowerLevel = powerLevel;
        this.MainDamageType = mainDamageType || Helpers.getRandom(1, 5);
        this.WeaponType = weaponType || Helpers.getRandom(1, 7);
        this.ElementType = elementType || Helpers.getRandom(1, 5);
        this.MinDamage = minDamage;
        this.MaxDamage = maxDamage;

        var adequateDamageTypeEmpower = this.WeaponType == parseInt(this.MainDamageType.toString(), 10);
        var primaryDamageData = this.GetBasicWeaponStats(this.WeaponType);
        this.MinDamage = primaryDamageData.MinDamage;
        this.MaxDamage = primaryDamageData.MaxDamage;

        var physicalWeapons = [ItemWeaponTypesEnum.Axe, ItemWeaponTypesEnum.Hammer, ItemWeaponTypesEnum.Sword, ItemWeaponTypesEnum.Javelin];
        this.SetDamageFactor(1, "Min");

        if (this.MinDamage != 0)
            this.MinDamage = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getDamageStatForLevel(this.MinDamage, this.Level), this.PowerLevel + (physicalWeapons.includes(this.WeaponType) ? adequateDamageTypeEmpower ? 2 : 1 : 0));
        if (this.MaxDamage != 0)
            this.MaxDamage = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getDamageStatForLevel(this.MaxDamage, this.Level), this.PowerLevel + (physicalWeapons.includes(this.WeaponType) ? adequateDamageTypeEmpower ? 2 : 1 : 0));

        this.InputMeta = new SimpleItemAffixStatsMetadata();
        this.OutputMeta = new SimpleItemAffixStatsMetadata();
        this.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.InputMeta.SelectedStat = Helpers.getPropertyByValue(AffixCategoryEnum, this.CategoryStats);
        this.OutputMeta.SelectedStat = "DamageData";
        this.OutputMeta.SelectedEquipStat = Helpers.getPropertyByValue(ResistanceTypesEnum, this.ElementType) + "Damage";
        this.updateEquippedStats = new DamageStatMinMaxEquippable(this.OutputMeta.SelectedStat, this.OutputMeta.SelectedEquipStat).updateEquippedStats;
    }

    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

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

    GetDescription():string {
        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
        var primaryStr = this.MinDamage && this.MaxDamage
            ? this.MinDamage + " - " + this.MaxDamage + " " + Helpers.getPropertyByValue(ResistanceTypesEnum, this.ElementType) + " damage" : "";

        return primaryStr + empoweredStr;
    }
}
