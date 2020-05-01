import { IEquippableStat, IEquippableInventoryModel } from 'src/Models/InventoryDetailModels/IEquippableStat';
import { CCEffectTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { IItemAffix } from '../../IItemAffix';
import { InventoryArmorModelCombined, InventoryArmorModel } from 'src/Models/InventoryArmorModel';
import { ArmorTypesEnum, ItemAffixTypeEnum } from 'src/_Enums/itemAffixEnums';
import { ItemAffix } from '../../ItemAffix';
import { ArmorStatDetailsInventoryModelCombined } from 'src/Models/InventoryDetailModels/ArmorStatDetailsInventoryModel';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { ItemAffixOutput } from '../ItemAffixOutput';


export class ArmorStatPrimaryEquippable implements IEquippableStat {
    SelectedStat: string;
    SelectedEquipStat: string;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    private calculateAmount(src:any, affix:IItemAffix):any {
        var combinedStat = src as InventoryArmorModelCombined;
        var selectedType = affix.Contents.SelectedEquipStat;

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

        var selectedType = affix.SelectedEquipStat || affix.Contents.SelectedEquipStat || this.SelectedEquipStat;
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

        var singledOutItemStats = this["ArmorDetails"] as IEquippableInventoryModel;
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

// export class CCEffectReductionEquippableCombined implements IEquippableStat {
//     SelectedStat: string;
//     SelectedEquipStat: string;
//     updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

//     private calculateEquippedStats(src:IItemAffix, affix:IItemAffix):IItemAffix {
//         var selectedCombinedStat = this[this.SelectedStat] as CCEffectTypesEnum;

//         if (selectedCombinedStat) {
//             var selectedEquipModel = this[src.Contents.SelectedStat] as IItemAffix;
//             selectedEquipModel[this.SelectedEquipStat + "." + Helpers.getPropertyByValue(CCEffectTypesEnum, selectedCombinedStat)] += equippedAffix.Contents.AffixData.Amount;
//             return selectedEquipModel;
//         }
//     }

//     private CCStatsDict: { [id: string] : CCEffectTypesEnum; } = {};

//     constructor(selectedStat:string, selectedEquipStat:string) {
//         this.CCStatsDict["Stun"] = CCEffectTypesEnum.StunOrKnockdown;
//         this.CCStatsDict["Knockdown"] = CCEffectTypesEnum.StunOrKnockdown;
//         this.CCStatsDict["Knockback"] = CCEffectTypesEnum.KnockbackOrLevitate;
//         this.CCStatsDict["Levitate"] = CCEffectTypesEnum.KnockbackOrLevitate;
//         this.CCStatsDict["Wither"] = CCEffectTypesEnum.WitherOrConflagrate;
//         this.CCStatsDict["Conflagrate"] = CCEffectTypesEnum.WitherOrConflagrate;
//         this.CCStatsDict["Freeze"] = CCEffectTypesEnum.FreezeOrRoot;
//         this.CCStatsDict["Root"] = CCEffectTypesEnum.FreezeOrRoot;
//         this.CCStatsDict["Blind"] = CCEffectTypesEnum.BlindOrCurse;
//         this.CCStatsDict["Curse"] = CCEffectTypesEnum.BlindOrCurse;

//         this.SelectedStat = selectedStat;
//         this.SelectedEquipStat = selectedEquipStat;
//         this.updateEquippedStats = this.calculateEquippedStats;
//     }
// }
