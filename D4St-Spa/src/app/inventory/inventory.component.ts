import { Component, OnInit, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { IItemAffix } from 'src/Models/ItemAffixes/IItemAffix';
import { InventoryVM } from 'src/Models/InventoryModels/InventoryVM';
import { InventoryArmorModelCombined, InventoryArmorModel } from 'src/Models/InventoryModels/InventoryArmorModel';
import { InventoryBasicStatsModel } from 'src/Models/InventoryModels/InventoryBasicStatsModel';
import { SkillVM } from 'src/Models/SkillVM';
import { ICCEffectStatDetailsInventoryModel, ICCffectStatDetailsInventoryModelCombined } from 'src/Models/InventoryModels/InventoryDetailModels/ICCEffectDetailsInventoryModel';
import { ArmorStatDetailsInventoryModel, ArmorStatDetailsInventoryModelCombined } from 'src/Models/InventoryModels/InventoryDetailModels/ArmorStatDetailsInventoryModel';
import { InventoryDamageModelCombined, InventoryDamageEmpowerModelCombined } from 'src/Models/InventoryModels/InventoryPrimaryDamageModel';
import { InventoryResistancesModel } from 'src/Models/InventoryModels/InventoryResistancesModel';
import { Helpers } from 'src/_Helpers/helpers';
import { ArmorTypesEnum, ItemCategoriesEnum } from 'src/_Enums/itemAffixEnums';
import { ItemArmorStats } from 'src/Models/ItemAffixes/Details/ItemArmorStats';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { BasicCharStats } from 'src/Models/BasicCharStats';
import { InventoryTriggerModelCombined } from 'src/Models/InventoryModels/InventoryTriggerModelCombined';
import { InventorySkillStatModelCombined } from 'src/Models/InventoryModels/InventorySkillStatModelCombined';
import { InventoryOfensiveStatsModel } from 'src/Models/InventoryModels/InventoryDetailModels/InventoryOfensiveStatsModel';
import { InventoryDefensiveStatsModel } from 'src/Models/InventoryModels/InventoryDetailModels/InventoryDefensiveStatsModel';
import { InventoryLegendaryModelCombined } from 'src/Models/InventoryModels/InventoryLegendaryModelCombined';
import { InventorySecondaryTriggerModelCombined } from 'src/Models/InventoryModels/InventorySecondaryTriggerModelCombined';
import { InventorySecondaryBasicModelCombined } from 'src/Models/InventoryModels/InventorySecondaryBasicModelCombined';
import { InventoryConditionalModelCombined } from 'src/Models/InventoryModels/InventoryConditionalModelCombined';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit, OnChanges {

  protected inventoryData: InventoryVM;
  @Input()inventoryItem: InventoryVM;
  @Input()basicChatStats: BasicCharStats;
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

  protected BootsDescription:string;
  protected ChestDescription:string;
  protected GlovesDescription:string;
  protected HelmDescription:string;
  protected PantsDescription:string;
  protected WeaponDescription:string;
  protected AmuletDescription:string;
  protected Ring1Description:string;
  protected Ring2Description:string;

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
    this.basicChatStats = new BasicCharStats();
    this.DamageData = new InventoryDamageModelCombined();
    this.DamageEmpowerData = new InventoryDamageEmpowerModelCombined();
    this.ArmorData = new InventoryArmorModelCombined();
    this.Resistance = new InventoryResistancesModel();
    // this.ArmorDetails = new  ICCEffectStatDetailsInventoryModel();
    this.ArmorDetails = new ArmorStatDetailsInventoryModel();
    // this.CCEffectsData = new  ICCffectStatDetailsInventoryModelCombined();
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
    var selectedItem:IItemAffix[] = selectedInventoryType? (changes["inventoryItem"] || {currentValue:[]}).currentValue[selectedInventoryType] || [] : [];
    this.imageRaritiesDict[selectedInventoryType] = this.inventoryData.selectedRarity;
    this.inventoryData[selectedInventoryType] = selectedItem;

    // Reset Model Data
    this.InitializeModelData();
    this.UpdateInventoryImages(selectedInventoryType);

    // Recalculate for Each equipped Item

    // UPDATE-INFO: getZeroStats() doesn't really have any useful usage unless redone (with -). Basically Reinitializing the Model itself does this step better..
    // // Step2: Foreach Affix in selected item, reset the numbers
    // availableCategories.forEach(cat => {
    //   selectedItem = this.inventoryData[cat];
    //   this.ResetAffixes(selectedItem);
    // });

    // Step3: Foreach Affix in selected item, recalculate the numbers
    availableCategories.forEach(cat => {
      selectedItem = this.inventoryData[cat];
      this.ApplyAffixes(selectedItem);
    });

    availableCategories.forEach(cat => {
      var affixDescriptions:string[] = [];
      this.inventoryData[cat].forEach(a => affixDescriptions.push(a.GetAffixDescription(this.skillData)));
      this[cat + "Description"] = affixDescriptions.join('<br/>');
    });
  }

  private async ResetAffixes(selectedItem:IItemAffix[]) {
    selectedItem.forEach(async a => {
      var outputMetaData = a.Contents.AffixData.EquippableStatData.OutputMeta;
      var selectedStat = outputMetaData["SelectedStat"];
      var selectedSubStat = outputMetaData["SelectedEquipStat"] || a.Contents.AffixData.SelectedEquipStat;
      if (categoryStat == "SkillStats")
        selectedSubStat = "Skills";
      var categoryStat = outputMetaData["SelectedCategoryStat"];
      if (categoryStat == "BasicStats") {
        selectedStat = selectedStat.replace("Stat", "");
        selectedSubStat = selectedSubStat.replace("Percentage", "").replace("Amount", "").replace("Regen", "").replace("Return", "").replace("Resistance", "");
        // Swap
        var tempStat = selectedStat;
        selectedStat = selectedSubStat;
        selectedSubStat = tempStat;
    
        // debugger;
        var srcStat = a.Contents.AffixData;//this[categoryStat][selectedStat];
        this[categoryStat][selectedStat] = a.Contents.AffixData.getZeroStats(srcStat);
      }
      else {
        // debugger;
        var selectedParentStat = categoryStat && this[categoryStat] ? this[categoryStat][selectedStat] : this[selectedStat];
        if (a.Contents.AffixData.getZeroStats && selectedParentStat) {
          var srcStat = selectedParentStat[selectedSubStat];
          if (categoryStat)
            this[categoryStat][selectedStat][selectedSubStat] = a.Contents.AffixData.getZeroStats(srcStat);
          else this[selectedStat][selectedSubStat] = a.Contents.AffixData.getZeroStats(srcStat);
        }
        else {
          debugger;
        }
      }
    });    
  }

  private async ApplyAffixes(selectedItem:IItemAffix[]) {
    selectedItem.forEach(async a => {
      var outputMetaData = a.Contents.AffixData.EquippableStatData.OutputMeta;
      var selectedStat = outputMetaData["SelectedStat"];
      var selectedSubStat = outputMetaData["SelectedEquipStat"] || a.Contents.AffixData.SelectedEquipStat;
      var categoryStat = outputMetaData["SelectedCategoryStat"];

      var selectedModelStat = (selectedStat == "DamageData") ? ["DamageData", selectedSubStat] //this[selectedStat][selectedSubStat]
      : (selectedStat == "DamageEmpowerData") ? ["DamageEmpowerData", selectedSubStat] //this[selectedStat][selectedSubStat]
      : (["StatNumbers", "StatRegen", "StatPercentage", "StatPercentageRegen", "StatReturn"].includes(selectedStat)) ? [selectedStat, selectedSubStat] //this["BasicStats"][selectedSubStat]
      : (selectedStat == "Resistance") ? ["Resistance", selectedSubStat] //this[selectedStat][statType]
      : (selectedStat == "PowerData" || selectedStat == "PowerStats") ? ["PowerData", selectedSubStat]// this["BasicStats"][selectedSubStat]
      : (selectedStat == "SkillData" || selectedStat == "SkillEmpower") ? ["SkillData", selectedSubStat]//this["BasicStats"][selectedStat]
      : (selectedStat == "ArmorData") ? ["ArmorData", selectedSubStat] // this["ArmorData"][selectedStat + "Armor"]
      : null;



      if (categoryStat == "SkillStats") {
        selectedModelStat = ["SkillData", "Skills"];
        selectedSubStat = "Skills";
      }

      if (categoryStat == "BasicStats" && selectedStat.indexOf("Power") == -1) {
        // debugger;
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
          debugger;
        }
      }

      if (selectedModelStat) {
        // debugger;
        var srcStat = categoryStat ? this[categoryStat][selectedModelStat[0]]//[selectedModelStat[1]]
                                   : this[selectedModelStat[0]];//[selectedModelStat[1]];

        if (selectedModelStat[0] == "ArmorData") {
          srcStat = this[selectedModelStat[0]];
          this[selectedModelStat[0]] = a.Contents.updateEquippedStats(srcStat, a);
        }
        else if (categoryStat)
          this[categoryStat][selectedModelStat[0]] = a.Contents.updateEquippedStats(srcStat, a);
        else {
          srcStat = this[selectedModelStat[0]];
          this[selectedModelStat[0]] = a.Contents.updateEquippedStats(srcStat, a);
        }
      }
      else {
        debugger;
      };
    })
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
        var selectedStat = affix.Contents.EquippableStatData.OutputMeta["SelectedStat"] || affix.Contents.AffixData.OutputMeta["SelectedStat"];
        var selectedType = affix.Contents.AffixData.OutputMeta.SelectedEquipStat;
        if (selectedStat == "ArmorData") {
          var armorAffixData = affix.Contents.AffixData as ItemArmorStats;
          var selectedArmor = Helpers.getPropertyByValue(ArmorTypesEnum, armorAffixData.ArmorType);
          this["ArmorData"][selectedArmor + "Armor"].Amount += armorAffixData.Amount;
        }
      })
    });
  }
  
  protected async calculateArmorDetailData() {

    var totals:number[] = [];
    ["HeavyArmor", "LightArmor", "MysticArmor"].forEach(at => {
      debugger;
      var calculationFactor = new CalculationsHelper().GetCalculatedFactor(at, this.ArmorData[at].Amount, this.basicChatStats.Level);
      totals.push(Math.round(calculationFactor * this.ArmorData[at].Amount * 10) / 10);
    })

    var total = 0;
    totals.forEach(t => total += t)
    debugger;
    this.ArmorData.Armor.Amount = total;
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
