import { IEquippableStat } from 'src/Models/InventoryModels/InventoryDetailModels/IEquippableStat';
import { CCEffectTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { IItemAffix } from '../ItemAffixes/IItemAffix';
import { InventoryArmorModelCombined } from 'src/Models/InventoryModels/InventoryArmorModel';
import { ItemAffixTypeEnum } from 'src/_Enums/itemAffixEnums';
import { ItemAffix } from '../ItemAffixes/ItemAffix';
import { ArmorStatDetailsInventoryModelCombined } from 'src/Models/InventoryModels/InventoryDetailModels/ArmorStatDetailsInventoryModel';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';

export class ArmorStatPrimaryEquippable implements IEquippableStat {
    SelectedStat: string;
    SelectedEquipStat: string;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    private calculateAmount(src:any, affix:IItemAffix):any {
        var combinedStat = src as InventoryArmorModelCombined;
        var selectedType = affix.Contents.OutputMeta.SelectedEquipStat;

        // Recalculate full armor
        var calculationFactor = new CalculationsHelper().GetCalculatedFactor(selectedType, combinedStat[selectedType].Amount, 0);
        combinedStat[selectedType].Amount += affix.Contents.AffixData.Armor;
        combinedStat.Armor.Amount += Math.round(calculationFactor * affix.Contents.AffixData.Armor * 10) / 10;
        return combinedStat;
    }

    constructor(selectedStat:string, selectedEquipStat:string) {
        this.SelectedStat = selectedStat;
        this.SelectedEquipStat = selectedEquipStat;
        this.updateEquippedStats = this.calculateAmount;
    }
}

export class ArmorStatEquippable implements IEquippableStat {
    SelectedStat: string;
    SelectedEquipStat: string;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    private calculateEquippedStats(src:IItemAffix, affix:IItemAffix):IItemAffix {
        var combinedStat = new ArmorStatDetailsInventoryModelCombined();
        debugger;

        var selectedType = affix.SelectedEquipStat || affix.Contents.OutputMeta.SelectedEquipStat || this.SelectedEquipStat;
        if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.StunOrKnockdown) + "Reduction")
            combinedStat.StunOrKnockdownReduction += affix.Contents.AffixData["StunOrKnockdownReduction"];
        if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.KnockbackOrLevitate) + "Reduction")
            combinedStat.KnockbackOrLevitateReduction += affix.Contents.AffixData["KnockbackOrLevitateReduction"];
        if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.WitherOrConflagrate) + "Reduction")
            combinedStat.WitherOrConflagrateReduction += affix.Contents.AffixData["WitherOrConflagrateReduction"];
        if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.BlindOrCurse) + "Reduction")
            combinedStat.BlindOrCurseReduction += affix.Contents.AffixData["BlindOrCurseReduction"];
        if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.FreezeOrRoot) + "Reduction")
            combinedStat.FreezeOrRootReduction += affix.Contents.AffixData["FreezeOrRootReduction"];

        var combinedStatAffix = new ItemAffix(ItemAffixTypeEnum.Armor, src.Condition, src.AffixCategory);
        combinedStatAffix.Contents = src.Contents;
        combinedStatAffix.Contents.AffixData = combinedStat;
        return combinedStatAffix;
    }

    constructor(selectedStat:string, selectedEquipStat:string) {
        this.SelectedStat = selectedStat;
        this.SelectedEquipStat = selectedEquipStat;
        this.updateEquippedStats = this.calculateEquippedStats;
    }
}

export class ArmorStatEquippableCombined implements IEquippableStat {
    SelectedStat: string;
    SelectedEquipStat: string;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    private calculateEquippedStats(src:IItemAffix, affix:IItemAffix):IItemAffix {
        var combinedStat = new ArmorStatDetailsInventoryModelCombined();
        debugger;

        var singledOutItemStats = this["ArmorDetails"];
        var selectedCombinedStat:CCEffectTypesEnum = null;
        if (singledOutItemStats) {
            selectedCombinedStat = this.CCStatsDict[this.SelectedStat];
        }

        if (selectedCombinedStat) {
            var selectedType = Helpers.getPropertyByValue(CCEffectTypesEnum, selectedCombinedStat);
            if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.StunOrKnockdown) + "Reduction")
                combinedStat.StunOrKnockdownReduction += affix.Contents.AffixData["StunOrKnockdownReduction"];
            if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.KnockbackOrLevitate) + "Reduction")
                combinedStat.KnockbackOrLevitateReduction += affix.Contents.AffixData["KnockbackOrLevitateReduction"];
            if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.WitherOrConflagrate) + "Reduction")
                combinedStat.WitherOrConflagrateReduction += affix.Contents.AffixData["WitherOrConflagrateReduction"];
            if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.BlindOrCurse) + "Reduction")
                combinedStat.BlindOrCurseReduction += affix.Contents.AffixData["BlindOrCurseReduction"];
            if (selectedType == Helpers.getPropertyByValue(CCEffectTypesEnum, CCEffectTypesEnum.FreezeOrRoot) + "Reduction")
                combinedStat.FreezeOrRootReduction += affix.Contents.AffixData["FreezeOrRootReduction"];
    
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
        this.CCStatsDict["Knockback"] = CCEffectTypesEnum.KnockbackOrLevitate;
        this.CCStatsDict["Levitate"] = CCEffectTypesEnum.KnockbackOrLevitate;
        this.CCStatsDict["Wither"] = CCEffectTypesEnum.WitherOrConflagrate;
        this.CCStatsDict["Conflagrate"] = CCEffectTypesEnum.WitherOrConflagrate;
        this.CCStatsDict["Freeze"] = CCEffectTypesEnum.FreezeOrRoot;
        this.CCStatsDict["Root"] = CCEffectTypesEnum.FreezeOrRoot;
        this.CCStatsDict["Blind"] = CCEffectTypesEnum.BlindOrCurse;
        this.CCStatsDict["Curse"] = CCEffectTypesEnum.BlindOrCurse;

        this.SelectedStat = selectedStat;
        this.SelectedEquipStat = selectedEquipStat;
        this.updateEquippedStats = this.calculateEquippedStats;
    }
}
