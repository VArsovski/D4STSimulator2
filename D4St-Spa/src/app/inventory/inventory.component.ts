import { Component, OnInit, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { IItemAffix } from 'src/Models/ItemAffixes/IItemAffix';
import { AffixCategoryEnum, ArmorTypesEnum, ItemAffixTypeEnum, DamageTypesEnum } from 'src/_Enums/itemAffixEnums';
import { InventoryVM } from 'src/Models/InventoryVM';
import { Helpers } from 'src/_Helpers/helpers';
import { InventoryArmorModel } from 'src/Models/InventoryArmorModel';
import { InventoryDamageModel } from 'src/Models/InventoryDamageModel';
import { ItemAffix } from 'src/Models/ItemAffixes/ItemAffix';
import { InventoryBasicStatsModel } from 'src/Models/InventoryBasicStatsModel';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit, OnChanges {

  protected inventoryData: InventoryVM;
  @Input()inventoryItem: InventoryVM;
  protected tempInventoryData: InventoryVM;

  protected HeavyArmor:InventoryArmorModel;
  protected LightArmor:InventoryArmorModel;
  protected MysticArmor:InventoryArmorModel;
  protected BleedOrArmorReduction:InventoryDamageModel;
  protected PoisonOrBurn:InventoryDamageModel;
  protected CleaveOrAoE:InventoryDamageModel;
  protected KnockbackOrStun:InventoryDamageModel;
  protected ChainOrPierceAttack:InventoryDamageModel;
  protected ProjectileOrSummon:InventoryDamageModel;
  protected FreezeOrRoot:InventoryDamageModel;
  protected Physical:InventoryDamageModel;
  protected BasicStats:InventoryBasicStatsModel;

  private armors :string[] = ["Boots","Chest", "Gloves", "Helm", "Pants"];
  private weapons:string[] = ["Axes", "Bows", "Hammers", "Javelins", "Staves", "Swords", "Wands"];
  private jewelries:string[] = ["Amulet", "Ring1", "Ring2"];//["Amulets", "Rings"];

  protected bootsSrc:string;
  protected chestSrc:string;
  protected glovesSrc:string;
  protected helmSrc:string;
  protected pantsSrc:string;
  protected weaponSrc:string;
  protected amuletSrc:string;
  protected ring1Src:string;
  protected ring2Src:string;

  constructor() {
    this.HeavyArmor = new InventoryArmorModel();
    this.LightArmor = new InventoryArmorModel();
    this.MysticArmor = new InventoryArmorModel();
    this.BleedOrArmorReduction = new InventoryDamageModel();
    this.PoisonOrBurn = new InventoryDamageModel();
    this.CleaveOrAoE = new InventoryDamageModel();
    this.KnockbackOrStun = new InventoryDamageModel();
    this.ChainOrPierceAttack = new InventoryDamageModel();
    this.ProjectileOrSummon = new InventoryDamageModel();
    this.FreezeOrRoot = new InventoryDamageModel();
    this.Physical = new InventoryDamageModel();
    this.BasicStats = new InventoryBasicStatsModel();
  }

  ngOnInit() {
    this.inventoryData = new InventoryVM(1, 1, 1);
    this.tempInventoryData = new InventoryVM(1, 1, 1); //Store new values here if slot already equipped
  }

  async ngOnChanges(changes: SimpleChanges) {
    var availableCategories:string[] = [];
    this.armors.forEach(a => { availableCategories.push(a); })
    this.jewelries.forEach(j => { availableCategories.push(j); });
    availableCategories.push("Weapon");

    availableCategories.forEach(async e => {
      if ((changes["inventoryItem"].currentValue[e] || []).length != 0) {
        this.inventoryData.selectedCategory = changes["inventoryItem"].currentValue["selectedCategory"];
        this.inventoryData.selectedType = changes["inventoryItem"].currentValue["selectedType"];
        this.inventoryData.selectedRarity = changes["inventoryItem"].currentValue["selectedRarity"];
        var selectedItem = changes["inventoryItem"].currentValue[e];

        // Logic for already equipped.. [for 2nd ring]
        this.inventoryData[e] = selectedItem;
        var slotAlreadyEquipped = (this.inventoryData[e] || []).length != 0;
        this.imageRaritiesDict[e] = this.inventoryData.selectedRarity;

        // 2nd Ring
        if (slotAlreadyEquipped && e.startsWith("Ring")) {
          this.inventoryData["Ring2"] = selectedItem;
          this.imageRaritiesDict["Ring2"] = this.inventoryData.selectedRarity;
        }

        if (selectedItem.length != 0) {
          await this.calculateArmorTypes(selectedItem, e);
          await this.calculateDamageTypes(selectedItem, e);
        }
        await this.UpdateInventoryImages(e);
      }
    });
  }

  protected async calculateArmorTypes(itemData:IItemAffix[], itemType:string) {
    if ((this.inventoryData[itemType] || []).length == 0) {
      this.inventoryData[itemType] = itemData;
    }
    else this.tempInventoryData[itemType] = itemData;

    var data:IItemAffix[][] = [
      this.inventoryData.Helm,
      this.inventoryData.Chest,
      this.inventoryData.Pants,
      this.inventoryData.Boots,
      this.inventoryData.Gloves,
      this.inventoryData.Amulet,
      this.inventoryData.Ring1,
      this.inventoryData.Ring2,
      this.inventoryData.Weapon
    ];

    this.HeavyArmor = new InventoryArmorModel();
    this.LightArmor = new InventoryArmorModel();
    this.MysticArmor = new InventoryArmorModel();

    var ccTypesdata = { totalCCPercentageRateHeavy: 0, totalCCPercentageRateLight: 0, totalCCPercentageRateMystic: 0 }
    data.forEach(a => {
      a.forEach(affix => {
        if (affix.Contents.armorStat) {
          var armorAffixData = affix.Contents.armorStat;
          var selectedArmor = Helpers.getPropertyByValue(ArmorTypesEnum, armorAffixData.ArmorType);
          this[selectedArmor + "Armor"].Armor += armorAffixData.Armor;
          this[selectedArmor + "Armor"].ItemPieces += 1;
          ccTypesdata["totalCCPercentageRate" + selectedArmor] += armorAffixData.Armor * armorAffixData.ReducePercentage;
        }
      })
    });

    var armorEnumData = Helpers.extractEnum(ArmorTypesEnum).slice(0, 3);
    armorEnumData.forEach(e => {
      var value = e.value;
      if (this[value + "Armor"].Armor != 0)
      ccTypesdata["totalCCPercentageRate" + value] = Math.round(this[value + "Armor"].ItemPieces * ccTypesdata["totalCCPercentageRate" + value]/this[value + "Armor"].Armor);
    });

    this.HeavyArmor.CCPercentage = ccTypesdata.totalCCPercentageRateHeavy;
    this.LightArmor.CCPercentage = ccTypesdata.totalCCPercentageRateLight;
    this.MysticArmor.CCPercentage = ccTypesdata.totalCCPercentageRateMystic;
  }

  protected async calculateDamageTypes(itemData:IItemAffix[], itemType:string) {
    if ((this.inventoryData[itemType] || []).length == 0) {
      this.inventoryData[itemType] = itemData;
    }
    else this.tempInventoryData[itemType] = itemData;

    var itemTypes:string[] = ["Helm","Chest","Pants","Boots","Gloves","Amulet","Ring1","Ring2","Weapon"];

    this.BleedOrArmorReduction = new InventoryDamageModel();
    this.PoisonOrBurn = new InventoryDamageModel();
    this.CleaveOrAoE = new InventoryDamageModel();
    this.KnockbackOrStun = new InventoryDamageModel();
    this.ChainOrPierceAttack = new InventoryDamageModel();
    this.ProjectileOrSummon = new InventoryDamageModel();
    this.FreezeOrRoot = new InventoryDamageModel();
    this.Physical = new InventoryDamageModel();

    itemTypes.forEach(a => {
      var affixes:ItemAffix[] = this.inventoryData[a];
      affixes.forEach(affix => {
        if (affix.Contents.damageStat) {
          var affixData = affix.Contents.damageStat;
          var selected = Helpers.getPropertyByValue(DamageTypesEnum, affixData.MainDamageType);
          this[selected].Percentage += affixData.EmpowerPercentage;
        }
      })
    });
  }

  protected ArmorSrc(type:string):string {
    var srcEmpty = "_Resources\\img\\borders\\border.png";
    return (this.inventoryData[type] || []).length ? "_Resources\\img\\items\\A" + type[0] + type[1] + this.imageRaritiesDict[type] + ".png" : srcEmpty;
  }

  protected WeaponSrc():string {
    var data = this.inventoryData;
    var srcEmpty = "_Resources\\img\\borders\\border.png";
    var selectedItemType = data.selectedCategory == 1 ? this.armors[data.selectedType - 1] : data.selectedCategory == 2 ? this.weapons[data.selectedType - 1] : this.jewelries[data.selectedType - 1];
    return (this.inventoryData["Weapon"] || []).length ? "_Resources\\img\\items\\W" + selectedItemType[0] + selectedItemType[1] + this.imageRaritiesDict["Weapon"] + ".png" : srcEmpty;
  }
  protected JewelrySrc(type:string):string {
    var srcEmpty = "_Resources\\img\\borders\\border.png";
    return (this.inventoryData[type] || []).length ? "_Resources\\img\\items\\J" + type[0] + type[1] + this.imageRaritiesDict[type] + ".png" : srcEmpty;
  }

  private UpdateInventoryImages(type) {

    if (this.armors.includes(type)){
      this.bootsSrc = this.ArmorSrc("Boots");
      this.chestSrc = this.ArmorSrc("Chest");
      this.glovesSrc = this.ArmorSrc("Gloves");
      this.helmSrc = this.ArmorSrc("Helm");
      this.pantsSrc = this.ArmorSrc("Pants");
    }
    else if (this.jewelries.includes(type)){
      this.amuletSrc = this.JewelrySrc("Amulet");
      this.ring1Src = this.JewelrySrc("Ring1");
      this.ring2Src = this.JewelrySrc("Ring2");
    }
    else this.weaponSrc = this.WeaponSrc();
  }
  
  protected GetImgSrc():string {
    var data = this.inventoryData;
    var srcEmpty = "_Resources\\img\\borders\\border.png";
    var filtersSelected = data.selectedCategory && data.selectedType && data.selectedRarity;
    var selectedCategoryType = data.selectedCategory == 1 ? "A" : data.selectedCategory == 2 ? "W" : "J";
    var selectedItemType = data.selectedCategory == 1 ? this.armors[data.selectedType - 1] : data.selectedCategory == 2 ? this.weapons[data.selectedType - 1] : this.jewelries[data.selectedType - 1];
    return filtersSelected ? "_Resources\\img\\items\\" + selectedCategoryType + selectedItemType[0] + selectedItemType[1] + data.selectedRarity + ".png" : srcEmpty;
  }

  private imageRaritiesDict = {
    'Boots':0,
    'Chest':0,
    'Gloves':0,
    'Helm':0,
    'Pants':0,
    'Weapon':0,
    'Amulet':0,
    'Ring1':0,
    'Ring2':0
  };
}
