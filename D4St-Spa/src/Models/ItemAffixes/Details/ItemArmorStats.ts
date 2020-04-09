import { IDescribable } from '../IDescribable';
import { ItemArmorTypesEnum, ArmorTypesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { CCEffectTypesEnum } from 'src/_Enums/triggerAffixEnums';

export class ItemArmorStats implements IDescribable {
    private ItemType: ItemArmorTypesEnum;
    private MinArmor: number;
    private MaxArmor: number;
    Armor:number;
    ArmorType: ArmorTypesEnum;
    private PowerLevel: any;
    private selectedCCTypes: CCEffectTypesEnum[];
    private ReducePercentage: number;
    private Level: number;
    private statsCalculated:boolean;

    constructor(level:number, powerLevel:number, itemType: ItemArmorTypesEnum, minArmor?: number, maxArmor?: number, armor?:number, armorType?: ArmorTypesEnum, reducePercentage?:number) {
        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.ItemType = itemType;
        this.MinArmor = minArmor || 0;
        this.MaxArmor = maxArmor || 0;
        this.Armor = armor;
        this.ArmorType = armorType || Helpers.getRandom(1, 3);
        this.ReducePercentage = reducePercentage || 0;

        this.selectedCCTypes = [];
        this.SetCCTypes();
    }

    GetData() {
        // var minArmor = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getArmorStatForLevel(this.MinArmor, this.Level), this.PowerLevel);
        // var maxArmor = new CalculationsHelper().getEmpoweredValue(new CalculationsHelper().getArmorStatForLevel(this.MinArmor, this.Level), this.PowerLevel);
        var calculatedData = new CalculationsHelper().getArmorCalculatedData(this.Level, this.PowerLevel, this.MinArmor, this.MaxArmor);
        var selectedAmount = calculatedData[0];
        var reducePercentage = calculatedData[1];
        var data = new ItemArmorStats(this.Level, this.PowerLevel, this.ItemType, this.MinArmor, this.MaxArmor, this.Armor || selectedAmount, this.ArmorType, this.ReducePercentage || reducePercentage);

        // Set/Initialize the calculated values
        if (!this.statsCalculated) {
            this.Armor = data.Armor;
            this.ReducePercentage = data.ReducePercentage;
        }

        this.statsCalculated = true;
        return data;
    }

    // Stats for level1, calculate for other levels
    private GetLevelData(level:number) {
        var basicArmorTypes:ItemArmorStats[] = [];
        basicArmorTypes.push(new ItemArmorStats(level, 0, ItemArmorTypesEnum.Boots, 3, 4));
        basicArmorTypes.push(new ItemArmorStats(level, 0, ItemArmorTypesEnum.Chest, 7, 10));
        basicArmorTypes.push(new ItemArmorStats(level, 0, ItemArmorTypesEnum.Gloves, 3, 5));
        basicArmorTypes.push(new ItemArmorStats(level, 0, ItemArmorTypesEnum.Helm, 5, 7));
        basicArmorTypes.push(new ItemArmorStats(level, 0, ItemArmorTypesEnum.Pants, 6, 8));
        
        return basicArmorTypes;
    }

    public GetBasicArmorStats(type:ItemArmorTypesEnum, armorType:ArmorTypesEnum, level:number) {
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
        this.SetCCTypes();
        var data = this.GetData();
        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", data.PowerLevel);
        var reductionStr = "(Reduce CCTypes by " + data.ReducePercentage + "%)";
        var basicDataStr = data.Armor ? data.Armor + " " + Helpers.getPropertyByValue(ArmorTypesEnum, data.ArmorType) + " armor" + empoweredStr + "\n": "";
        return basicDataStr + reductionStr;
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
}
