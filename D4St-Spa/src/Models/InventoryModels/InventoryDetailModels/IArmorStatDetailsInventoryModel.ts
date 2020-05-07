export interface IArmorStatDetailsInventoryModel {
    StunReduction:number;
    KnockdownReduction:number;
    KnockbackReduction:number;
    LevitateReduction:number;
    WitherReduction:number;
    ConflagrateReduction:number;
    BlindReduction:number;
    CurseReduction:number;
    FreezeReduction:number;
    RootReduction:number;
    ReduceArmorReduction:number;
    BleedReduction:number;
}

export interface IArmorStatDetailsInventoryModelCombined  {
    StunOrKnockdownReduction:number;
    KnockbackOrLevitateReduction:number;
    WitherOrConflagrateReduction:number;
    BlindOrCurseReduction:number;
    FreezeOrRootReduction:number;
    ReduceArmorOrBleedReduction:number;
}
