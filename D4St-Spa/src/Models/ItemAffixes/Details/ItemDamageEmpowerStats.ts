import { IItemAffixStats, IItemAffixStatsMetadata, SimpleItemAffixStatsMetadata, SimpleAffixStats } from './IItemAffixStats';
import { AffixCategoryEnum, ItemWeaponTypesEnum, ItemRarityTypesEnum, DamageTypesEnum, ResistanceTypesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { IItemAffix } from '../IItemAffix';
import { DamageStatPrimaryEquippable } from '../../IEquippableStatDetails/DamageStatEquippable';
import { IEquippableAffixStat } from 'src/Models/IEquippableStatDetails/IEquippableAffixStat';
import { InventoryDamageModel } from 'src/Models/InventoryModels/InventoryDamageModel';

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

export class ItemDamageEmpowerStats implements IEquippableAffixStat {
    Category: AffixCategoryEnum
    Amount: number;
    Level:number;
    PowerLevel:number;
    CategoryStats: AffixCategoryEnum;
    DamageData:ItemDamageCategoryStats;
    WeaponType:ItemWeaponTypesEnum;
    RarityType:ItemRarityTypesEnum;
    MainDamageType: DamageTypesEnum;
    ElementType: ResistanceTypesEnum;
    EmpowerPercentage: number;
    SelectedStat: string;
    SelectedEquipStat: string;
    SelectedCategoryStat: string;
    EquippableStatData: IItemAffixStats;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;
    getZeroStats: (src: any) => any;

    constructor(category: AffixCategoryEnum, amount:number, level:number, powerLevel:number,weaponType:ItemWeaponTypesEnum, rarityType:ItemRarityTypesEnum, damageData:ItemDamageCategoryStats) {
        this.Category = category;
        this.Amount = amount || 0;
        this.Level = level || 0;
        this.PowerLevel = powerLevel || 0;
        this.WeaponType = weaponType || Helpers.getRandom(1, 7);
        this.RarityType = rarityType || Helpers.getRandom(1, 3);
        this.DamageData = damageData;// || new ItemDamageCategoryStats(Helpers.getRandom(1, 5), Helpers.getRandom(1, 5), Helpers.getRandom(3, 4));

        if (!this.DamageData) {
            this.DamageData = this.GetCategoryWeaponStats(this.WeaponType);
            this.DamageData = this.CalculatePowerFactor(this.WeaponType, this.DamageData.MainDamageType, this.DamageData);
        }

        if (this.DamageData) {
            this.MainDamageType = this.DamageData.MainDamageType;
            this.ElementType = this.DamageData.ElementType;
            this.EmpowerPercentage = this.DamageData.EmpowerPercentage;
        }

        this.EquippableStatData = new SimpleAffixStats();
        this.EquippableStatData.InputMeta = new SimpleItemAffixStatsMetadata();
        this.EquippableStatData.OutputMeta = new SimpleItemAffixStatsMetadata();
        this.EquippableStatData.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.EquippableStatData.InputMeta.SelectedStat = Helpers.getPropertyByValue(AffixCategoryEnum, this.CategoryStats);
        this.EquippableStatData.OutputMeta.SelectedStat = "DamageEmpowerData";
        this.EquippableStatData.OutputMeta.SelectedEquipStat = Helpers.getPropertyByValue(DamageTypesEnum, this.MainDamageType);
        this.updateEquippedStats = new DamageStatPrimaryEquippable(this.EquippableStatData.OutputMeta.SelectedStat, this.EquippableStatData.OutputMeta.SelectedEquipStat).updateEquippedStats;
        this.getZeroStats = (src) => { (src as InventoryDamageModel) = new InventoryDamageModel(); return src; }
    }

    GetDescription(): string {
        return "+" + this.DamageData.EmpowerPercentage + "% " + Helpers.getPropertyByValue(DamageTypesEnum, this.DamageData.MainDamageType) + " damage";
    }

    private GetCategoryWeaponStats(type?:ItemWeaponTypesEnum) {
        var appropriateDamageTypes = new CalculationsHelper().GetAppropriateDamageTypesForWeaponType(this.WeaponType, this.RarityType);
        var selectedDamageType = appropriateDamageTypes[Helpers.getRandom(0, appropriateDamageTypes.length - 1)];
        var damageElements = this.GetAppropriateDamageElements(selectedDamageType);
        var selectedElement = damageElements[Helpers.getRandom(0, damageElements.length - 1)];
        var categoryDamageStats = new ItemDamageCategoryStats(selectedDamageType, selectedElement, 0);
        categoryDamageStats.EmpowerPercentage = Math.round(Helpers.getRandom(2, 4) + Helpers.getRandom(-1, 1) + Helpers.getRandom(0, 5 - Math.abs(30 - this.Level)/10));
        return categoryDamageStats;
    }

    private CalculatePowerFactor(weaponType:ItemWeaponTypesEnum, selectedDamageType: DamageTypesEnum, damageData:ItemDamageCategoryStats) {
        var physicalWeapons = [ItemWeaponTypesEnum.Axe, ItemWeaponTypesEnum.Hammer, ItemWeaponTypesEnum.Sword, ItemWeaponTypesEnum.Javelin];
        var bludgeonWeapons = [ItemWeaponTypesEnum.Hammer, ItemWeaponTypesEnum.Staff];
        var spellWeapons = [ItemWeaponTypesEnum.Bow, ItemWeaponTypesEnum.Wand, ItemWeaponTypesEnum.Staff];
        var chainPierceWeapons = [ItemWeaponTypesEnum.Bow, ItemWeaponTypesEnum.Javelin, ItemWeaponTypesEnum.Sword];

        var adequateDamageTypeEmpower = weaponType == parseInt(selectedDamageType.toString(), 10);
        var powerFactor:number = 0;

        var physicalDamageTypes = [DamageTypesEnum.PhysicalOrCC, DamageTypesEnum.CleaveOrAoE, DamageTypesEnum.ChainOrProjectile];
        var bludgeonDamageTypes = [DamageTypesEnum.PhysicalOrCC, DamageTypesEnum.TrapOrSummon];
        var chainPierceDamageTypes = [DamageTypesEnum.TrapOrSummon, DamageTypesEnum.ChainOrProjectile];
        var spellDamageTypes = [DamageTypesEnum.ChainOrProjectile, DamageTypesEnum.TrapOrSummon, DamageTypesEnum.PhysicalOrCC];
        
        powerFactor += physicalWeapons.includes(weaponType) ? physicalDamageTypes.includes(selectedDamageType) ? 3 : 1 : 0;
        powerFactor += bludgeonWeapons.includes(weaponType) ? bludgeonDamageTypes.includes(selectedDamageType) || spellDamageTypes.includes(selectedDamageType) ? 2 : 2 : 0;
        powerFactor += chainPierceWeapons.includes(weaponType) ? chainPierceDamageTypes.includes(selectedDamageType) ? 3 : 1 : 0;
        powerFactor += spellWeapons.includes(weaponType) ? spellDamageTypes.includes(selectedDamageType) ? 3 : 1 : 0;

        if (adequateDamageTypeEmpower)
            powerFactor += weaponType == ItemWeaponTypesEnum.Wand || weaponType == ItemWeaponTypesEnum.Axe ? 3 : 2;

        damageData.EmpowerPercentage = new CalculationsHelper().getWeaponEmpoweredValue(this.DamageData.EmpowerPercentage, powerFactor);
        return damageData;
    }

    private GetAppropriateEmpoweredType(data:ItemDamageCategoryStats) {
        if (!this.DamageData.EmpowerPercentage)
            return "";

        return Helpers.getPropertyByValue(DamageTypesEnum, data.MainDamageType) + " damage increased by " + data.EmpowerPercentage + "%";
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
}
