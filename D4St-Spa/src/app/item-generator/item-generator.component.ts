import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { IDropdownImageItem } from 'src/Models/_Common/IDropdownImageItem';
import { DropdownImageItem } from 'src/Models/_Common/DropdownImageItem';
import { Helpers } from 'src/_Helpers/helpers';
import { ItemAffixGenerator } from 'src/Models/ItemAffixes/ItemAffixGenerator';
import { ItemCategoriesEnum, ItemArmorTypesEnum, ItemJewelryTypesEnum } from 'src/_Enums/itemAffixEnums';
import { ItemAffix } from 'src/Models/ItemAffixes/ItemAffix';
import { BasicCharStats } from 'src/Models/BasicCharStats';
import { SkillVM } from 'src/Models/SkillVM';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { IItemAffix } from 'src/Models/ItemAffixes/IItemAffix';
import { InventoryVM } from 'src/Models/InventoryVM';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-item-generator',
  templateUrl: './item-generator.component.html',
  styleUrls: ['./item-generator.component.css']
})
export class ItemGeneratorComponent implements OnInit {
  @Output() EquipItemEmiter: EventEmitter<InventoryVM> = new EventEmitter(true);

  constructor() { this.selectedDescriptions = []; }

  @Input() categories: IDropdownImageItem[];
  @Input() items: IDropdownImageItem[];
  @Input() rarities: IDropdownImageItem[];
  @Input() skills: SkillVM[];
  selectedItem:IItemAffix[];
  selectedDescriptions:string[];

  categoriesStr:string[] = ["Random", "Armor", "Weapons", "Jewelry"];
  armors:string[] = ["Random", "Boots","Chest", "Gloves", "Helm", "Pants"];
  weapons:string[] = ["Random", "Axes", "Bows", "Hammers", "Swords", "Javelins", "Wands", "Staves"];
  jewelries:string[] = ["Random", "Amulets", "Rings"];
  raritiesStr:string[] = ["Random", "Magic", "Rare", "Legendary"];

  itemCategoriesCaption:string = "Item Categories";
  itemTypesCaption:string = "Item Types";
  rarityTypesCaption:string = "Rarity";
  selectedTypeStr:string;
  selectedItemClass:string;
  imgSrc:string;

  selectedCategory: IDropdownImageItem;
  selectedType: IDropdownImageItem;
  selectedRarity: IDropdownImageItem;
  selectedCategoryTemp: IDropdownImageItem;
  selectedTypeTemp: IDropdownImageItem;
  selectedRarityTemp: IDropdownImageItem;

  @Input() BasicData: BasicCharStats;
  generatedAffixes: ItemAffix[];

  private categoryIsRandom: boolean;
  private typeIsRandom: boolean;
  private rarityIsRandom: boolean;

  ngOnInit() {
    this.categories = this.GetCategoriesData(this.categoriesStr);
    this.rarities = this.GetRarityData(this.raritiesStr);
    this.SelectCategoryHandler(this.categories[0]);
    this.SelectRarityHandler(this.rarities[0]);
    this.SelectTypeHandler(this.items[0]);
    this.imgSrc = this.UpdateImgSrc();

    // Start as random
    this.categoryIsRandom = true;
    this.typeIsRandom = true;
    this.rarityIsRandom = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["BasicData"]) {
      var basicData = changes["BasicData"].currentValue;
      this.RecalculateItemAffixConditions(basicData);
    }
  }

  GetCategoriesData(elements:string[]):DropdownImageItem[] {
    var data = new Array<IDropdownImageItem>();
    elements.forEach((element, count) => {
      if (element != "Random") {
        var selection = count == 1 ? this.armors : count == 2 ? this.weapons : this.jewelries;
        var randType = Helpers.getRandom(1, selection.length - 1);
        var randImg = Helpers.getRandom(1, 3);
        var imgSrc = "_Resources\\img\\items\\" + element[0] + selection[randType][0] + selection[randType][1] + randImg + ".png";
        data.push(new DropdownImageItem(count, element, "", imgSrc, ""));
      }
      else {
        var imgSrc = "_Resources\\img\\items\\RaC.png";
        data.push(new DropdownImageItem(0, element, "", imgSrc, ""));
      }
    });
  
    return data;
  }

  GetItemsData(category: string, elements:string[]):DropdownImageItem[] {
    var data = new Array<IDropdownImageItem>();
    elements.forEach((element, count) => {
      if (element != "Random") {
        var randImg = Helpers.getRandom(1, 3);
        var imgSrc = "_Resources\\img\\items\\" + ((this.selectedCategory || this.selectedCategoryTemp || {name:""}).name || category)[0] + element[0] + element[1] + randImg + ".png";
        data.push(new DropdownImageItem(count, element, "", imgSrc, ""));
      }
      else {
        var catData = ((this.selectedCategory || this.selectedCategoryTemp || {name:""}).name || category);
        var rarData = (this.selectedRarity || this.selectedRarityTemp || {id:0}).id;
        var imgSrc = "_Resources\\img\\items\\" + catData[0] + "Ra" + rarData + ".png";
        // (this.selectedCategory || this.selectedCategoryTemp || {name:""}).name || category
        data.push(new DropdownImageItem(0, element, "", imgSrc, ""));
      }
    });
  
    return data;
  }

  GetRarityData(elements:string[]):DropdownImageItem[] {
    var data = new Array<IDropdownImageItem>();
    elements.forEach((element, count) => {
      if (element != "Random") {
        var selectedCategoryId = (this.selectedCategory || {id:0}).id == 0 ? this.categories[Helpers.getRandom(1, 3)].id : this.selectedCategory.id;
        var selectedCategoryStr = this.categories[selectedCategoryId].name;
        var selection = selectedCategoryId == 1 ? this.armors : count == 2 ? this.weapons : this.jewelries;
        var selectedTypeStr = (this.selectedType || {id:0}).id == 0 ? selection[Helpers.getRandom(1, selection.length-1)] : this.selectedType.name;

        var imgSrc = "_Resources\\img\\items\\" + selectedCategoryStr[0] + selectedTypeStr[0] + selectedTypeStr[1] + count + ".png";
        data.push(new DropdownImageItem(count, element, "", imgSrc, ""));
      }
      else {
        var imgSrc = "_Resources\\img\\items\\RaR.png";
        data.push(new DropdownImageItem(0, element, "", imgSrc, ""));
      }
    });
  
    return data;
  }

  async SelectCategoryHandler(item:IDropdownImageItem) {
    // Random selected
    var isRandom = (item || {id:0}).id == 0;

    if (this.categoryIsRandom && isRandom) {
      // Set the Dropdown
      this.selectedCategory = item;
    }
    else {
      this.categoryIsRandom = isRandom;
      var selectedCategory:IDropdownImageItem = null;
      if (isRandom)
        selectedCategory = this.categories[1 + Helpers.getRandom(0, 2)];
      else selectedCategory = item;
  
      var selection = selectedCategory.id == 1 ? this.armors : selectedCategory.id == 2 ? this.weapons : this.jewelries;
      if (isRandom)
        this.selectedCategoryTemp = selectedCategory;
      else this.selectedCategory = selectedCategory;
    }
  
    this.items = this.GetItemsData(selectedCategory.name, selection);
  }

  async SelectTypeHandler(item: IDropdownImageItem) {
    // Random selected
    var isRandom = (item || {id:0}).id == 0;
    if (this.typeIsRandom && isRandom) {
      this.selectedType = item;
    }
    else {
      this.typeIsRandom = isRandom;
      var categorySelectedData = this.categoryIsRandom ? this.selectedCategoryTemp : this.selectedCategory;
      var selection = (categorySelectedData || {id:0}).id == 1 ? this.armors : (categorySelectedData || {id:0}).id == 2 ? this.weapons : this.jewelries;
      var selectedTypes:IDropdownImageItem[] = this.GetItemsData(this.categoriesStr[(categorySelectedData || {id:0}).id], selection);
  
      if (isRandom) {
        this.selectedTypeTemp = selectedTypes[Helpers.getRandom(1, selection.length-1)];
        this.selectedType = this.items[0];
      }
      else this.selectedType = item;
    }
  }

  async SelectRarityHandler(item: IDropdownImageItem) {
    // Random selected
    var isRandom = (item || {id:0}).id == 0;
    if (this.rarityIsRandom && isRandom) {
      this.selectedRarity = item;
    }
    else {
    if (isRandom) {
        this.selectedRarityTemp = this.GetRarityData(this.raritiesStr)[Helpers.getRandom(1, 3)];
        this.selectedRarity = this.rarities[0];
      }
      else this.selectedRarity = item;
  
      this.rarityIsRandom = isRandom;
    }
  }

  async Generate() {
    var generator = new ItemAffixGenerator(this.skills);
    this.levelRequirement = null;
    this.SetItemLvl();
    // Function<,ItemAffix[]> selectedFn = () => {}
    var itemAffixes:ItemAffix[] = [];

    var selectedCategoryId = !this.categoryIsRandom ? this.selectedCategory.id : Helpers.getRandom(1, 3);//this.selectedCategoryTemp.id;
    var itemTypes = selectedCategoryId == 1 ? this.armors : selectedCategoryId == 2 ? this.weapons : this.jewelries;
    var selectedTypeId = !this.typeIsRandom ? this.selectedType.id : Helpers.getRandom(1, itemTypes.length-1);// this.selectedTypeTemp.id;
    var selectedRarityId = !this.rarityIsRandom ? this.selectedRarity.id : Helpers.getRandom(1, 3);// this.selectedRarityTemp.id;

    this.categories = this.GetCategoriesData(this.categoriesStr);
    this.rarities = this.GetRarityData(this.raritiesStr);
    this.items = this.GetItemsData(this.categoriesStr[selectedCategoryId], itemTypes)

    if (this.categoryIsRandom)
      this.selectedCategoryTemp = this.categories[selectedCategoryId];
    if (this.typeIsRandom)
      this.selectedTypeTemp = this.items[selectedTypeId];
    if (this.rarityIsRandom)
      this.selectedRarityTemp = this.rarities[selectedRarityId];
    // this.SelectCategoryHandler(this.categories.filter(c => c.id == selectedCategoryId)[0]);
    // this.SelectRarityHandler(this.rarities.filter(r => r.id == selectedRarityId)[0]);
    // this.SelectTypeHandler(this.items.filter(t => t.id == selectedTypeId)[0]);

    this.imgSrc = this.UpdateImgSrc();
    this.selectedItemClass = this.UpdateItemClass();
    this.selectedTypeStr = itemTypes[selectedTypeId] + " (" + this.raritiesStr[selectedRarityId] + ")";

    // For some reason there's delay with Random
    setTimeout(() => {
      if (selectedCategoryId == ItemCategoriesEnum.Armor)
        itemAffixes = generator.GenerateArmorAffixes(this.levelRequirement, selectedTypeId, selectedRarityId);
      else if (selectedCategoryId == ItemCategoriesEnum.Weapon)
        itemAffixes = generator.GenerateWeaponAffixes(this.levelRequirement, selectedTypeId, selectedRarityId);
      else itemAffixes = generator.GenerateJewelryAffixes(this.levelRequirement, selectedTypeId, selectedRarityId);

      this.generatedAffixes = itemAffixes;
      this.selectedItem = itemAffixes;
      this.selectedDescriptions = [];
      this.selectedItem.forEach(a => {
        // Sometimes double stats appear
        var descr = a.GetAffixDescription(this.skills);
        if (descr.includes("\n\n")) {
          descr.split("\n\n").forEach(d => {this.selectedDescriptions.push(d)});
        }
        else this.selectedDescriptions.push(descr);
      });
      this.RecalculateItemAffixConditions(this.BasicData);
    }, 75);
  }

  async EquipItem(data:IItemAffix[]) {
    var selectedCategoryId = (!this.categoryIsRandom ? this.selectedCategory : (this.selectedCategoryTemp || {id:0})).id;
    var selectedTypeId = (!this.typeIsRandom ? this.selectedType : (this.selectedTypeTemp || {id:0})).id;
    var selectedRarityId = (!this.rarityIsRandom ? this.selectedRarity : (this.selectedRarityTemp || {id:0})).id;
    var inventoryData = new InventoryVM(selectedCategoryId, selectedTypeId, selectedRarityId);

    if (selectedCategoryId == ItemCategoriesEnum.Armor) {
      // Armor
      inventoryData[Helpers.getPropertyByValue(ItemArmorTypesEnum, selectedTypeId)] = data;
      // this[this.armors[this.selectedType.id - 1] + "Description"] = inventoryData[this.armors[this.selectedType.id - 1]].GetAffixDescription();
    }
    else if (selectedCategoryId == ItemCategoriesEnum.Weapon) {
      // Weapon
      inventoryData.Weapon = data;
    }
    else {
      // Jewelry
      if (selectedTypeId == ItemJewelryTypesEnum.Amulet) { inventoryData.Amulet = data; }
      else inventoryData["Ring" + this.getLastRingEquipped()] = data;
    }

    //////// new CalculationsHelper().LogAffixData(inventoryData.Weapon, AffixCategoryEnum.PrimaryDamage, this.skills);
    this.EquipItemEmiter.emit(inventoryData);
  }

  protected GetDamageTypesInfo():string[] {
    return new CalculationsHelper().GetDamageTypesInfo();
  }

  protected GetArmorTypesInfo():string[] {
    return new CalculationsHelper().GetArmorTypesInfo(null);
  }
  
  protected UpdateImgSrc():string {
    var srcEmpty = "_Resources\\img\\borders\\border.png";
    var selectedCategory = !this.categoryIsRandom ? this.selectedCategory : this.selectedCategoryTemp;
    var selectedType = !this.typeIsRandom ? this.selectedType : this.selectedTypeTemp;
    var selectedRarity = !this.rarityIsRandom ? this.selectedRarity : this.selectedRarityTemp;
    var filtersSelected = selectedCategory.id && selectedType.id && selectedRarity.id;
    return filtersSelected ? "_Resources\\img\\items\\" + selectedCategory.name[0] + selectedType.name[0] + selectedType.name[1] + selectedRarity.id + ".png" : srcEmpty;
  }

  protected UpdateItemClass():string {
    var classToDisplay = "h3 customFont";
    // var selectedCategory = !this.categoryIsRandom ? this.selectedCategory : this.selectedCategoryTemp;
    // var selectedType = !this.typeIsRandom ? this.selectedType : this.selectedTypeTemp;
    var selectedRarity = !this.rarityIsRandom ? this.selectedRarity : this.selectedRarityTemp;

    var raritySelected = selectedRarity.id == 0 ? ""
    : selectedRarity.id == 1 ? "Blue"
    : selectedRarity.id == 2 ? "Red"
    : "Green";

    classToDisplay += raritySelected
    if (environment.production) {
      classToDisplay += "Prod";
    }

    return classToDisplay;
  }

  protected levelRequirement?: number;
  private SetItemLvl():number {
    if (!this.levelRequirement && this.BasicData.Level)
    {
      var variation = this.BasicData.Level < 10 ? 2 : this.BasicData.Level < 20 ? 3 : 4;
      var level = parseInt((this.BasicData.Level + Helpers.getRandom(-variation, variation)).toString(), 10);
      if (level < 0) level = 1;
      if (level > 40) level = 40;
      this.levelRequirement = (level || 0) != 0 ? level: 1;
    }

    return this.levelRequirement;
  }

  private RecalculateItemAffixConditions(basicData:BasicCharStats) {
    if (this.selectedItem)
      this.selectedItem.forEach(a => {
        if (a.Condition) {
          var selectedPower = a.Condition.ConditionPowerType == 1 ? basicData.AngelicPower
          : a.Condition.ConditionPowerType == 2 ? basicData.DemonicPower : basicData.AncestralPower
        a.ConditionSatisfied = selectedPower >= a.Condition.Condition;            
      }
    })
  }

  private lre:boolean;
  private getLastRingEquipped():number {
    var result = !(this.lre) ? 1 : 2;
    this.lre = !(this.lre);

    return result;
  };
}
