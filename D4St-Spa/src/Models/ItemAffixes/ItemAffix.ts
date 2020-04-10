import { ItemCategoriesEnum, ItemAffixTypeEnum, AffixCategoryEnum, AttackTypesEnum, CastProcTypesEnum, DamageTypesEnum, ItemArmorTypesEnum, BasicAffixEnum, OfensiveStatsEnum, DefensiveStatsEnum, LegendaryStatsEnum  } from "../../_Enums/itemAffixEnums";
import { IItemAffix } from './IItemAffix';
import { IItemAffixCondition } from './IItemAffixCondition';
import { Helpers } from 'src/_Helpers/helpers';
import { PowerTypesEnum } from 'src/_Enums/powerTypesEnum';
import { SkillVM } from '../SkillVM';
import { ItemAffixOutput } from './Details/ItemAffixOutput';

export class ItemAffix implements IItemAffix {
    Index: number;

    ItemCategory: ItemCategoriesEnum;      // Weapon, Armor, Jewelry
    ItemType: number;                      // Which W,A,J
    AffixType: ItemAffixTypeEnum;          // Basic, Off, Def, Trigger, Legendary
    CastProcType: CastProcTypesEnum;       // OnHit, OnCast, OnDeath
    AttackProcType: AttackTypesEnum;       // Melee, Projectile, AoE, TriggerEffect, Summon
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

    constructor(index:number, affixType: ItemAffixTypeEnum, condition?:IItemAffixCondition, affixCategory?: AffixCategoryEnum, powerLevel?:number, attacProckType?: AttackTypesEnum, castProcType?: CastProcTypesEnum) {
        this.Index = index;
        this.AffixType = affixType;
        this.Condition = condition;
        this.PowerLevel = powerLevel;
        if (!this.Condition)
            this.ConditionSatisfied = true;

        // if (affixCategory || {} != {}) {
        this.AffixCategory = affixCategory;
        this.AttackProcType = attacProckType;
        this.CastProcType = castProcType;
        //}
    }

    public GetAffixDescription(skillData:SkillVM[]):string {
        var conditionStr:string = "";
        var statDescr:string = "";

        if (this.AffixType == ItemAffixTypeEnum.Damage) {
            if (this.Contents.damageStat)
                statDescr += this.Contents.damageStat.GetDescription();
            if (this.AffixCategory == AffixCategoryEnum.PrimaryDamage)
                statDescr += " (primary)";
        }
        if (this.AffixType == ItemAffixTypeEnum.Armor) {
            if (this.Contents.armorStat)
                statDescr +=  this.Contents.armorStat.GetDescription();
            if (this.AffixCategory == AffixCategoryEnum.PrimaryArmor)
                statDescr += " (primary)";
        }
        if (this.AffixType == ItemAffixTypeEnum.BasicStat) {
            if (this.Contents.basicStat)
                statDescr += this.Contents.basicStat.GetDescription() + " (basic)";
        }

        if (this.AffixType == ItemAffixTypeEnum.Offensive) {
            if (this.Contents.ofensiveStat)
                statDescr += this.Contents.ofensiveStat.GetDescription() + " (ofensive)";
        }
        if (this.AffixType == ItemAffixTypeEnum.Defensive) {
            if (this.Contents.defensiveStat)
                statDescr += this.Contents.defensiveStat.GetDescription() + " (defensive)";
        }
        if (this.AffixType == ItemAffixTypeEnum.TriggerEffect) {
            if (this.Contents.triggerStat)
                statDescr += this.Contents.triggerStat.GetDescription() + " (trigger)";// Helpers.getPropertyByValue(TriggerStatsEnum, this.Contents.triggerStat) + " trigger";
        }        
        if (this.AffixType == ItemAffixTypeEnum.SecondaryTriggers) {
            if (this.Contents.secondaryTriggerStat)
                statDescr += this.Contents.secondaryTriggerStat.GetDescription() + " (secondary)";
        }        
        if (this.AffixType == ItemAffixTypeEnum.Legendary) {
            if (this.Contents.legendaryStat)
                statDescr += Helpers.getPropertyByValue(LegendaryStatsEnum, this.Contents.legendaryStat) + " (legendary)";
        }
        if (this.AffixType == ItemAffixTypeEnum.PowerUpSkill) {
            if (this.Contents.basicStat)
                statDescr += this.Contents.basicStat.GetDescription();
        }

        if (!statDescr)
        {
            // ExtraDamageEffect, IncreaseDamage, IncreaseTriggerStat, ConditionalProcBasicAffix, ConditionalProcCastAffix, ConditionalSkillTriggerAffix
            statDescr += " [" + Helpers.getPropertyByValue(AffixCategoryEnum, this.AffixCategory);
            statDescr += ", " + Helpers.getPropertyByValue(ItemAffixTypeEnum, this.AffixType) + "]";
        }

        if (this.Condition) {
            conditionStr = "(requires " + this.Condition.Condition + " " + Helpers.getPropertyByValue(PowerTypesEnum, this.Condition.ConditionPowerType) + ")";
        }

        if (statDescr.includes("NaN ") || statDescr.startsWith("0") || statDescr.includes("null") || statDescr.replace("*", "").length == 0)
            console.log(this);

        return statDescr + " " + conditionStr;
    }
    public SetCondition(ConditionSatisfied:boolean) {
        this.ConditionSatisfied = ConditionSatisfied;
    }
}
