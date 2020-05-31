import { InventoryDamageModel } from './InventoryDamageModel';
import { IDoubleStatAffix } from './InventoryDetailModels/IDoubleStatAffixData';
import { SimpleDoubleAffixData } from './InventoryDetailModels/SimpleDoubleAffixData';

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
    PhysicalOrCC:IDoubleStatAffix;
    CleaveOrAoE:IDoubleStatAffix;
    ChainOrProjectile:IDoubleStatAffix;
    TrapOrSummon:IDoubleStatAffix;
    TickOrCurse:IDoubleStatAffix;

    constructor() {
        this.PhysicalOrCC = new SimpleDoubleAffixData();
        this.TickOrCurse = new SimpleDoubleAffixData();
        this.CleaveOrAoE = new SimpleDoubleAffixData();
        this.TrapOrSummon = new SimpleDoubleAffixData();
        this.ChainOrProjectile = new SimpleDoubleAffixData();
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
