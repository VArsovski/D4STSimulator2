import { IEffectAffix, IEffectAffixHolder } from './IEffectAffix';
import { Helpers } from 'src/_Helpers/helpers';
import { TriggerTypesEnum } from 'src/_Enums/triggerAffixEnums';

export class TriggerEffectAffix implements IEffectAffixHolder {
    SelectedType: number;
    AffixData: IEffectAffix;
    private HitEffectPhysical: IEffectAffix;
    private HitEffectCC: IEffectAffix;
    private SpellEffect: IEffectAffix;
    private CastSpell: IEffectAffix;

    constructor(affixData:IEffectAffix, selectedType:TriggerTypesEnum) {
        this.SelectedType = selectedType;
        this.AffixData = affixData;
        if (this[this.SelectedType]) {
            this[this.SelectedType] = affixData;
        }
    }

    GetDescription(): string {
        var str = "";
        var affixData = this[Helpers.getPropertyByValue(TriggerTypesEnum, this[this.SelectedType])];
        if (affixData) {
            var chanceStr = affixData.ProcChance ? affixData.ProcChance + "% chance to " : "";
            var effectStr = affixData.Effect ? "to " + affixData.Effect : Helpers.getPropertyByValue(TriggerTypesEnum, this.SelectedType) + " on cast ";
            var amountStr = affixData.Amount ? "for " + affixData.Amount : "";
            var amountPercentageStr = affixData.AmountPercentage ? affixData.AmountPercentage + "%" : "";
            var durationStr = affixData.Duration ? "for" + affixData.durationStr + "s" : "";

            str = chanceStr + effectStr + amountStr + amountPercentageStr + durationStr;
        }

        return str;
    }
}
