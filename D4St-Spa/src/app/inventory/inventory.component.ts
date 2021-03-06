import { Component, OnInit, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { IItemAffix } from 'src/Models/ItemAffixes/IItemAffix';
import { InventoryVM } from 'src/Models/InventoryModels/InventoryVM';
import { InventoryArmorModelCombined } from 'src/Models/InventoryModels/InventoryArmorModel';
import { InventoryBasicStatsModel } from 'src/Models/InventoryModels/InventoryBasicStatsModel';
import { SkillVM } from 'src/Models/SkillVM';
import { ICCEffectStatDetailsInventoryModel, ICCffectStatDetailsInventoryModelCombined } from 'src/Models/InventoryModels/InventoryDetailModels/ICCEffectDetailsInventoryModel';
import { ArmorStatDetailsInventoryModelCombined } from 'src/Models/InventoryModels/InventoryDetailModels/ArmorStatDetailsInventoryModel';
import { InventoryDamageModelCombined, InventoryDamageEmpowerModelCombined } from 'src/Models/InventoryModels/InventoryPrimaryDamageModel';
import { InventoryResistancesModel } from 'src/Models/InventoryModels/InventoryResistancesModel';
import { ItemCategoriesEnum, ArmorTypesEnum } from 'src/_Enums/itemAffixEnums';
import { BasicCharStats } from 'src/Models/BasicCharStats';
import { InventoryTriggerModelCombined } from 'src/Models/InventoryModels/InventoryTriggerModelCombined';
import { InventorySkillStatModelCombined } from 'src/Models/InventoryModels/InventorySkillStatModelCombined';
import { InventoryOfensiveStatsModel } from 'src/Models/InventoryModels/InventoryDetailModels/InventoryOfensiveStatsModel';
import { InventoryDefensiveStatsModel } from 'src/Models/InventoryModels/InventoryDetailModels/InventoryDefensiveStatsModel';
import { InventoryLegendaryModelCombined } from 'src/Models/InventoryModels/InventoryLegendaryModelCombined';
import { InventorySecondaryTriggerModelCombined } from 'src/Models/InventoryModels/InventorySecondaryTriggerModelCombined';
import { InventorySecondaryBasicModelCombined } from 'src/Models/InventoryModels/InventorySecondaryBasicModelCombined';
import { InventoryConditionalModelCombined } from 'src/Models/InventoryModels/InventoryConditionalModelCombined';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { Helpers } from 'src/_Helpers/helpers';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit, OnChanges {

  protected inventoryData: InventoryVM;
  @Input()inventoryItem: InventoryVM;
  @Input()basicCharStats: BasicCharStats;
  protected tempInventoryData: InventoryVM;

  protected BasicStats:InventoryBasicStatsModel;
  protected DamageData:InventoryDamageModelCombined;
  protected DamageEmpowerData:InventoryDamageEmpowerModelCombined;
  protected ArmorData:InventoryArmorModelCombined;
  protected Resistance:InventoryResistancesModel;
  protected ArmorDetails: ICCEffectStatDetailsInventoryModel;
  protected CCEffectsData: ICCffectStatDetailsInventoryModelCombined;
  protected OfensiveStatData:InventoryOfensiveStatsModel;
  protected DefensiveStatData:InventoryDefensiveStatsModel;
  protected TriggerData: InventoryTriggerModelCombined;
  protected SkillStats: InventorySkillStatModelCombined;
  protected SecondaryBasicStat: InventorySecondaryBasicModelCombined;
  protected SecondaryTriggerStats: InventorySecondaryTriggerModelCombined;
  protected ConditionalAffixStatsData: InventoryConditionalModelCombined;
  protected LegendaryStatData: InventoryLegendaryModelCombined;

  protected TotalArmorClassStr:string;
  protected BootsDescription:string;
  protected ChestDescription:string;
  protected GlovesDescription:string;
  protected HelmDescription:string;
  protected PantsDescription:string;
  protected WeaponDescription:string;
  protected AmuletDescription:string;
  protected Ring1Description:string;
  protected Ring2Description:string;

  protected bootsItemClass:string;
  protected chestItemClass:string;
  protected glovesItemClass:string;
  protected helmItemClass:string;
  protected pantsItemClass:string;
  protected weaponItemClass:string;
  protected amuletItemClass:string;
  protected ring1ItemClass:string;
  protected ring2ItemClass:string;

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
    this.inventoryData = new InventoryVM(1, 1, 1);
    this.tempInventoryData = new InventoryVM(1, 1, 1); //Store new values here if slot already equipped
    this.InitializeModelData();
  }

  ngOnInit() {
    this.armors.forEach(a => this[a + "Description"] = "");
    this.jewelries.forEach(a => this[a + "Description"] = "");
  }

  private InitializeModelData() {
    this.skillData = [];
    this.SkillStats = new InventorySkillStatModelCombined();

    this.BasicStats = new InventoryBasicStatsModel();
    this.basicCharStats = new BasicCharStats();
    this.DamageData = new InventoryDamageModelCombined();
    this.DamageEmpowerData = new InventoryDamageEmpowerModelCombined();
    this.ArmorData = new InventoryArmorModelCombined();
    this.Resistance = new InventoryResistancesModel();
    // this.ArmorDetails = new ArmorStatDetailsInventoryModel();
    this.CCEffectsData = new ArmorStatDetailsInventoryModelCombined();
    this.OfensiveStatData = new InventoryOfensiveStatsModel();
    this.DefensiveStatData = new InventoryDefensiveStatsModel();
    this.TriggerData = new  InventoryTriggerModelCombined();
    this.SkillStats = new  InventorySkillStatModelCombined();
    this.SecondaryBasicStat = new InventorySecondaryBasicModelCombined();
    this.SecondaryTriggerStats = new  InventorySecondaryTriggerModelCombined();
    this.ConditionalAffixStatsData = new InventoryConditionalModelCombined();
    this.LegendaryStatData = new  InventoryLegendaryModelCombined();
  }

  async ngOnChanges(changes: SimpleChanges) {
    var availableCategories:string[] = [];
    this.armors.forEach(a => { availableCategories.push(a); })
    this.jewelries.forEach(j => { availableCategories.push(j); });
    availableCategories.push("Weapon");

    // RESET just the data of type that our IItemAffix[] list needs to recalculate
    // this.InitializeModelData();
    var changesMade = changes["inventoryItem"] != null;
    this.inventoryData.selectedCategory = changesMade && changes["inventoryItem"].currentValue ? changes["inventoryItem"].currentValue["selectedCategory"] : null;
    this.inventoryData.selectedType = changesMade && changes["inventoryItem"].currentValue ? changes["inventoryItem"].currentValue["selectedType"] : null;
    this.inventoryData.selectedRarity = changesMade && changes["inventoryItem"].currentValue ? changes["inventoryItem"].currentValue["selectedRarity"] : null;

    // Step1: find SelectedItem
    var selectedInventoryType = changesMade ? this.inventoryData.selectedCategory == ItemCategoriesEnum.Armor ? this.armors[this.inventoryData.selectedType - 1]
                                            : this.inventoryData.selectedCategory == ItemCategoriesEnum.Jewelry ? this.jewelries[this.inventoryData.selectedType - 1]
                                            : "Weapon" : null;

    var slotAlreadyEquipped = (this.inventoryData[selectedInventoryType] || []).length != 0;
    if (slotAlreadyEquipped)
      this.tempInventoryData[selectedInventoryType] = this.inventoryData[selectedInventoryType];
    var selectedItem:IItemAffix[] = selectedInventoryType? (changes["inventoryItem"] || {currentValue:[]}).currentValue[selectedInventoryType] || [] : [];
    this.imageRaritiesDict[selectedInventoryType] = this.inventoryData.selectedRarity;
    this.inventoryData[selectedInventoryType] = selectedItem;

    // Reset Model Data
    var basicCharStats = this.basicCharStats;
    this.InitializeModelData();

    // Reinit CharStats (most importantly Level)
    this.basicCharStats = changes["basicCharStats"] && changes["basicCharStats"].currentValue ? changes["basicCharStats"].currentValue : basicCharStats;

    // Recalculate for Each equipped Item
    // // Step2: Foreach Affix in selected item, reset the numbers
    // availableCategories.forEach(cat => { selectedItem = this.inventoryData[cat]; this.ResetAffixes(selectedItem); });

    // Step3: Foreach Affix in selected item, recalculate the numbers
    availableCategories.forEach(cat => {
      this.ApplyAffixes(this.inventoryData[cat]);
      this.recalculateCCTypes(this.inventoryData[cat]);
    });

    this.RecalculatePhysicalDamageReduction();
    this.TotalArmorClassStr = this.ArmorData.HeavyArmor.Amount + this.ArmorData.LightArmor.Amount + this.ArmorData.MysticArmor.Amount < 1000 ? "customFontRed h2" : "customFontRed h3";

    availableCategories.forEach(cat => {
      var affixDescriptions:string[] = [];
      this.inventoryData[cat].forEach(a => affixDescriptions.push(a.GetAffixDescription(this.skillData)));
      this[cat + "Description"] = affixDescriptions.join('<br/>');
    });

    this.UpdateInventoryImages(selectedInventoryType);
    this.UpdateInventoryImageClasses();
  }

  private async ApplyAffixes(selectedItem:IItemAffix[]) {
    selectedItem.forEach(async a => {
      var outputMetaData = a.Contents.AffixData.EquippableStatData.OutputMeta;
      var selectedStat = outputMetaData["SelectedStat"];
      var selectedSubStat = outputMetaData["SelectedEquipStat"] || a.Contents.AffixData.SelectedEquipStat;
      var categoryStat = outputMetaData["SelectedCategoryStat"];

      var selectedModelStat = (selectedStat == "DamageData") ? ["DamageData", selectedSubStat] //this[selectedStat][selectedSubStat]
      : (categoryStat == "DamageEmpowerData") ? [selectedStat, selectedSubStat] //this[selectedStat][selectedSubStat]
      : (["StatNumbers", "StatRegen", "StatPercentage", "StatPercentageRegen", "StatReturn"].includes(selectedStat)) ? [selectedStat, selectedSubStat] //this["BasicStats"][selectedSubStat]
      : (selectedStat == "Resistance") ? ["Resistance", selectedSubStat] //this[selectedStat][statType]
      : (selectedStat == "PowerData" || selectedStat == "PowerStats") ? ["PowerData", selectedSubStat]// this["BasicStats"][selectedSubStat]
      : (selectedStat == "SkillData" || selectedStat == "SkillEmpower") ? ["SkillData", selectedSubStat]//this["BasicStats"][selectedStat]
      : (selectedStat == "ArmorData") ? ["ArmorData", selectedSubStat] // this["ArmorData"][selectedStat + "Armor"]
      : (selectedStat == "ReduceCCTaken") ? [selectedSubStat, "ReducePercentage"] // this["ArmorData"][selectedStat + "Armor"]
      : null;

      if (categoryStat == "SkillStats") {
        selectedModelStat = ["SkillData", "Skills"];
        selectedSubStat = "Skills";
      }

      if (categoryStat == "BasicStats" && selectedStat.indexOf("Power") == -1) {
        // debugger;
        selectedModelStat = [];
        selectedStat = selectedStat.replace("Stat", "");
        selectedSubStat = selectedSubStat.replace("Percentage", "").replace("Amount", "").replace("Regen", "").replace("Return", "");
        // Swap
        var tempStat = selectedStat;
        selectedStat = selectedSubStat;
        selectedSubStat = tempStat;
        if (selectedModelStat) {
          selectedModelStat[0] = selectedStat;
          selectedModelStat[1] = selectedSubStat;
        } else {
          // debugger;
        }
      }

      if (selectedModelStat) {
        var srcStat = categoryStat ? this[categoryStat][selectedModelStat[0]]//[selectedModelStat[1]]
                                   : this[selectedModelStat[0]];//[selectedModelStat[1]];

        if (selectedModelStat[0] == "ArmorData") {
          srcStat = this[selectedModelStat[0]];
          this[selectedModelStat[0]] = a.Contents.updateEquippedStats(srcStat, a);
        }
        else if (categoryStat)
        if (!a.Contents.updateEquippedStats){
          debugger;
        } else this[categoryStat][selectedModelStat[0]] = a.Contents.updateEquippedStats(srcStat, a);
        else {
          srcStat = this[selectedModelStat[0]];
          this[selectedModelStat[0]] = a.Contents.updateEquippedStats(srcStat, a);
        }
      }
      else {
        // debugger;
      };
    })
  }

  private RecalculatePhysicalDamageReduction() {
    var armorData = [this.ArmorData.LightArmor.Amount, this.ArmorData.HeavyArmor.Amount, this.ArmorData.MysticArmor.Amount];
    var phReduction = 0;
    armorData.forEach((a, i) => {
      var selectedType = Helpers.getPropertyByValue(ArmorTypesEnum, i + 1);
      var level = this.basicCharStats.Level;
      phReduction += new CalculationsHelper().GetCalculatedFactor(selectedType, a, level);
    })

    this.ArmorData.Armor.Amount = phReduction;
  }

  recalculateCCTypes(selectedItemm: IItemAffix[]) {
    selectedItemm.forEach(a => {
      var outputMetaData = a.Contents.AffixData.EquippableStatData.OutputMeta;
      if (outputMetaData["SelectedStat"] == "ArmorData") {
        var amount = a.Contents.AffixData.Amount;
        var type = a.Contents.AffixData.ArmorType;
        var calcAmount = Math.round(new CalculationsHelper().getCCTypeDataForArmor(this.basicCharStats.Level, amount) * 10)/10;
        if (type == ArmorTypesEnum.Heavy) {
          this.CCEffectsData.StunOrKnockdown.ReducePercentage += calcAmount;
          this.CCEffectsData.KnockbackOrBleed.ReducePercentage += calcAmount;
        }
        if (type == ArmorTypesEnum.Light) {
          this.CCEffectsData.BlindOrRoot.ReducePercentage += calcAmount;
          this.CCEffectsData.ReduceArmorOrLevitate.ReducePercentage += calcAmount;
        }
        if (type == ArmorTypesEnum.Mystic) {
          this.CCEffectsData.FreezeOrCurse.ReducePercentage += calcAmount;
          this.CCEffectsData.WitherOrConflagrate.ReducePercentage += calcAmount;
        }
      }
    })
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

  private async UpdateInventoryImages(type) {
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
    else {
      this.weaponSrc = this.WeaponSrc();
    }
  }

  private async UpdateInventoryImageClasses() {
    var totalArmor = this.ArmorData.HeavyArmor.Amount + this.ArmorData.LightArmor.Amount + this.ArmorData.MysticArmor.Amount;
    var armorSuffix = totalArmor > 1000 ? "1000" : totalArmor > 100 ? "100" : totalArmor > 10 ? "10" : "";

    // if (itemType == ItemCategoriesEnum.Armor) {
      this.bootsItemClass = "bootsItem" + armorSuffix;
      this.chestItemClass = "chestItem" + armorSuffix;
      this.glovesItemClass = "glovesItem" + armorSuffix;
      this.helmItemClass = "helmItem" + armorSuffix;
      this.pantsItemClass = "pantsItem" + armorSuffix;

    // if (itemType == ItemCategoriesEnum.Jewelry) {
      this.amuletItemClass = "amuletItem" + armorSuffix;
      this.ring1ItemClass = "ring1Item" + armorSuffix;
      this.ring2ItemClass = "ring2Item" + armorSuffix;

    // if (itemType == ItemCategoriesEnum.Weapon)
      this.weaponItemClass = "weaponItem" + armorSuffix;
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
