import { ItemCategoriesEnum, ItemAffixTypeEnum, AffixCategoryEnum, CastTypesEnum, CastProcTypesEnum } from "../../_Enums/itemAffixEnums";
import { IItemAffix } from './IItemAffix';
import { IItemAffixCondition } from './IItemAffixCondition';
import { Helpers } from 'src/_Helpers/helpers';
import { PowerTypesEnum } from 'src/_Enums/powerTypesEnum';
import { SkillVM } from '../SkillVM';
import { ItemAffixOutput } from './Details/ItemAffixOutput';

export class ItemAffix implements IItemAffix {
    ItemId: number;

    ItemCategory: ItemCategoriesEnum;      // Weapon, Armor, Jewelry
    ItemType: number;                      // Which W,A,J
    AffixType: ItemAffixTypeEnum;          // Basic, Off, Def, Trigger, Legendary
    CastProcType: CastProcTypesEnum;       // OnHit, OnCast, OnDeath
    AttackProcType: CastTypesEnum;       // Melee, Projectile, AoE, TriggerEffect, Summon
    AffixCategory: AffixCategoryEnum;
    ConditionSatisfied: boolean;

    // The Basic Data, Function should return formatted text with numbers and set Description
    Contents:ItemAffixOutput;
    Description:string;
    Triggers:boolean;
    Triggerable:boolean;
    IsCC:boolean;
    IsLegendary:boolean;
    Condition: IItemAffixCondition;
    skillData: SkillVM[];
    PowerLevel: number;
    SelectedEquipStat: string;

    constructor(affixType: ItemAffixTypeEnum, condition?:IItemAffixCondition, affixCategory?: AffixCategoryEnum, powerLevel?:number, attacProckType?: CastTypesEnum, castProcType?: CastProcTypesEnum) {
        this.AffixType = affixType;
        this.Condition = condition;
        this.PowerLevel = powerLevel;
        if (!this.Condition)
            this.ConditionSatisfied = true;

        this.AffixCategory = affixCategory;
        this.AttackProcType = attacProckType;
        this.CastProcType = castProcType;
        if (this.Contents)
            this.SelectedEquipStat = this.Contents.AffixData.SelectedEquipStat;
    }

    public GetAffixDescription(skillData:SkillVM[]):string {
        var conditionStr:string = "";
        var statDescr:string = "";

        if (this.Contents.AffixData)
            statDescr += this.Contents.AffixData.GetDescription();

        var statDescrTest = statDescr.replace("*","").replace(" ", "");
        if (!statDescrTest)
        {
            // ExtraDamageEffect, IncreaseDamage, IncreaseTriggerStat, ConditionalProcBasicAffix, ConditionalProcCastAffix, ConditionalSkillTriggerAffix
            console.log("Contents for [most likely a ExtraDamageEffect]:")
            console.log(this.Contents);
            statDescr += " [" + Helpers.getPropertyByValue(AffixCategoryEnum, this.AffixCategory);
            statDescr += ", " + Helpers.getPropertyByValue(ItemAffixTypeEnum, this.AffixType) + "]";
        }

        var conditionalBasicAffixTypes:AffixCategoryEnum[] = [
            AffixCategoryEnum.ConditionalProcBasicAffix,
            AffixCategoryEnum.ConditionalSkillTriggerAffix,
        ];

        var conditionalTriggerAffixTypes:AffixCategoryEnum[] = [
            AffixCategoryEnum.ConditionalProcCastAffix,
            AffixCategoryEnum.ConditionalProcEffectAffix,
            AffixCategoryEnum.ConditionalProcTriggerAffix,
        ];

        var suffix = ((this.AffixType == ItemAffixTypeEnum.Damage && this.AffixCategory == AffixCategoryEnum.PrimaryDamage)
        || (this.AffixType == ItemAffixTypeEnum.Armor && this.AffixCategory == AffixCategoryEnum.PrimaryArmor)) ? " (Primary)"
        : this.AffixType == ItemAffixTypeEnum.BasicStat ? " (Basic)"
        : conditionalBasicAffixTypes.includes(this.AffixCategory) ? " (ConditionalTrigger)"
        : conditionalTriggerAffixTypes.includes(this.AffixCategory) ? " (ConditionalTrigger)"
        : " (" + Helpers.getPropertyByValue(ItemAffixTypeEnum, this.AffixType) + ")";

        if (this.Condition)
            conditionStr = "(requires " + this.Condition.Condition + " " + Helpers.getPropertyByValue(PowerTypesEnum, this.Condition.ConditionPowerType) + ")";

        // Remove Extra ***s into max 3
        if (statDescr.indexOf("****") != -1)
        while (statDescr.indexOf("****") != -1) {
            statDescr = statDescr.replace("****", "***");
        }

        if (statDescr.includes("NaN ") || statDescr.startsWith("0") || statDescr.includes("null") || statDescr.replace("*", "").length == 0) {
            console.log("Data missing for:");
            console.log(this);

            var inputData = this.Contents.EquippableStatData.InputMeta;
            var outputData = this.Contents.EquippableStatData.OutputMeta;
            var innerInputData = this.Contents.AffixData ? this.Contents.AffixData.EquippableStatData["InputMeta"] : "";
            var innerOutputData = this.Contents.AffixData ? this.Contents.AffixData.EquippableStatData["OutputMeta"] : "";

            suffix += JSON.stringify(outputData || inputData);
            suffix += JSON.stringify(innerOutputData || innerInputData);
        }

        return statDescr + " " + conditionStr + suffix;
    }

    public SetCondition(ConditionSatisfied:boolean) {
        this.ConditionSatisfied = ConditionSatisfied;
    }
}
