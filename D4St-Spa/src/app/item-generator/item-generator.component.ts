import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IDropdownImageItem } from 'src/Models/_Common/IDropdownImageItem';
import { DropdownImageItem } from 'src/Models/_Common/DropdownImageItem';
import { Helpers } from 'src/_Helpers/helpers';
import { ItemAffixGenerator } from 'src/Models/ItemAffixes/ItemAffixGenerator';
import { ItemCategoriesEnum, ItemArmorTypesEnum, ItemJewelryTypesEnum, ItemWeaponTypesEnum } from 'src/_Enums/itemAffixEnums';
import { ItemAffix } from 'src/Models/ItemAffixes/ItemAffix';
import { BasicCharStats } from 'src/Models/BasicCharStats';
import { SkillVM } from 'src/Models/SkillVM';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { IItemAffix } from 'src/Models/ItemAffixes/IItemAffix';
import { InventoryVM } from 'src/Models/InventoryVM';

@Component({
  selector: 'app-item-generator',
  templateUrl: './item-generator.component.html',
  styleUrls: ['./item-generator.component.css']
})
export class ItemGeneratorComponent implements OnInit {
  @Output() EquipItemEmiter: EventEmitter<InventoryVM> = new EventEmitter(true);

  constructor() { this.generateRandom = true; this.selectedDescriptions = []; }

  @Input() categories: IDropdownImageItem[];
  @Input() items: IDropdownImageItem[];
  @Input() rarities: IDropdownImageItem[];
  @Input() skills: SkillVM[];
  generateRandom:boolean;
  selectedItem:IItemAffix[];
  selectedDescriptions:string[];
  // @Output() SelectCategory = new EventEmitter<IDropdownImageItem>(true);
  // @Output() SelectType = new EventEmitter<IDropdownImageItem>(true);

  categoriesStr:string[] = ["Armor", "Weapons", "Jewelry"];
  armors:string[] = ["Boots","Chest", "Gloves", "Helm", "Pants"];
  weapons:string[] = ["Axes", "Bows", "Hammers", "Javelins", "Staves", "Swords", "Wands"];
  jewelries:string[] = ["Amulets", "Rings"];
  raritiesStr:string[] = ["Magic", "Rare", "Legendary"];

  itemCategoriesCaption:string = "Item Categories";
  itemTypesCaption:string = "Item Types";
  rarityTypesCaption:string = "Rarity";

  selectedCategory: IDropdownImageItem;
  selectedType: IDropdownImageItem;
  selectedRarity: IDropdownImageItem;
  @Input() BasicData: BasicCharStats;
  generatedAffixes: ItemAffix[];

  ngOnInit() {
    this.categories = this.GetCategoriesData(this.categoriesStr);
  }

  GetCategoriesData(elements:string[]):DropdownImageItem[] {
    var data = new Array<IDropdownImageItem>();
    var count = 1;
    elements.forEach(element => {
      var selection = count == 1 ? this.armors : count == 2 ? this.weapons : this.jewelries;
      var randType = Helpers.getRandom(1, selection.length);
      var randImg = Helpers.getRandom(1, 2);
      var imgSrc = "_Resources\\img\\items\\" + element[0] + selection[randType-1][0] + selection[randType-1][1] + randImg + ".png";
      data.push(new DropdownImageItem(count, element, "", imgSrc, ""));
      count++;
    });
  
    return data;
  }

  GetItemsData(category: string, elements:string[]):DropdownImageItem[] {
    var data = new Array<IDropdownImageItem>();
    var count = 1;
    elements.forEach(element => {
      // var randType = Helpers.getRandom(1, elements.length);
      var randImg = Helpers.getRandom(1, 2);
      var imgSrc = "_Resources\\img\\items\\" + category[0] + element[0] + element[1] + randImg + ".png";
      data.push(new DropdownImageItem(count, element, "", imgSrc, ""));
      count++;
    });
  
    return data;
  }

  GetRarityData(category: string, type:string, elements:string[]):DropdownImageItem[] {
    var data = new Array<IDropdownImageItem>();
    var count = 1;
    elements.forEach(element => {
      var imgSrc = "_Resources\\img\\items\\" + category[0] + type[0] + type[1] + count + ".png";
      data.push(new DropdownImageItem(count, element, "", imgSrc, ""));
      count++;
    });
  
    return data;
  }

  async SelectCategoryHandler(item:IDropdownImageItem){
    this.selectedCategory = item;
    var selection = item.id == 1 ? this.armors : item.id == 2 ? this.weapons : this.jewelries;
    this.items = this.GetItemsData(item.name, selection);
    // this.SelectCategory.emit(item);
  }

  async SelectTypeHandler(item: IDropdownImageItem) {
    this.selectedType = item;
    if (!item) {
      setTimeout(() => {
        this.selectedType = item;
        this.rarities = this.GetRarityData(this.selectedCategory.name, item.name, this.raritiesStr);
      }, 75);
    } else this.rarities = this.GetRarityData(this.selectedCategory.name, item.name, this.raritiesStr);
  }

  async SelectRarityHandler(item: IDropdownImageItem){
    this.selectedRarity = item;
  }

  async Generate() {
    var generator = new ItemAffixGenerator(this.skills);
    this.levelRequirement = null;
    this.SetItemLvl();
    // Function<,ItemAffix[]> selectedFn = () => {}
    var itemAffixes:ItemAffix[] = [];

    if (this.generateRandom) {
      var categoryId = Helpers.getRandom(1,3);
      var itemTypes = categoryId == 0 ? this.armors : categoryId == 1 ? this.weapons : this.jewelries;
      var selectedTypeId = Helpers.getRandom(1, itemTypes.length);
      var selectedRarityId = Helpers.getRandom(1,3);

      this.SelectCategoryHandler(this.categories.filter(c => c.id == categoryId)[0]);
      this.SelectTypeHandler(this.items.filter(t => t.id == selectedTypeId)[0]);
      this.SelectRarityHandler(this.rarities.filter(r => r.id == selectedRarityId)[0]);
    }

    // For some reason there's delay with Random
    setTimeout(() => {
      if (this.selectedCategory.id == ItemCategoriesEnum.Armor)
        itemAffixes = generator.GenerateArmorAffixes(this.levelRequirement, this.selectedType.id, this.selectedRarity.id);
      else if (this.selectedCategory.id == ItemCategoriesEnum.Weapon)
        itemAffixes = generator.GenerateWeaponAffixes(this.levelRequirement, this.selectedType.id, this.selectedRarity.id);
      else
        itemAffixes = generator.GenerateJewelryAffixes(this.levelRequirement, this.selectedType.id, this.selectedRarity.id);
      this.generatedAffixes = itemAffixes;

      this.selectedItem = itemAffixes;
      var skills = this.skills;
      this.selectedDescriptions = [];
      this.selectedItem.forEach(a => { this.selectedDescriptions.push(a.GetAffixDescription(skills));});

    }, this.generateRandom ? 75 : 0);
  }

  async EquipItem(data:IItemAffix[]) {
    var inventoryData = new InventoryVM(this.selectedCategory.id, this.selectedType.id, this.selectedRarity.id);
    if (this.selectedCategory.id == 1) {
      // Armor
      data.forEach(a => { if (this.selectedType.id == ItemArmorTypesEnum.Boots) { inventoryData.Boots.push(a); }})
      data.forEach(a => { if (this.selectedType.id == ItemArmorTypesEnum.Chest) { inventoryData.Chest.push(a); }})
      data.forEach(a => { if (this.selectedType.id == ItemArmorTypesEnum.Gloves) { inventoryData.Gloves.push(a); }})
      data.forEach(a => { if (this.selectedType.id == ItemArmorTypesEnum.Helm) { inventoryData.Helm.push(a); }})
      data.forEach(a => { if (this.selectedType.id == ItemArmorTypesEnum.Pants) { inventoryData.Pants.push(a); }})
    }
    else if (this.selectedCategory.id == 2) {
      // Weapon
      data.forEach(a => { inventoryData.Weapon.push(a); })
    }
    else {
      // Jewelry
      if (this.selectedType.id == ItemJewelryTypesEnum.Amulet) { inventoryData.Amulet = data; }
      else inventoryData.Ring1 = data;
    }

    this.EquipItemEmiter.emit(inventoryData);
  }

  protected GetDamageTypesInfo():string[] {
    return new CalculationsHelper().GetDamageTypesInfo();
  }

  protected GetArmorTypesInfo():string[] {
    return new CalculationsHelper().GetArmorTypesInfo();
  }
  
  protected GetImgSrc():string {
    var srcEmpty = "_Resources\\img\\borders\\border.png";
    var filtersSelected = this.selectedCategory && this.selectedType && this.selectedRarity;
    return filtersSelected ? "_Resources\\img\\items\\" + this.selectedCategory.name[0] + this.selectedType.name[0] + this.selectedType.name[1] + this.selectedRarity.id + ".png" : srcEmpty;
  }

  protected levelRequirement?: number;
  private SetItemLvl():number {
    if (!this.levelRequirement && this.BasicData.Level)
    {
      var variation = this.BasicData.Level < 10 ? 2 : this.BasicData.Level < 20 ? 3 : 4;
      var level = parseInt((this.BasicData.Level + Helpers.getRandom(-variation, variation)).toString(), 10);
      if (level < 0) level = 1;
      if (level > 40) level = 40;// this.BasicData.MaxLevel)
      this.levelRequirement = (level || 0) != 0 ? level: 1;
    }

    return this.levelRequirement;
  }
}
