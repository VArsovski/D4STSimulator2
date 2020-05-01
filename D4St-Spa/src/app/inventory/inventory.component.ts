import { Component, OnInit, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { IItemAffix } from 'src/Models/ItemAffixes/IItemAffix';
import { InventoryVM } from 'src/Models/InventoryVM';
import { InventoryArmorModelCombined, InventoryArmorModel } from 'src/Models/InventoryArmorModel';
import { InventoryBasicStatsModel } from 'src/Models/InventoryBasicStatsModel';
import { SkillVM } from 'src/Models/SkillVM';
import { IArmorStatDetailsInventoryModel, IArmorStatDetailsInventoryModelCombined } from 'src/Models/InventoryDetailModels/IArmorStatDetailsInventoryModel';
import { ArmorStatDetailsInventoryModel, ArmorStatDetailsInventoryModelCombined } from 'src/Models/InventoryDetailModels/ArmorStatDetailsInventoryModel';
import { IEquippableStat } from 'src/Models/InventoryDetailModels/IEquippableStat';
import { InventoryDamageModelCombined, InventoryDamageEmpowerModelCombined } from 'src/Models/InventoryPrimaryDamageModel';
import { InventoryResistancesModel } from 'src/Models/InventoryResistancesModel';
import { Helpers } from 'src/_Helpers/helpers';
import { ArmorTypesEnum } from 'src/_Enums/itemAffixEnums';
import { ItemArmorStats } from 'src/Models/ItemAffixes/Details/ItemArmorStats';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit, OnChanges {

  protected inventoryData: InventoryVM;
  @Input()inventoryItem: InventoryVM;
  protected tempInventoryData: InventoryVM;

  protected DamageData:InventoryDamageModelCombined;
  protected DamageEmpowerData:InventoryDamageEmpowerModelCombined;
  protected ArmorData:InventoryArmorModelCombined;
  protected Resistance:InventoryResistancesModel;

  protected ArmorDetails: IArmorStatDetailsInventoryModel;
  protected ArmorDetailsCombined: IArmorStatDetailsInventoryModelCombined;

  protected BootsDescription:string;
  protected ChestDescription:string;
  protected GlovesDescription:string;
  protected HelmDescription:string;
  protected PantsDescription:string;
  protected WeaponDescription:string;
  protected AmuletDescription:string;
  protected Ring1Description:string;
  protected Ring2Description:string;

  protected BasicStats:InventoryBasicStatsModel;
  protected Level:number;

  private armors :string[] = ["Boots","Chest", "Gloves", "Helm", "Pants"];
  private weapons:string[] = ["Axes", "Bows", "Hammers", "Swords", "Javelins", "Wands", "Staves"];
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
  protected skillData: SkillVM[];

  constructor() {
    this.skillData = [];
    this.ArmorData = new InventoryArmorModelCombined();
    this.BasicStats = new InventoryBasicStatsModel();
    this.DamageData = new InventoryDamageModelCombined();
    this.DamageEmpowerData = new InventoryDamageEmpowerModelCombined();
  }

  ngOnInit() {
    this.inventoryData = new InventoryVM(1, 1, 1);
    this.tempInventoryData = new InventoryVM(1, 1, 1); //Store new values here if slot already equipped
    this.DamageData = new InventoryDamageModelCombined();
    this.ArmorDetails = new ArmorStatDetailsInventoryModel();
    this.ArmorDetailsCombined = new ArmorStatDetailsInventoryModelCombined();
    this.Resistance = new InventoryResistancesModel();

    this.armors.forEach(a => this[a + "Description"] = "");
    this.jewelries.forEach(a => this[a + "Description"] = "");
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
        
        var selectedItem:IItemAffix[] = changes["inventoryItem"].currentValue[e];
        // var slotAlreadyEquipped = (this.inventoryData[e] || []).length != 0;
        this.inventoryData[e] = selectedItem;
        this.imageRaritiesDict[e] = this.inventoryData.selectedRarity;

        if (selectedItem.length != 0) {
          selectedItem.forEach(async a => {
            var selectedStat = a.Contents["SelectedStat"] || a.Contents.AffixData["SelectedStat"];
            var selectedSubStat = a.Contents.AffixData.SelectedEquipStat;

            debugger;
            var selectedLevel = a.Contents.AffixData["Level"];
            if (selectedLevel > (this.Level || 0))
              this.Level = selectedLevel;

            if (selectedStat == "DamageData" || selectedStat == "DamageEmpowerData") {
              var selectedSrcStat = this[selectedStat][selectedSubStat];
              this[selectedStat][selectedSubStat] = (a.Contents as IEquippableStat).updateEquippedStats(selectedSrcStat, a as IItemAffix);
            }

            if (["StatNumbers", "StatRegen", "StatPercentage", "StatPercentageRegen"].includes(selectedStat)) {
              var statType = selectedSubStat.replace("Regen", "").replace("Percentage", "");
              var selectedSrcStat = this["BasicStats"][statType];
              this["BasicStats"][statType] = (a.Contents as IEquippableStat).updateEquippedStats(selectedSrcStat, a as IItemAffix);
            }

            if (selectedStat == "PowerData" || selectedStat == "PowerStats") {
              var selectedSrcStat = this["BasicStats"][selectedSubStat];
              if (selectedSubStat != "AllPower")
                this["BasicStats"][selectedSubStat] = (a.Contents as IEquippableStat).updateEquippedStats(selectedSrcStat, a as IItemAffix);
              else {
                ["AngelicPower", "DemonicPower", "AncestralPower"].forEach(p => 
                  this["BasicStats"][p] = (a.Contents as IEquippableStat).updateEquippedStats(this["BasicStats"][p], a as IItemAffix));
              }
            }

            if (selectedStat == "SkillData" || selectedStat == "SkillEmpower") {
              // var selectedSrcStat = this[selectedStat][selectedSubStat];
              // this["BasicStats"][selectedStat] = (a.Contents as IEquippableStat).updateEquippedStats(selectedSrcStat, a as IItemAffix);
            }

            if (selectedStat == "ArmorData") {
              // If Armor recalculate everything instead of just the SubData
              await this.calculateArmorTypes(selectedItem, e);
            }
          })

          await this.calculateArmorDetailData();
        }

        await this.UpdateInventoryImages(e);

        var affixDescriptions:string[] = [];
        selectedItem.forEach(a => affixDescriptions.push(a.GetAffixDescription(this.skillData)));

        this[e + "Description"] = affixDescriptions.join('<br/>');
      }
    });
    await this.SetClassNames();
  }
  protected async calculateArmorDetailData() {
      var totals:number[] = [];
      ["HeavyArmor", "LightArmor", "MysticArmor"].forEach(at => {
        debugger;
        var calculationFactor = new CalculationsHelper().GetCalculatedFactor(at, this.ArmorData[at].Amount, this.Level);
        totals.push(Math.round(calculationFactor * this.ArmorData[at].Amount * 10) / 10);
      })

      var total = 0;
      totals.forEach(t => total += t)
      debugger;
      this.ArmorData.Armor.Amount = total;
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

    this.ArmorData.HeavyArmor = new InventoryArmorModel();
    this.ArmorData.LightArmor = new InventoryArmorModel();
    this.ArmorData.MysticArmor = new InventoryArmorModel();

    var ccTypesdata = { totalCCPercentageRateHeavy: 0, totalCCPercentageRateLight: 0, totalCCPercentageRateMystic: 0 }
    data.forEach(a => {
      a.forEach(affix => {
        var selectedStat = affix.Contents["SelectedStat"] || affix.Contents.AffixData["SelectedStat"];
        var selectedType = affix.Contents.AffixData.SelectedEquipStat;
        if (selectedStat == "ArmorData") {
          var armorAffixData = affix.Contents.AffixData as ItemArmorStats;
          var selectedArmor = Helpers.getPropertyByValue(ArmorTypesEnum, armorAffixData.ArmorType);
          this["ArmorData"][selectedArmor + "Armor"].Amount += armorAffixData.Armor;
        }
      })
    });

    // var armorEnumData = Helpers.extractEnum(ArmorTypesEnum).slice(0, 3);
    // armorEnumData.forEach(e => {
    //   var value = e.value;
    //   if (this["ArmorData"][value + "Armor"].Armor != 0)
    //   ccTypesdata["totalCCPercentageRate" + value] = Math.round(this[value + "Armor"].ItemPieces * ccTypesdata["totalCCPercentageRate" + value]/this[value + "Armor"].Armor);
    // });

    // this.ArmorData.HeavyArmor.CCPercentage = ccTypesdata.totalCCPercentageRateHeavy;
    // this.ArmorData.LightArmor.CCPercentage = ccTypesdata.totalCCPercentageRateLight;
    // this.ArmorData.MysticArmor.CCPercentage = ccTypesdata.totalCCPercentageRateMystic;
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

  // FUCK THIS BULLSHIT CROSS SITE SCRIPTING PROTECTION MAN
  // SUSUUUUUUUU UUUUUUUUUUUUUUUUUCH A BUUUUUUUUUULSHIT, BULLSHIT
  protected WeaponCss:string;
  protected AmuletCss:string;
  protected Ring1Css:string;
  protected Ring2Css:string;

  protected async SetClassNames() {
    if (this.inventoryData) {
      setTimeout(() => {
        var classStr:string = "";
        var armorEquipped:boolean = false;
        var weaponEquipped:boolean = (this.inventoryData["Weapon"] || []).length != 0;
        var jewelryEquipped:boolean = false;
    
        for (let a = 0; a < this.armors.length; a++) {
          if ((this.inventoryData[this.armors[a]] || []).length) {
            armorEquipped = true;
            break;
          }
        }
        for (let a = 0; a < this.armors.length; a++) {
          if ((this.inventoryData[this.jewelries[a]] || []).length) {
            jewelryEquipped = true;
            break;
          }
        }

        if (armorEquipped)
          classStr += "WithArmor";
        if (weaponEquipped)
          classStr+="WithWeapon";

        var variableItems = [];
        this.jewelries.forEach(j => {variableItems.push(j)});
        variableItems.push("Weapon");
        variableItems.forEach(v => {
          this[v + "Css"] = v.toLowerCase() + classStr + "Item";
        })
      }, 35);
    }
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
