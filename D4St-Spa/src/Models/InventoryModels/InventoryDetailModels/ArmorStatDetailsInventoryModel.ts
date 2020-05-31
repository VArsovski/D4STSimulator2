import { ICCEffectStatDetailsInventoryModel, ICCffectStatDetailsInventoryModelCombined } from './ICCEffectDetailsInventoryModel';
import { SimpleDoubleAffixData } from './SimpleDoubleAffixData';
import { IDoubleStatAffix } from './IDoubleStatAffixData';

export class ArmorStatDetailsInventoryModel implements ICCEffectStatDetailsInventoryModel {
    Stun: IDoubleStatAffix;
    Knockdown: IDoubleStatAffix;
    Knockback: IDoubleStatAffix;
    Levitate: IDoubleStatAffix;
    Wither: IDoubleStatAffix;
    Conflagrate: IDoubleStatAffix;
    Blind: IDoubleStatAffix;
    Curse: IDoubleStatAffix;
    Freeze: IDoubleStatAffix;
    Root: IDoubleStatAffix;
    ReduceArmor: IDoubleStatAffix;
    Bleed: IDoubleStatAffix;
    SelectedStat: string;
    SelectedEquipStat: string;

    constructor() {
        this.Stun= new SimpleDoubleAffixData();
        this.Knockback= new SimpleDoubleAffixData();
        this.Knockdown= new SimpleDoubleAffixData();
        this.Levitate= new SimpleDoubleAffixData();
        this.Wither= new SimpleDoubleAffixData();
        this.Conflagrate= new SimpleDoubleAffixData();
        this.Blind= new SimpleDoubleAffixData();
        this.Curse= new SimpleDoubleAffixData();
        this.Freeze= new SimpleDoubleAffixData();
        this.Root= new SimpleDoubleAffixData();
        this.ReduceArmor= new SimpleDoubleAffixData();
        this.Bleed= new SimpleDoubleAffixData();
    }
}

export class ArmorStatDetailsInventoryModelCombined implements ICCffectStatDetailsInventoryModelCombined {
    StunOrKnockdown: SimpleDoubleAffixData;
    KnockbackOrBleed: SimpleDoubleAffixData;
    WitherOrConflagrate: SimpleDoubleAffixData;
    FreezeOrCurse: SimpleDoubleAffixData;
    BlindOrRoot: SimpleDoubleAffixData;
    ReduceArmorOrLevitate: SimpleDoubleAffixData;

    constructor() {
        this.StunOrKnockdown = new SimpleDoubleAffixData();
        this.KnockbackOrBleed = new SimpleDoubleAffixData();
        this.WitherOrConflagrate = new SimpleDoubleAffixData();
        this.FreezeOrCurse = new SimpleDoubleAffixData();
        this.BlindOrRoot = new SimpleDoubleAffixData();
        this.ReduceArmorOrLevitate = new SimpleDoubleAffixData();
    }
}
