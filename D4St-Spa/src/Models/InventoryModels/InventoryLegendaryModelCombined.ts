import { SimpleAffixStats } from '../ItemAffixes/Details/IItemAffixStats';

export class InventoryLegendaryModelCombined {
    protected AlternateCleaveOrAoEEffect:SimpleAffixStats;
    protected AlternatePoisonOrBurnEffect:SimpleAffixStats;
    protected AlternateArmorReductionAndBleed:SimpleAffixStats;
    protected AlternateFreezeStunAttack:SimpleAffixStats;
    protected AlternateRandomSpellAttack:SimpleAffixStats;
    protected AlternateChainOrPierceAttack:SimpleAffixStats;
    protected AlternateBasicStats:SimpleAffixStats;
    protected AlternateCCEffectDuration:SimpleAffixStats;
    protected AlternateCCEffectDamageTaken:SimpleAffixStats;
    protected AlternateDamageTypeTaken:SimpleAffixStats;
    protected AlternateAttackTypeTaken:SimpleAffixStats;
    protected AlternateLifestealOrShielding:SimpleAffixStats;

    constructor() {
        this.AlternateCleaveOrAoEEffect = new SimpleAffixStats();
        this.AlternatePoisonOrBurnEffect = new SimpleAffixStats();
        this.AlternateArmorReductionAndBleed = new SimpleAffixStats();
        this.AlternateFreezeStunAttack = new SimpleAffixStats();
        this.AlternateRandomSpellAttack = new SimpleAffixStats();
        this.AlternateChainOrPierceAttack = new SimpleAffixStats();
        this.AlternateBasicStats = new SimpleAffixStats();
        this.AlternateCCEffectDuration = new SimpleAffixStats();
        this.AlternateCCEffectDamageTaken = new SimpleAffixStats();
        this.AlternateDamageTypeTaken = new SimpleAffixStats();
        this.AlternateAttackTypeTaken = new SimpleAffixStats();
        this.AlternateLifestealOrShielding = new SimpleAffixStats();
    }
}
