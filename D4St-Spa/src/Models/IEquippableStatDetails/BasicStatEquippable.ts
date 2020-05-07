import { IEquippableStat } from 'src/Models/InventoryModels/InventoryDetailModels/IEquippableStat';
import { IItemAffix } from '../ItemAffixes/IItemAffix';
import { BasicStatTypesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';

export class BasicStatEquippable implements IEquippableStat {
    SelectedStat: string;
    SelectedEquipStat: string;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    private calculateBasicStats(src:IItemAffix, affix:IItemAffix):IItemAffix {
        var selectedEquipModel = src;
        var selectedStat = affix.Contents.AffixData.OutputMeta.SelectedStat;
        var selectedStatAmount = affix.Contents.AffixData[selectedStat]["Amount"];
        var selectedType = affix.Contents.AffixData.OutputMeta.SelectedStat;
        debugger;
        if (selectedType == Helpers.getPropertyByValue(BasicStatTypesEnum, BasicStatTypesEnum.StatNumbers))
            selectedEquipModel["Amount"] += selectedStatAmount || 0;
        if (selectedType == Helpers.getPropertyByValue(BasicStatTypesEnum, BasicStatTypesEnum.StatRegen))
            selectedEquipModel["Regen"] += selectedStatAmount || 0;
        if (selectedType == Helpers.getPropertyByValue(BasicStatTypesEnum, BasicStatTypesEnum.StatPercentage))
            selectedEquipModel["AmountPercentage"] += selectedStatAmount || 0;
        if (selectedType == Helpers.getPropertyByValue(BasicStatTypesEnum, BasicStatTypesEnum.StatPercentageRegen))
            selectedEquipModel["AmountPercentageRegen"] += selectedStatAmount || 0;
        if (selectedType == Helpers.getPropertyByValue(BasicStatTypesEnum, BasicStatTypesEnum.StatReturn))
            selectedEquipModel["Return"] += selectedStatAmount || 0;
        return selectedEquipModel;
    }

    constructor(selectedStat:string, selectedEquipStat:string) {
        this.updateEquippedStats = this.calculateBasicStats;
    }
}
