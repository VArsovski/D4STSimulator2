import { IItemAffix } from '../ItemAffixes/IItemAffix';
import { ItemBasicPowersDetail } from '../ItemAffixes/Details/ItemSimpleStats';
import { IEquippableAffixStat } from './IEquippableAffixStat';
import { IItemAffixStats } from '../ItemAffixes/Details/IItemAffixStats';
import { Helpers } from 'src/_Helpers/helpers';
import { PowerTypesEnum } from 'src/_Enums/powerTypesEnum';

export class PowerStatEquippable implements IEquippableAffixStat {
    EquippableStatData: IItemAffixStats;
    getZeroStats: (src:any) => any;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    private calculatePowerStats(src:IItemAffix, affix:IItemAffix):IItemAffix {
        var combinedStat = src;
        var selectedStatData = affix.Contents.AffixData.EquippableStatData.OutputMeta;
        var selectedStat = selectedStatData["SelectedStat"];
        var selectedSubStat = selectedStatData["SelectedEquipStat"].replace("Power", "") + "Power";
        var amount = affix.Contents.AffixData[selectedStat].Amount;

        if (selectedSubStat != "AllPower")
            combinedStat[selectedSubStat]["Amount"] += amount;
        else {
            [1,2,3].forEach(p => {
                selectedSubStat = Helpers.getPropertyByValue(PowerTypesEnum, p) + "Power";
                combinedStat[selectedSubStat]["Amount"] += amount;
            })
        }

        return combinedStat;
    }

    constructor() {
        this.updateEquippedStats = this.calculatePowerStats;
        this.getZeroStats = (src) => { (src as ItemBasicPowersDetail).Amount = 0; return src; }
    }
}
