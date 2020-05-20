import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { TriggerTypesEnum, CCEffectTypesEnum, SpellEffectTypesEnum, HitEffectTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { SkillVM } from 'src/Models/SkillVM';
import { AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { SimpleItemAffixStatsMetadata, IItemAffixStats, SimpleAffixStats } from './IItemAffixStats';
import { IItemAffix } from '../IItemAffix';
import { IEquippableAffixStat } from 'src/Models/IEquippableStatDetails/IEquippableAffixStat';
import { TriggerStatEquippable } from 'src/Models/IEquippableStatDetails/TriggerStatEquippable';

export class ItemTriggerStats implements IEquippableAffixStat {
    Chance:number;
    Amount:number;
    Type:TriggerTypesEnum;
    CategoryStats: AffixCategoryEnum;
    // HitEffectPhysical = 1,    // HitEffectTypesEnum
    // HitEffectCC = 2,          // CCEffectTypesEnum
    // SpellEffect = 3,          // SpellEffectTypesEnum
    HitEffectPhysical:HitEffectTypesEnum;
    HitEffectCC: CCEffectTypesEnum;
    SpellEffect: SpellEffectTypesEnum;
    SkillStat: SkillVM;
    private PowerLevel: number;
    private Level: number;
    private statsCalculated: boolean;
    private SelectedType:string;
    EquippableStatData: IItemAffixStats;
    getZeroStats: (src: any) => any;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;

    constructor(category: AffixCategoryEnum, level:number, powerLevel:number, amount:number, chance:number, type:TriggerTypesEnum, triggerSubtype:number, skillStat: SkillVM) {

        this.CategoryStats = category;
        this.Amount = -1; // Just make sure it's not 0, (again) for outside check
        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.Type = type;
        this.SelectedType = Helpers.getPropertyByValue(TriggerTypesEnum, this.Type);
        this[this.SelectedType] = triggerSubtype;
        this.SkillStat = skillStat;

        if (!this.statsCalculated) {
            var appropriateEffects = new CalculationsHelper().GetAppropriateAffixesForTrigger(this.Type);
            var selectedTriggerEffect = appropriateEffects[Helpers.getRandom(0, appropriateEffects.length - 1)];
            this.Chance = new CalculationsHelper().getTriggerChanceForLevel(this.Amount, this.Level, this.PowerLevel);
            this.Amount = new CalculationsHelper().getTriggerStatsForLevel(this.Amount, this.Level, this.PowerLevel, this.Type);

            this[this.SelectedType] = triggerSubtype;
            if (!this[this.SelectedType]) {
                this.SelectedType = "HitEffectCC";
                this.HitEffectCC = selectedTriggerEffect.SelectedType as CCEffectTypesEnum;
            }

            this.statsCalculated = true;
        }

        this.EquippableStatData = new SimpleAffixStats();
        this.EquippableStatData.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.EquippableStatData.InputMeta.SelectedStat = Helpers.getPropertyByValue(TriggerTypesEnum, this.Type);
        this.EquippableStatData.OutputMeta.SelectedCategoryStat = "TriggerData";
        this.EquippableStatData.OutputMeta.SelectedStat = Helpers.getPropertyByValue(TriggerTypesEnum, this.Type);
        this.EquippableStatData.OutputMeta.SelectedEquipStat = this.Type == TriggerTypesEnum.HitEffectCC ? Helpers.getPropertyByValue(CCEffectTypesEnum, this.HitEffectCC)
                               : this.Type == TriggerTypesEnum.HitEffectPhysical ? Helpers.getPropertyByValue(HitEffectTypesEnum, this.HitEffectPhysical)
                               : Helpers.getPropertyByValue(TriggerTypesEnum, this.Type);
        
        this.getZeroStats = (src) => { (src as ItemTriggerStats).Amount = 0 };
        this.updateEquippedStats = new TriggerStatEquippable().updateEquippedStats;
    }

    public GetDescription():string {

        var selectedSkill = this.Type == TriggerTypesEnum.SpellEffect ? this.SkillStat : null;
        var selectedActionStr = this.Type == TriggerTypesEnum.SpellEffect ? " to cast " : " to ";
        var skillStrDescr = selectedSkill ? " level " + this.Amount + " " + selectedSkill.name : "";
        var procStrDescr = this.GetTriggerTypeInfo()
        var durationDescr = " for " + this.Amount;
        var withChanceStr = this.Chance + "% chance " + selectedActionStr + (skillStrDescr || procStrDescr || Helpers.getPropertyByValue(TriggerTypesEnum, this.Type)) + durationDescr;
        var withoutChanceStr = "Effects of type " + Helpers.getPropertyByValue(CCEffectTypesEnum, this[this.SelectedType]) + " do additional " + this.Amount + "% damage";

        if (!this.Chance) {
            debugger;
        }

        return this.Chance ? withChanceStr : withoutChanceStr;
    }

    public GetTriggerTypeInfo():string {
        var hitEffectPhysical = this.SelectedType == "HitEffectPhysical" ? Helpers.getPropertyByValue(HitEffectTypesEnum, this.HitEffectPhysical) : "";
        var hitEffectCC = this.SelectedType == "HitEffectCC" ? Helpers.getPropertyByValue(CCEffectTypesEnum, this.HitEffectCC) : "";
        var spellEffectType = this.SelectedType == "SpellEffect" ? Helpers.getPropertyByValue(SpellEffectTypesEnum, this.SpellEffect) : "";
        var descr = hitEffectPhysical || hitEffectCC || spellEffectType;
        return descr;
    }
}
