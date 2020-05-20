import { SimpleAffixStats } from '../ItemAffixes/Details/IItemAffixStats';

export class InventoryConditionalModelCombined {
    HitEffectPhysical: SimpleAffixStats;

    constructor() {
        this.HitEffectPhysical = new SimpleAffixStats();
    }
}
