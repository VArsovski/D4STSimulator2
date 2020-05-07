import { IItemAffix } from '../../ItemAffixes/IItemAffix';

export interface IEquippableStat {
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;
}
