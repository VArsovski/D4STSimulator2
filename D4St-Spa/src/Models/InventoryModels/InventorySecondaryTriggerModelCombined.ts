import { SimpleAffixStats } from 'src/Models/ItemAffixes/Details/IItemAffixStats'

export class InventorySecondaryTriggerModelCombined {
    protected AllowSkillForUsage:SimpleAffixStats;
    protected AllowTrapsCast:SimpleAffixStats;
    protected AllowCurseCast:SimpleAffixStats;
    protected EmpowerBasicStat:SimpleAffixStats;
    protected EmpowerOfenseStat:SimpleAffixStats;
    protected EmpowerDefenseStat:SimpleAffixStats;
    protected AddElementalDamage:SimpleAffixStats;

    constructor() {
        this.AllowSkillForUsage = new SimpleAffixStats();
        this.AllowTrapsCast = new SimpleAffixStats();
        this.AllowCurseCast = new SimpleAffixStats();
        this.EmpowerBasicStat = new SimpleAffixStats();
        this.EmpowerOfenseStat = new SimpleAffixStats();
        this.EmpowerDefenseStat = new SimpleAffixStats();
        this.AddElementalDamage = new SimpleAffixStats();
    }
}
