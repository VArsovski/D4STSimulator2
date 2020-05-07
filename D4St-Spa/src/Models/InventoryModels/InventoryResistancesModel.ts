import { InventoryResistanceModel } from './InventoryDamageModel';

export class InventoryResistancesModel {
    PhysicalResistance: InventoryResistanceModel;
    FireResistance: InventoryResistanceModel;
    PoisonResistance: InventoryResistanceModel;
    ColdResistance: InventoryResistanceModel;
    LightningResistance: InventoryResistanceModel;

    constructor() {
        this.PhysicalResistance = new InventoryResistanceModel();
        this.FireResistance = new InventoryResistanceModel();
        this.PoisonResistance = new InventoryResistanceModel();
        this.ColdResistance = new InventoryResistanceModel();
        this.LightningResistance = new InventoryResistanceModel();
    }
}
