import { SimpleAffixStats } from '../ItemAffixes/Details/IItemAffixStats'

export class InventorySecondaryBasicModelCombined {
    Resistance: SimpleAffixStats;
    RedirectDamage: SimpleAffixStats;
    IncreaseStatSunder: SimpleAffixStats;
    EmpowerTrapsAndSummons: SimpleAffixStats;
    DamageTakenReduced: SimpleAffixStats;
    CCReduction: SimpleAffixStats;

    constructor() {
        this.Resistance = new SimpleAffixStats();
        this.RedirectDamage = new SimpleAffixStats();
        this.IncreaseStatSunder = new SimpleAffixStats();
        this.EmpowerTrapsAndSummons = new SimpleAffixStats();
        this.DamageTakenReduced = new SimpleAffixStats();
        this.CCReduction = new SimpleAffixStats();
    }
}
