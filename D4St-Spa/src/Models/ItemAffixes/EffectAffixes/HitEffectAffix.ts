import { IEffectAffix, IEffectAffixHolder } from './IEffectAffix'
import { Helpers } from 'src/_Helpers/helpers';
import { IDescribable } from '../IDescribable';
import { HitEffectTypesEnum } from 'src/_Enums/triggerAffixEnums';

export class HitEffectAffix implements IEffectAffixHolder, IDescribable {
    AffixData: IEffectAffix;
    SelectedType:number;
    private LifeReturn: IEffectAffix;
    private ResourceReturn: IEffectAffix;
    private ResourceSunder: IEffectAffix;
    private StaminaReturn: IEffectAffix;
    private StaminaSunder: IEffectAffix;
    private CriticalHit: IEffectAffix;
    private Knockback: IEffectAffix;
    private ReduceArmor: IEffectAffix;
    private CrushingBlow: IEffectAffix;
    private Bleed: IEffectAffix;
    private Cleave: IEffectAffix;
    private ChainOrPierce: IEffectAffix;
    constructor(affixData:IEffectAffix, selectedType:HitEffectTypesEnum) {
        this.SelectedType = selectedType;
        this.AffixData = affixData;
        if (this[this.SelectedType]) {
            this[this.SelectedType] = affixData;
        }
    }
    GetDescription(): string {
        var str = "";
        var affixData = this[Helpers.getPropertyByValue(HitEffectTypesEnum, this[this.SelectedType])];
        if (affixData) {
            var chanceStr = affixData.ProcChance ? affixData.ProcChance + "% chance to proc " : "";
            var effectStr = affixData.Effect ? "to " + affixData.Effect : Helpers.getPropertyByValue(HitEffectAffix, this.SelectedType) + " on hit ";
            var amountStr = affixData.Amount ? "for " + affixData.Amount : "";
            var amountPercentageStr = affixData.AmountPercentage ? affixData.AmountPercentage + "%" : "";
            var durationStr = affixData.Duration ? "for" + affixData.durationStr + "s" : "";
            
            str = chanceStr + effectStr + amountStr + amountPercentageStr + durationStr;
        }

        return str;
    }
}
