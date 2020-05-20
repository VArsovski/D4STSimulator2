import { IItemAffix } from '../ItemAffixes/IItemAffix';
import { BasicStatTypesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { BasicStatInventoryModel } from '../InventoryModels/InventoryDetailModels/BasicStatInventoryModel';
import { IEquippableAffixStat } from './IEquippableAffixStat';
import { IItemAffixStats } from '../ItemAffixes/Details/IItemAffixStats';
import { ItemBasicStatsDetail } from '../ItemAffixes/Details/ItemBasicStats';

export class BasicStatEquippable implements IEquippableAffixStat {
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;
    EquippableStatData: IItemAffixStats;
    getZeroStats: (src:any) => any;

    private calculateBasicStats(src:IItemAffix, affix:IItemAffix):IItemAffix {
        var selectedEquipModel = src;
        var selectedStat = affix.Contents.AffixData.EquippableStatData.OutputMeta.SelectedStat;
        var isSkillData = selectedStat == "SkillData";

        if (isSkillData) {
            var selectedStatAmount = affix.Contents.AffixData["SkillEmpower"].AffixData;
            var selectedType = affix.Contents.AffixData.EquippableStatData.OutputMeta.SelectedStat;
        }
        else {
            var selectedStatAmount = affix.Contents.AffixData[selectedStat]["Amount"];
            var selectedType = affix.Contents.AffixData.EquippableStatData.OutputMeta.SelectedStat;
    
            // debugger;
            // var selectedStat = (src as ItemBasicStatsDetail).EquippableStatData.OutputMeta.SelectedStat;
            // var selectedStatData = (src as ItemBasicStatsDetail).StatType;
            // var srcReturnData = new InventoryBasicStatsModel();
            // var selectedStatDetails = srcReturnData[selectedStat] as BasicStatInventoryModel;
            // selectedStatDetails.Amount = 0;
            // selectedStatDetails.AmountPercentage = 0;
            // selectedStatDetails.AmountPercentageRegen = 0;
            // selectedStatDetails.Regen = 0;
            // selectedStatDetails.Return = 0;
    
                debugger;
            if (selectedType == Helpers.getPropertyByValue(BasicStatTypesEnum, BasicStatTypesEnum.StatAmount))
                selectedEquipModel["Amount"] += selectedStatAmount || 0;
            if (selectedType == Helpers.getPropertyByValue(BasicStatTypesEnum, BasicStatTypesEnum.StatRegen))
                selectedEquipModel["Regen"] += selectedStatAmount || 0;
            if (selectedType == Helpers.getPropertyByValue(BasicStatTypesEnum, BasicStatTypesEnum.StatPercentage))
                selectedEquipModel["AmountPercentage"] += selectedStatAmount || 0;
            if (selectedType == Helpers.getPropertyByValue(BasicStatTypesEnum, BasicStatTypesEnum.StatPercentageRegen))
                selectedEquipModel["AmountPercentageRegen"] += selectedStatAmount || 0;
            if (selectedType == Helpers.getPropertyByValue(BasicStatTypesEnum, BasicStatTypesEnum.StatReturn))
                selectedEquipModel["Return"] += selectedStatAmount || 0;
        }

        return selectedEquipModel;
    }

    constructor(selectedStat:string, selectedEquipStat:string) {
        this.updateEquippedStats = this.calculateBasicStats;
        this.getZeroStats = (src) => { return new BasicStatInventoryModel(); }
    }
}
