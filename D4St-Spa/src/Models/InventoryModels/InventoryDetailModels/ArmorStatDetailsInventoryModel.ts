import { ICCEffectStatDetailsInventoryModel, ICCffectStatDetailsInventoryModelCombined, ICCEffectAffixData } from './ICCEffectDetailsInventoryModel';
import { SimpleCCEffectAffixData } from './SimpleCCEffectAffixData';

export class ArmorStatDetailsInventoryModel implements ICCEffectStatDetailsInventoryModel {
    Stun: ICCEffectAffixData;
    Knockdown: ICCEffectAffixData;
    Knockback: ICCEffectAffixData;
    Levitate: ICCEffectAffixData;
    Wither: ICCEffectAffixData;
    Conflagrate: ICCEffectAffixData;
    Blind: ICCEffectAffixData;
    Curse: ICCEffectAffixData;
    Freeze: ICCEffectAffixData;
    Root: ICCEffectAffixData;
    ReduceArmor: ICCEffectAffixData;
    Bleed: ICCEffectAffixData;
    SelectedStat: string;
    SelectedEquipStat: string;

    constructor() {
        this.Stun= new SimpleCCEffectAffixData();
        this.Knockback= new SimpleCCEffectAffixData();
        this.Knockdown= new SimpleCCEffectAffixData();
        this.Levitate= new SimpleCCEffectAffixData();
        this.Wither= new SimpleCCEffectAffixData();
        this.Conflagrate= new SimpleCCEffectAffixData();
        this.Blind= new SimpleCCEffectAffixData();
        this.Curse= new SimpleCCEffectAffixData();
        this.Freeze= new SimpleCCEffectAffixData();
        this.Root= new SimpleCCEffectAffixData();
        this.ReduceArmor= new SimpleCCEffectAffixData();
        this.Bleed= new SimpleCCEffectAffixData();
    }
}

export class ArmorStatDetailsInventoryModelCombined implements ICCffectStatDetailsInventoryModelCombined {
    StunOrKnockdown: SimpleCCEffectAffixData;
    KnockbackOrLevitate: SimpleCCEffectAffixData;
    WitherOrConflagrate: SimpleCCEffectAffixData;
    BlindOrCurse: SimpleCCEffectAffixData;
    FreezeOrRoot: SimpleCCEffectAffixData;
    ReduceArmorOrBleed: SimpleCCEffectAffixData;

    constructor() {
        this.StunOrKnockdown = new SimpleCCEffectAffixData();
        this.KnockbackOrLevitate = new SimpleCCEffectAffixData();
        this.WitherOrConflagrate = new SimpleCCEffectAffixData();
        this.BlindOrCurse = new SimpleCCEffectAffixData();
        this.FreezeOrRoot = new SimpleCCEffectAffixData();
        this.ReduceArmorOrBleed = new SimpleCCEffectAffixData();
    }
}