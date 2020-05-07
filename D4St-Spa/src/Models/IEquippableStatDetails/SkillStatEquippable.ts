import { IEquippableStat } from 'src/Models/InventoryModels/InventoryDetailModels/IEquippableStat';
import { IItemAffix } from '../ItemAffixes/IItemAffix';

export class SkillStatEquippable implements IEquippableStat {
    SelectedStat: string;
    SelectedEquipStat: string;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    constructor(selectedStat:string, selectedEquipStat:string) {
        this.SelectedStat = selectedStat;
        this.SelectedEquipStat = this.SelectedEquipStat;
    }
}
