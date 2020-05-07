import { IEffectAffix, IEffectAffixHolder } from './IEffectAffix'
import { Helpers } from 'src/_Helpers/helpers';
import { IDescribable } from '../IDescribable';
import { SpellEffectTypesEnum, TriggerTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { IItemAffixStats, SimpleItemAffixStatsMetadata, IItemAffixStatsMetadata } from '../Details/IItemAffixStats';
import { AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';

export class SpellEffectAffix implements IEffectAffixHolder, IItemAffixStats, IDescribable {
    Amount: number;
    private CastRange: IEffectAffix;
    private AoE: IEffectAffix;
    private DoT: IEffectAffix;
    private Stackable: IEffectAffix;
    private Multicast: IEffectAffix;
    private ResourceSunder: IEffectAffix;
    private StaminaSunder: IEffectAffix;
    private SkillData: IEffectAffix;
    SelectedType: any;
    AffixData: IEffectAffix;
    CategoryStats: AffixCategoryEnum;
    InputMeta: IItemAffixStatsMetadata;
    OutputMeta: IItemAffixStatsMetadata;

    constructor(affixData:IEffectAffix, selectedType:SpellEffectTypesEnum) {
        this.SelectedType = this[Helpers.getPropertyByValue(SpellEffectTypesEnum, this[this.SelectedType])];
        this.AffixData = affixData;
        if (this[this.SelectedType]) {
            this[this.SelectedType] = affixData;
        }

        this.InputMeta = new SimpleItemAffixStatsMetadata();
        this.OutputMeta = new SimpleItemAffixStatsMetadata();
        this.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.InputMeta.SelectedStat = Helpers.getPropertyByValue(AffixCategoryEnum, this.CategoryStats);
    }

    GetDescription(): string {
        var str = "";
        var affixData = this[Helpers.getPropertyByValue(SpellEffectTypesEnum, this[this.SelectedType])];
        if (affixData) {
            var procEffects: string[] = [];
            [this.Multicast, this.ResourceSunder, this.StaminaSunder, this.Stackable].forEach(a => { procEffects.push(Helpers.getPropertyByValue(SpellEffectAffix, a)); });
            var isProc = procEffects.includes(Helpers.getPropertyByValue(SpellEffectAffix, this[this.SelectedType]));

            var chanceStr = affixData.ProcChance ? affixData.ProcChance + "% chance to " : "";
            var effectStr = affixData.Effect ? (isProc ? "" : "increase ") + affixData.Effect : Helpers.getPropertyByValue(SpellEffectAffix, this.SelectedType) + " on cast ";
            var skillCastStr = this.SelectedType == SpellEffectTypesEnum.CastSpell && this.SkillData ? " cast level " + this.SkillData.SkillData.level + " " + this.SkillData.SkillData.name : "";

            var amountStr = affixData.Amount ? "by " + affixData.Amount : "";
            var amountPercentageStr = affixData.AmountPercentage ? affixData.AmountPercentage + "%" : "";
            var durationStr = affixData.Duration ? "for" + affixData.durationStr + "s" : "";
            str = chanceStr + effectStr + skillCastStr + amountStr + amountPercentageStr + durationStr;
        }

        return str;
    }
}
