import { IItemAffix } from '../ItemAffixes/IItemAffix';

export class InventoryVM {
    selectedCategory:number;
    selectedType:number;
    selectedRarity:number;
    Helm:IItemAffix[];
    Chest:IItemAffix[];
    Pants:IItemAffix[];
    Boots:IItemAffix[];
    Gloves:IItemAffix[];
    Weapon:IItemAffix[];
    Amulet:IItemAffix[];
    Ring1:IItemAffix[];
    Ring2:IItemAffix[];

    constructor(selectedCategory:number, selectedType:number, selectedRarity:number) {
        this.Helm = [];
        this.Chest = [];
        this.Pants = [];
        this.Boots = [];
        this.Gloves = [];
        this.Weapon = [];
        this.Amulet = [];
        this.Ring1 = [];
        this.Ring2 = [];
        this.selectedCategory = selectedCategory;
        this.selectedType = selectedType;
        this.selectedRarity = selectedRarity;
    }
}
