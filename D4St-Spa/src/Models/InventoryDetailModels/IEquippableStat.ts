import { IItemAffix } from '../ItemAffixes/IItemAffix';

export interface IEquippableInventoryModel {
    SelectedStat:string;
    SelectedEquipStat:string;
    // Just an empty interface to make sure the appropriate inventory stat models implement the method from IEquippableStat below
}

export interface IEquippableStat {
    SelectedStat:string;
    SelectedEquipStat:string;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;
}
