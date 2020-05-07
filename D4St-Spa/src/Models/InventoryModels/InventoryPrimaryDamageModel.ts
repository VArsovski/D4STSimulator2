import { InventoryDamageModel } from './InventoryDamageModel';

export class InventoryDamageModelCombined {
    PhysicalDamage: InventoryPrimaryDamageModel;
    FireDamage: InventoryPrimaryDamageModel;
    PoisonDamage: InventoryPrimaryDamageModel;
    ColdDamage: InventoryPrimaryDamageModel;
    LightningDamage: InventoryPrimaryDamageModel;

    constructor() {
        this.PhysicalDamage = new InventoryPrimaryDamageModel();
        this.FireDamage = new InventoryPrimaryDamageModel();
        this.PoisonDamage = new InventoryPrimaryDamageModel();
        this.ColdDamage = new InventoryPrimaryDamageModel();
        this.LightningDamage = new InventoryPrimaryDamageModel();
    }
}

export class InventoryDamageEmpowerModelCombined {
    PhysicalOrCC:InventoryDamageModel;
    CleaveOrAoE:InventoryDamageModel;
    ChainOrProjectile:InventoryDamageModel;
    TrapOrSummon:InventoryDamageModel;
    TickOrCurse:InventoryDamageModel;

    constructor() {
        this.PhysicalOrCC = new InventoryDamageModel();
        this.TickOrCurse = new InventoryDamageModel();
        this.CleaveOrAoE = new InventoryDamageModel();
        this.TrapOrSummon = new InventoryDamageModel();
        this.ChainOrProjectile = new InventoryDamageModel();
    }
}

export class InventoryPrimaryDamageModel {
    MinDamage:number;
    MaxDamage:number;
    AvgDamage:number;

    constructor() {
        this.MinDamage = 0;
        this.MaxDamage = 0;
        this.AvgDamage = 0;
    }
}
