import { ItemArmorTypesEnum, ArmorTypesEnum, AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { CCEffectTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { IItemAffixStats } from './IItemAffixStats';

export class ItemArmorDetailStats {
    ItemArmorType:ItemArmorTypesEnum;
    ArmorType: ArmorTypesEnum;
    MinArmor: number;
    MaxArmor: number;
    private selectedCCTypes: CCEffectTypesEnum[];

    constructor(itemArmorType: ItemArmorTypesEnum, minArmor:number, maxArmor:number) {
        this.ItemArmorType = itemArmorType;
        this.MinArmor = minArmor;
        this.MaxArmor = maxArmor;
        this.SetCCTypes();
    }

    private SetCCTypes() {
        if (this.ArmorType)
        if (this.ArmorType == ArmorTypesEnum.Heavy) {
            this.selectedCCTypes.push(CCEffectTypesEnum.ReduceArmor);
            this.selectedCCTypes.push(CCEffectTypesEnum.Bleed);
            this.selectedCCTypes.push(CCEffectTypesEnum.Knockback);
            this.selectedCCTypes.push(CCEffectTypesEnum.Stun);
        }
        if (this.ArmorType == ArmorTypesEnum.Light) {
            this.selectedCCTypes.push(CCEffectTypesEnum.Root);
            this.selectedCCTypes.push(CCEffectTypesEnum.Wither);
            this.selectedCCTypes.push(CCEffectTypesEnum.Blind);
            this.selectedCCTypes.push(CCEffectTypesEnum.Burn);
        }
        if (this.ArmorType == ArmorTypesEnum.Mystic) {
            this.selectedCCTypes.push(CCEffectTypesEnum.Burn);
            this.selectedCCTypes.push(CCEffectTypesEnum.Curse);
            this.selectedCCTypes.push(CCEffectTypesEnum.Freeze);
            this.selectedCCTypes.push(CCEffectTypesEnum.Bleed);
        }
    }

    public GetCCTypes():string {
        var ccTypes:string[] = [];
        (this.selectedCCTypes || []).forEach(t => { ccTypes.push(Helpers.getPropertyByValue(CCEffectTypesEnum, t)) });
        return ccTypes.join(', ');
    }
}

export class ItemArmorStats implements IItemAffixStats {
    Armor:number;
    ArmorType: ArmorTypesEnum;
    ReducePercentage: number;
    private PowerLevel: any;
    private Level: number;
    private ItemType: ItemArmorTypesEnum;
    private ArmorStatDetails:ItemArmorDetailStats;
    private statsCalculated:boolean;
    Amount:number; //Just to check whether there is data in here (from outside method)

    constructor(category: AffixCategoryEnum, level:number, powerLevel:number, itemType: ItemArmorTypesEnum, armorType?: ArmorTypesEnum, armor?:number, reducePercentage?:number) {
        this.CategoryStats = category;
        this.Amount = -1; // Just make sure it's not 0, (again) for outside check
        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.ItemType = itemType;
        this.ArmorType = armorType || Helpers.getRandom(1, 3);

        if (!this.statsCalculated)
        {
            this.statsCalculated = true;
            var armorData = this.GetBasicArmorStats(itemType, armorType, level);
            this.ArmorStatDetails = armorData;
            var calculatedData = new CalculationsHelper().getArmorCalculatedData(this.Level, this.PowerLevel, armorData.MinArmor, armorData.MaxArmor);
            var selectedAmount = calculatedData[0];
            var reducePercentage = calculatedData[1];
            this.Armor = armor || selectedAmount;
            this.ReducePercentage = reducePercentage || 0;
        }
    }
    CategoryStats: import("../../../_Enums/itemAffixEnums").AffixCategoryEnum;

    // Stats for level1, calculate for other levels
    private GetLevelData(level:number):ItemArmorDetailStats[] {
        var basicArmorTypes:ItemArmorDetailStats[] = [];
        basicArmorTypes.push(new ItemArmorDetailStats(ItemArmorTypesEnum.Boots, 3, 4));
        basicArmorTypes.push(new ItemArmorDetailStats(ItemArmorTypesEnum.Chest, 7, 10));
        basicArmorTypes.push(new ItemArmorDetailStats(ItemArmorTypesEnum.Gloves, 3, 5));
        basicArmorTypes.push(new ItemArmorDetailStats(ItemArmorTypesEnum.Helm, 5, 7));
        basicArmorTypes.push(new ItemArmorDetailStats(ItemArmorTypesEnum.Pants, 6, 8));
        
        return basicArmorTypes;
    }

    private GetBasicArmorStats(type:ItemArmorTypesEnum, armorType:ArmorTypesEnum, level:number):ItemArmorDetailStats {
        var levelData = this.GetLevelData(level);
        var selected = type != null ?
        type == ItemArmorTypesEnum.Boots ? levelData[0]
        : type == ItemArmorTypesEnum.Chest ? levelData[1]
        : type == ItemArmorTypesEnum.Gloves ? levelData[2]
        : type == ItemArmorTypesEnum.Helm ? levelData[3]
        : levelData[4]
        : levelData[Helpers.getRandom(0, 4)];

        if (armorType)
            selected.ArmorType = armorType;

        return selected;
    }

    public GetDescription():string {
        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
        var reductionStr = "(Reduce " + this.ArmorStatDetails.GetCCTypes() + " by " + this.ReducePercentage + "%)";
        var basicDataStr = this.Armor ? this.Armor + " " + Helpers.getPropertyByValue(ArmorTypesEnum, this.ArmorType) + " armor" + empoweredStr + "\n": "";
        return basicDataStr + reductionStr;
    }
}
