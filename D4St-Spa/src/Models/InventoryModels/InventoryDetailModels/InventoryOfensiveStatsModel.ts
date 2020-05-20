import { InventoryDamageModel } from '../InventoryDamageModel';

export class InventoryOfensiveStatsModel {
    CleaveAndAoE:InventoryDamageModel;
    PoisonAndBurn:InventoryDamageModel;
    ArmorReductionAndBleed:InventoryDamageModel;
    KnockbackAndStun:InventoryDamageModel;
    FreezeAndRoot:InventoryDamageModel;
    ChainAndPierce:InventoryDamageModel;
    CastAndProjectileRange:InventoryDamageModel;

    constructor() {
        this.CleaveAndAoE = new InventoryDamageModel();
        this.PoisonAndBurn = new InventoryDamageModel();
        this.ArmorReductionAndBleed = new InventoryDamageModel();
        this.KnockbackAndStun = new InventoryDamageModel();
        this.FreezeAndRoot = new InventoryDamageModel();
        this.ChainAndPierce = new InventoryDamageModel();
        this.CastAndProjectileRange = new InventoryDamageModel();
    }
}
