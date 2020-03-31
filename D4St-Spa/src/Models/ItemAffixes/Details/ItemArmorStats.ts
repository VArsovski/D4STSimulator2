import { IDescribable } from '../IDescribable';
import { IPowerUp } from '../IPowerUp';
import { ItemArmorTypesEnum, ArmorTypesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';

export class ItemArmorStats implements IDescribable, IPowerUp {
    private ItemType: ItemArmorTypesEnum;
    private MinArmor: number;
    private MaxArmor: number;
    private ArmorType: ArmorTypesEnum;
    private PowerLevel: any;

    constructor(itemType?: ItemArmorTypesEnum, minArmor?: number, maxArmor?: number, armorType?: ArmorTypesEnum) {
        this.PowerLevel = 0;
        this.ItemType = itemType;
        this.MinArmor = minArmor;
        this.MaxArmor = maxArmor;
        this.ArmorType = armorType;
    }

    PowerUp() {
        this.PowerLevel++;
    }
    GetData() {
        this.MinArmor = new CalculationsHelper().getEmpoweredValue(this.MinArmor, this.PowerLevel);
        this.MaxArmor = new CalculationsHelper().getEmpoweredValue(this.MinArmor, this.PowerLevel);
        return this;
    }

    SetLevel(level: number) { this.Level = level; }
    Level: number;

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
        return amount + " " + Helpers.getPropertyByValue(ArmorTypesEnum, this.ArmorType) + " armor" + empoweredStr;
    }
}
