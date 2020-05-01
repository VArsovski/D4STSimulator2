import { IEquippableStat } from 'src/Models/InventoryDetailModels/IEquippableStat';
import { IItemAffix } from '../../IItemAffix';

export class DamageStatPrimaryEquippable implements IEquippableStat {
    SelectedStat: string;
    SelectedEquipStat: string;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    // PhysicalOrCC = 1,    // CleaveOrAoE = 2,   // ChainOrProjectile = 3,   // TrapOrSummon = 4,   // TickOrCurse = 5
    private calculateAmount(src:IItemAffix, affix:IItemAffix):IItemAffix {
        var selectedEquipStat = src; //InventoryDamageModel
        src["Percentage"] += affix.Contents.AffixData.EmpowerPercentage;
        return selectedEquipStat;
    }

    constructor(selectedStat:string, selectedEquipStat:string) {
        this.SelectedStat = selectedStat;
        this.SelectedEquipStat = selectedEquipStat;
        this.updateEquippedStats = this.calculateAmount;
    }
}

export class DamageStatMinMaxEquippable implements IEquippableStat {
    SelectedStat: string;
    SelectedEquipStat: string;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    // PhysicalOrCC = 1,    // CleaveOrAoE = 2,   // ChainOrProjectile = 3,   // TrapOrSummon = 4,   // TickOrCurse = 5
    private calculateAmount(src:IItemAffix, affix:IItemAffix): IItemAffix {
        var selectedEquipStat = src;
        selectedEquipStat["MinDamage"] += affix.Contents.AffixData["MinDamage"];
        selectedEquipStat["MaxDamage"] += affix.Contents.AffixData["MaxDamage"];
        return selectedEquipStat;
    }

    constructor(selectedStat:string, selectedEquipStat:string) {
        this.SelectedStat = selectedStat;
        this.SelectedEquipStat = selectedEquipStat;
        this.updateEquippedStats = this.calculateAmount;
    }
}
