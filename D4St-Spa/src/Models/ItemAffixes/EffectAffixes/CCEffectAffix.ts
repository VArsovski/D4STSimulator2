import { IEffectAffix, IEffectAffixHolder } from './IEffectAffix'
import { Helpers } from 'src/_Helpers/helpers';
import { IDescribable } from '../IDescribable';
import { CCEffectTypesEnum } from 'src/_Enums/triggerAffixEnums';

export class CCEffectAffix implements IEffectAffixHolder, IDescribable {
    AffixData: IEffectAffix;
    SelectedType:number;
    private Stun: IEffectAffix;
    private Knockback: IEffectAffix;
    private Burn: IEffectAffix;
    private Wither: IEffectAffix;
    private Blind: IEffectAffix;
    private Curse: IEffectAffix;
    private Root: IEffectAffix;
    private Freeze: IEffectAffix;
    private Levitate: IEffectAffix;
    private ReduceArmor: IEffectAffix;

    constructor(affixData:IEffectAffix, selectedType:CCEffectTypesEnum) {
        this.SelectedType = selectedType;
        this.AffixData = affixData;
        if (this[this.SelectedType]) {
            this[this.SelectedType] = affixData;
        }
    }

    GetDescription(): string {
        var str = "";
        var affixData = this[Helpers.getPropertyByValue(CCEffectTypesEnum, this[this.SelectedType])];
        if (affixData) {
            var chanceStr = affixData.ProcChance ? affixData.ProcChance + "% chance to " : "";
            var effectStr = affixData.Effect ? "to " + affixData.Effect : Helpers.getPropertyByValue(CCEffectAffix, this.SelectedType) + " on cast ";
            var amountStr = affixData.Amount ? "for " + affixData.Amount : "";
            var amountPercentageStr = affixData.AmountPercentage ? affixData.AmountPercentage + "%" : "";
            var durationStr = affixData.Duration ? "for" + affixData.durationStr + "s" : "";

            str = chanceStr + effectStr + amountStr + amountPercentageStr + durationStr;
        }

        return str;
    }
}
