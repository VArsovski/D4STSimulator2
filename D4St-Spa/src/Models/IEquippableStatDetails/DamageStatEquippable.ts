import { IItemAffix } from '../ItemAffixes/IItemAffix';
import { InventoryDamageModel } from '../InventoryModels/InventoryDamageModel';
import { InventoryPrimaryDamageModel } from '../InventoryModels/InventoryPrimaryDamageModel';
import { IEquippableAffixStat } from './IEquippableAffixStat';
import { IItemAffixStats } from '../ItemAffixes/Details/IItemAffixStats';

export class DamageStatPrimaryEquippable implements IEquippableAffixStat {
    SelectedStat: string;
    SelectedEquipStat: string;
    EquippableStatData: IItemAffixStats;
    getZeroStats: () => any;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    // PhysicalOrCC = 1,    // CleaveOrAoE = 2,   // ChainOrProjectile = 3,   // TrapOrSummon = 4,   // TickOrCurse = 5
    private calculateAmount(src:IItemAffix, affix:IItemAffix):IItemAffix {
        var combinedStat = src;
        var selectedEquipStat = affix.Contents.AffixData.EquippableStatData.OutputMeta.SelectedEquipStat;
        combinedStat[selectedEquipStat]["Percentage"] += affix.Contents.AffixData["Percentage"] || affix.Contents.AffixData["EmpowerPercentage"];
        return combinedStat;
    }

    constructor(selectedStat:string, selectedEquipStat:string) {
        this.SelectedStat = selectedStat;
        this.SelectedEquipStat = selectedEquipStat;
        this.updateEquippedStats = this.calculateAmount;
        this.getZeroStats = () => { return new InventoryDamageModel(); }
    }
}

export class DamageStatMinMaxEquippable implements IEquippableAffixStat {
    SelectedStat: string;
    SelectedEquipStat: string;
    EquippableStatData: IItemAffixStats;
    getZeroStats: () => any;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    private calculateAmount(src:IItemAffix, affix:IItemAffix): IItemAffix {
        var combinedStat = src;
        var selectedEquipStat = affix.Contents.AffixData.EquippableStatData.OutputMeta.SelectedEquipStat;
        combinedStat[selectedEquipStat]["MinDamage"] += affix.Contents.AffixData["MinDamage"];
        combinedStat[selectedEquipStat]["MaxDamage"] += affix.Contents.AffixData["MaxDamage"];
        return combinedStat;
    }

    constructor(selectedStat:string, selectedEquipStat:string) {
        this.SelectedStat = selectedStat;
        this.SelectedEquipStat = selectedEquipStat;
        this.updateEquippedStats = this.calculateAmount;
        this.getZeroStats = () => { return new InventoryPrimaryDamageModel(); }
    }
}
