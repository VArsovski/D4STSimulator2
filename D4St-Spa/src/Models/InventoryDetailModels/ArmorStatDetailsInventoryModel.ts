import { IArmorStatDetailsInventoryModel, IArmorStatDetailsInventoryModelCombined } from './IArmorStatDetailsInventoryModel';
import { IEquippableInventoryModel } from './IEquippableStat';

export class ArmorStatDetailsInventoryModel implements IArmorStatDetailsInventoryModel, IEquippableInventoryModel {
    StunReduction: number;
    KnockdownReduction: number;
    KnockbackReduction: number;
    LevitateReduction: number;
    WitherReduction: number;
    ConflagrateReduction: number;
    BlindReduction: number;
    CurseReduction: number;
    FreezeReduction: number;
    RootReduction: number;
    ReduceArmorReduction: number;
    BleedReduction: number;
    SelectedStat: string;
    SelectedEquipStat: string;

    constructor() {
        this.StunReduction = 0;
        this.KnockbackReduction = 0;
        this.KnockdownReduction = 0;
        this.LevitateReduction = 0;
        this.WitherReduction = 0;
        this.ConflagrateReduction = 0;
        this.BlindReduction = 0;
        this.CurseReduction = 0;
        this.FreezeReduction = 0;
        this.RootReduction = 0;
        this.ReduceArmorReduction = 0;
        this.BleedReduction = 0;
    }
}

export class ArmorStatDetailsInventoryModelCombined implements IArmorStatDetailsInventoryModelCombined {
    StunOrKnockdownReduction: number;
    KnockbackOrLevitateReduction: number;
    WitherOrConflagrateReduction: number;
    BlindOrCurseReduction: number;
    FreezeOrRootReduction: number;
    ReduceArmorOrBleedReduction: number;

    constructor() {
        this.StunOrKnockdownReduction = 0;
        this.KnockbackOrLevitateReduction = 0;
        this.WitherOrConflagrateReduction = 0;
        this.BlindOrCurseReduction = 0;
        this.FreezeOrRootReduction = 0;
        this.ReduceArmorOrBleedReduction = 0;
    }
}
