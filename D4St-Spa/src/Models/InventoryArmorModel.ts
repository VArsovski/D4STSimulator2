export class InventoryArmorModel {
    Amount:number;
    // ItemPieces: number;
    // CCPercentage:number;

    constructor() {
        this.Amount = 0;
        // this.ItemPieces = 0;
        // this.CCPercentage = 0;
    }
}

export class InventoryArmorModelCombined {
    HeavyArmor:InventoryArmorModel;
    LightArmor:InventoryArmorModel;
    MysticArmor:InventoryArmorModel;
    Armor:InventoryArmorModel;

    constructor() {
        this.Armor = new InventoryArmorModel();
        this.HeavyArmor = new InventoryArmorModel();
        this.LightArmor = new InventoryArmorModel();
        this.MysticArmor = new InventoryArmorModel();
    }
}
