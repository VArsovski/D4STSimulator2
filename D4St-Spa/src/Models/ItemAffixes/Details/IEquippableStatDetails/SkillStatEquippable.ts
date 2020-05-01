import { IEquippableStat } from 'src/Models/InventoryDetailModels/IEquippableStat';
import { IItemAffix } from '../../IItemAffix';

export class SkillStatEquippable implements IEquippableStat {
    SelectedStat: string;
    SelectedEquipStat: string;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    constructor(selectedStat:string, selectedEquipStat:string) {
        this.SelectedStat = selectedStat;
        this.SelectedEquipStat = this.SelectedEquipStat;
    }
}
