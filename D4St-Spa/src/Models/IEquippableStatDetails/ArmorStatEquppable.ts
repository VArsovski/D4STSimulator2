import { CCEffectTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { IItemAffix } from '../ItemAffixes/IItemAffix';
import { InventoryArmorModelCombined, InventoryArmorModel } from 'src/Models/InventoryModels/InventoryArmorModel';
import { ItemAffixTypeEnum, ArmorTypesEnum } from 'src/_Enums/itemAffixEnums';
import { ItemAffix } from '../ItemAffixes/ItemAffix';
import { ArmorStatDetailsInventoryModelCombined } from 'src/Models/InventoryModels/InventoryDetailModels/ArmorStatDetailsInventoryModel';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { IEquippableAffixStat } from './IEquippableAffixStat';
import { IItemAffixStats, SimpleItemAffixStatsMetadata, SimpleAffixStats } from '../ItemAffixes/Details/IItemAffixStats';

export class ArmorStatPrimaryEquippable implements IEquippableAffixStat {
    SelectedStat: string;
    SelectedEquipStat: string;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    private calculateAmount(src:any, affix:IItemAffix):any {
        var combinedStat = src as InventoryArmorModelCombined;
        var selectedType = Helpers.getPropertyByValue(ArmorTypesEnum, affix.Contents.AffixData["ArmorType"]);//.EquippableStatData.OutputMeta.SelectedEquipStat;

        // Recalculate full armor
        var calculationFactor = new CalculationsHelper().GetCalculatedFactor(selectedType, combinedStat[selectedType + "Armor"].Amount, 0);
        combinedStat[selectedType + "Armor"].Amount += affix.Contents.AffixData.Amount;
        combinedStat.Armor.Amount += Math.round(calculationFactor * affix.Contents.AffixData.Amount * 10) / 10;
        return combinedStat;
    }

    constructor(selectedStat:string, selectedEquipStat:string) {
        this.SelectedStat = selectedStat;
        this.SelectedEquipStat = selectedEquipStat;
        this.EquippableStatData = new SimpleAffixStats();
        this.updateEquippedStats = this.calculateAmount;
        this.getZeroStats = () => { return new InventoryArmorModel(); }
    }
    EquippableStatData: IItemAffixStats;
    SelectedCategoryStat: string;
    getZeroStats: () => any;
}

export class ArmorStatEquippable implements IEquippableAffixStat {
    getZeroStats: () => any;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;
    EquippableStatData: IItemAffixStats;

    private calculateEquippedStats(src:IItemAffix, affix:IItemAffix):IItemAffix {
        var combinedStat = new ArmorStatDetailsInventoryModelCombined();

        debugger;
        var selectedType = affix.SelectedEquipStat || affix.Contents.EquippableStatData.OutputMeta.SelectedEquipStat;
        if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.StunOrKnockdown) + "Reduction")
            combinedStat.StunOrKnockdown.ReducePercentage += affix.Contents.AffixData["StunOrKnockdown"];
        if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.KnockbackOrBleed) + "Reduction")
            combinedStat.KnockbackOrBleed.ReducePercentage += affix.Contents.AffixData["KnockbackOrBleed"];
        if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.WitherOrConflagrate) + "Reduction")
            combinedStat.WitherOrConflagrate.ReducePercentage += affix.Contents.AffixData["WitherOrConflagrate"];
        if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.FreezeOrCurse) + "Reduction")
            combinedStat.FreezeOrCurse.ReducePercentage += affix.Contents.AffixData["FreezeOrCurse"];
        if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.BlindOrRoot) + "Reduction")
            combinedStat.BlindOrRoot.ReducePercentage += affix.Contents.AffixData["BlindOrRoot"];
        if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.ReduceArmorOrLevitate) + "Reduction")
            combinedStat.ReduceArmorOrLevitate.ReducePercentage += affix.Contents.AffixData["ReduceArmorOrLevitate"];

        var combinedStatAffix = new ItemAffix(ItemAffixTypeEnum.Armor, src.Condition, src.AffixCategory);
        combinedStatAffix.Contents = src.Contents;
        combinedStatAffix.Contents.AffixData = combinedStat;
        return combinedStatAffix;
    }

    constructor(selectedStat:string, selectedEquipStat:string) {
        this.EquippableStatData = new SimpleAffixStats();
        this.EquippableStatData.OutputMeta.SelectedStat = selectedStat;
        this.EquippableStatData.OutputMeta.SelectedEquipStat = selectedEquipStat;
        this.updateEquippedStats = this.calculateEquippedStats;
        this.getZeroStats = () => { return new InventoryArmorModel(); }
    }
}

export class ArmorStatEquippableCombined implements IEquippableAffixStat {
    SelectedStat: string;
    SelectedEquipStat: string;
    SelectedCategoryStat: string;
    EquippableStatData: IItemAffixStats;
    getZeroStats: () => any;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    private calculateEquippedStats(src:IItemAffix, affix:IItemAffix):IItemAffix {
        var combinedStat = new ArmorStatDetailsInventoryModelCombined();
        var singledOutItemStats = this["ArmorDetails"];
        var selectedCombinedStat:CCEffectTypesEnum = null;
        if (singledOutItemStats) {
            selectedCombinedStat = this.CCStatsDict[this.SelectedStat];
        }

        if (selectedCombinedStat) {
            var selectedType = affix.SelectedEquipStat || affix.Contents.EquippableStatData.OutputMeta.SelectedEquipStat;
            if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.StunOrKnockdown) + "Reduction")
                combinedStat.StunOrKnockdown.ReducePercentage += affix.Contents.AffixData["StunOrKnockdown"];
            if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.KnockbackOrBleed) + "Reduction")
                combinedStat.KnockbackOrBleed.ReducePercentage += affix.Contents.AffixData["KnockbackOrBleed"];
            if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.WitherOrConflagrate) + "Reduction")
                combinedStat.WitherOrConflagrate.ReducePercentage += affix.Contents.AffixData["WitherOrConflagrate"];
            if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.FreezeOrCurse) + "Reduction")
                combinedStat.FreezeOrCurse.ReducePercentage += affix.Contents.AffixData["FreezeOrCurse"];
            if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.BlindOrRoot) + "Reduction")
                combinedStat.BlindOrRoot.ReducePercentage += affix.Contents.AffixData["BlindOrRoot"];
            if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.ReduceArmorOrLevitate) + "Reduction")
                combinedStat.ReduceArmorOrLevitate.ReducePercentage += affix.Contents.AffixData["ReduceArmorOrLevitate"];
    
            var combinedStatAffix = new ItemAffix(ItemAffixTypeEnum.Armor, src.Condition, src.AffixCategory);
            combinedStatAffix.Contents = src.Contents;
            combinedStatAffix.Contents.AffixData = combinedStat;
            return combinedStatAffix;
        }
    }

    private CCStatsDict: { [id: string] : CCEffectTypesEnum; } = {};

    constructor(selectedStat:string, selectedEquipStat:string) {
        this.CCStatsDict["Stun"] = CCEffectTypesEnum.StunOrKnockdown;
        this.CCStatsDict["Knockdown"] = CCEffectTypesEnum.StunOrKnockdown;
        this.CCStatsDict["Knockback"] = CCEffectTypesEnum.KnockbackOrBleed;
        this.CCStatsDict["Levitate"] = CCEffectTypesEnum.ReduceArmorOrLevitate;
        this.CCStatsDict["Wither"] = CCEffectTypesEnum.WitherOrConflagrate;
        this.CCStatsDict["Conflagrate"] = CCEffectTypesEnum.WitherOrConflagrate;
        this.CCStatsDict["Freeze"] = CCEffectTypesEnum.FreezeOrCurse;
        this.CCStatsDict["Curse"] = CCEffectTypesEnum.FreezeOrCurse;
        this.CCStatsDict["Root"] = CCEffectTypesEnum.BlindOrRoot;
        this.CCStatsDict["Blind"] = CCEffectTypesEnum.BlindOrRoot;

        this.EquippableStatData = new SimpleAffixStats();
        this.EquippableStatData.OutputMeta.SelectedCategoryStat = "ArmorCCData";
        this.EquippableStatData.OutputMeta.SelectedStat = selectedStat;
        this.EquippableStatData.OutputMeta.SelectedEquipStat = selectedEquipStat;
        this.updateEquippedStats = this.calculateEquippedStats;
        this.getZeroStats = () => { return new InventoryArmorModel(); }
    }
}
