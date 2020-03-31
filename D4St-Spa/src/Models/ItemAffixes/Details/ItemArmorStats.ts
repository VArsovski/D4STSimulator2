import { IDescribable } from '../IDescribable';
import { IPowerUp } from '../IPowerUp';
import { ItemArmorTypesEnum, ArmorTypesEnum, CCEffectTypesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';

export class ItemArmorStats implements IDescribable, IPowerUp {
    private ItemType: ItemArmorTypesEnum;
    private MinArmor: number;
    private MaxArmor: number;
    private ArmorType: ArmorTypesEnum;
    private PowerLevel: any;
    private selectedCCTypes: CCEffectTypesEnum[];
    private ReducePercentage: number;
    private Level: number;    

    constructor(level:number, itemType?: ItemArmorTypesEnum, minArmor?: number, maxArmor?: number, armorType?: ArmorTypesEnum) {
        this.PowerLevel = 0;
        this.Level = level;
        this.ItemType = itemType;
        this.MinArmor = minArmor;
        this.MaxArmor = maxArmor;
        this.ArmorType = armorType;

        this.selectedCCTypes = [];
        this.SetCCTypes();
    }

    PowerUp() {
        this.PowerLevel++;
    }
    GetData() {
        this.ReducePercentage = new CalculationsHelper().getBasicStatEmpowerAmount(this.Level, this.PowerLevel);
        this.MinArmor = new CalculationsHelper().getEmpoweredValue(this.MinArmor, this.PowerLevel);
        this.MaxArmor = new CalculationsHelper().getEmpoweredValue(this.MinArmor, this.PowerLevel);
        this.SetCCTypes();
        return this;
    }

    // Stats for level1, calculate for other levels
    private GetLevel1Data() {
        var basicArmorTypes:ItemArmorStats[] = [];
        basicArmorTypes.push(new ItemArmorStats(ItemArmorTypesEnum.Boots, 1, 2));
        basicArmorTypes.push(new ItemArmorStats(ItemArmorTypesEnum.Chest, 3, 5));
        basicArmorTypes.push(new ItemArmorStats(ItemArmorTypesEnum.Gloves, 1, 3));
        basicArmorTypes.push(new ItemArmorStats(ItemArmorTypesEnum.Helm, 2, 5));
        basicArmorTypes.push(new ItemArmorStats(ItemArmorTypesEnum.Pants, 1, 4));
        return basicArmorTypes;
    }

    public GetBasicArmorStats(type?:ItemArmorTypesEnum, armorType?:ArmorTypesEnum, level?:number) {
        var level1Data = this.GetLevel1Data();
        var selected = type != null ?
        type == ItemArmorTypesEnum.Boots ? level1Data[0]
        : type == ItemArmorTypesEnum.Chest ? level1Data[1]
        : type == ItemArmorTypesEnum.Gloves ? level1Data[2]
        : type == ItemArmorTypesEnum.Helm ? level1Data[3]
        : level1Data[4]
        : level1Data[Helpers.getRandom(0, 4)];

        if (armorType)
            selected.ArmorType = armorType;

        return selected;
    }

    public GetDescription():string {
        var data = this.GetData();
        var amount = Helpers.getRandom(data.MinArmor, data.MaxArmor);
        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);

        var reductionStr = "(Reduce CCTypes by " + data.ReducePercentage + "%)";
        if (amount || 0 == 0) {
            debugger;
        }

        var basicDataStr = amount ? amount + " " + Helpers.getPropertyByValue(ArmorTypesEnum, data.ArmorType) + " armor" + empoweredStr + "\n": "";
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
