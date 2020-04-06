import { IDescribable } from '../IDescribable';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { TriggerStatsEnum, TriggerAffixTypesEnum, CCEffectTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { SkillVM } from 'src/Models/SkillVM';

// export class ItemTriggerStatsDetail implements IDescribable {
//     Chance: number;
//     Amount: number;
//     Trigger: ItemTriggerStats;
//     private Level: number;
//     private PowerLevel: any;

//     constructor(level:number, powerLevel:number, amount:number, trigger:ItemTriggerStats) {
//         this.Level = level || 1;
//         this.PowerLevel = powerLevel;
//         this.Trigger = trigger;
//     }

//     public GetData()
//     {
//         this.Amount = new CalculationsHelper().getTriggerStatsForLevel(this.Amount, this.Chance, this.Level, this.Trigger.Type);
//         this.Chance = new CalculationsHelper().getTriggerChanceForLevel(this.Chance, this.Level, this.Trigger.Type);
//         return this;
//     }

//     public GetDescription():string {
//         debugger;
//         var data = this.GetData();
//         var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
//         return data.Amount + " " + data.GetDescription() + " trigger" + empoweredStr;
//     }
// }

export class ItemTriggerStats implements IDescribable {
    Chance:number;
    Amount:number;
    Type:TriggerStatsEnum;
    AffixType: TriggerAffixTypesEnum;
    CCType: CCEffectTypesEnum;
    SkillStat: SkillVM;
    private PowerLevel: number;
    private Level: number;

    //     PhysicalAttack = 1,           //TriggerAffixes [1,2], 4 CCEffectTypesEnum[1,2]
    //     SpellAttack = 1,              //TA[6], CCET[5,6,8,9,10]
    //     PhysicalAoE = 2,              //TriggerAffixes [3, 6], 3 CCEffectTypesEnum[4,7]
    //     CCPhysical = 4,               //TA[3], CCET[3,4,7]
    //     Spellcast = 5,                //Cast a spell
    constructor(level:number, powerLevel:number, amount:number, chance:number, type:TriggerStatsEnum, triggerAffixType:TriggerAffixTypesEnum, ccEffectType:CCEffectTypesEnum, skillStat: SkillVM) {
        this.Level = level || 1;
        this.PowerLevel = powerLevel;
        this.Amount = amount;
        this.Type = type;
        this.AffixType = triggerAffixType;
        this.CCType = ccEffectType;
        this.SkillStat = skillStat;
    }

    public GetDescription():string {
        
        var data = this.GetData();
        var selectedAffixStr = [TriggerAffixTypesEnum.Cleave, TriggerAffixTypesEnum.ChainOrPierce].indexOf(data.AffixType) == -1
            ? Helpers.getPropertyByValue(CCEffectTypesEnum, data.CCType)
            : Helpers.getPropertyByValue(TriggerAffixTypesEnum, data.AffixType);

        var procEffects = [CCEffectTypesEnum.Bleed, CCEffectTypesEnum.CriticalHit, CCEffectTypesEnum.CrushingBlow].indexOf(data.CCType) != -1;

        var selectedSkill = this.Type == TriggerStatsEnum.Spellcast ? data.SkillStat : null;
        var selectedActionStr = selectedSkill ? " to cast " : procEffects || data.AffixType == TriggerAffixTypesEnum.ChainOrPierce ? " to proc " : " to ";
        var skillStrDescr = selectedSkill ? " level " + data.Amount + " " + selectedSkill.name : "";
        var procStrDescr = selectedAffixStr || Helpers.getPropertyByValue(TriggerAffixTypesEnum, data.AffixType) + " for " + data.Amount;

        if (!procStrDescr){
            console.clear();
            console.log("Error for:");
            console.log(data);
        }

        return data.Chance + "% chance " + selectedActionStr + (skillStrDescr || procStrDescr);
    }

    public GetTriggerTypeInfo():string {
        var data = this.GetData();
        // if (data.AffixType == TriggerAffixTypesEnum.PhysicalAoE)
        if (!data.CCType)
            data.CCType = CCEffectTypesEnum.Knockback;

        // if (data.Type == TriggerStatsEnum.SpellAttack || data.AffixType == TriggerAffixTypesEnum.CastSpell) {
        //     data.Type = Helpers.getRandom(1, 4);
        //     data.AffixType = Helpers.getRandom(1, 6);
        // }

        var selectedAffixStr = [TriggerAffixTypesEnum.Cleave, TriggerAffixTypesEnum.ChainOrPierce].indexOf(data.AffixType) == -1
            ? Helpers.getPropertyByValue(CCEffectTypesEnum, data.CCType)
            : Helpers.getPropertyByValue(TriggerAffixTypesEnum, data.AffixType) || Helpers.getPropertyByValue(TriggerAffixTypesEnum, data.AffixType);

        if (!selectedAffixStr || selectedAffixStr.includes("null")) {
            console.log("Error:")
            console.log(data.Type);
            console.log(data.AffixType);    
            console.log(data)
        }

        return selectedAffixStr;
    }
    
    public GetData()
    {
        var appropriateTriggerAffixes = this.GetAppropriateAffixesForTrigger(this.Type);
        var selectedAffix = appropriateTriggerAffixes[Helpers.getRandom(0, appropriateTriggerAffixes.length-1)];
        var appropriateEffects = this.GetAppropriateEffectsForAffix(selectedAffix);
        var selectedTriggerEffect = appropriateEffects[Helpers.getRandom(0, appropriateEffects.length - 1)];
        var data = new ItemTriggerStats(this.Level, this.PowerLevel, this.Amount, this.Chance, this.Type, selectedAffix, selectedTriggerEffect, this.SkillStat);
        data.Chance = new CalculationsHelper().getTriggerChanceForLevel(data.Amount, data.Level, data.PowerLevel);
        data.Amount = new CalculationsHelper().getTriggerStatsForLevel(data.Amount, data.Level, data.PowerLevel, data.Type);
        return data;
    }

    private GetAppropriateAffixesForTrigger(type:TriggerStatsEnum): TriggerAffixTypesEnum[] {
        var triggerAffixes:TriggerAffixTypesEnum[] = [];

        var physicalAttackTriggers = [
            TriggerAffixTypesEnum.PhysicalAttack, //Crit, CB, Bleed, ReduceArmor
            TriggerAffixTypesEnum.ChainOrPierce
        ];
        var spellAttackTriggers = [
            TriggerAffixTypesEnum.SpellDebuff,    //Burn, Wither, Curse, Freeze, Root
            TriggerAffixTypesEnum.ChainOrPierce
        ];

        var physicalAoETriggers = [
            TriggerAffixTypesEnum.Cleave,
            TriggerAffixTypesEnum.PhysicalAoE,    //Knockback
        ];
        var ccPhysicalTriggers = [
            TriggerAffixTypesEnum.PhysicalCC      //Stun, Blind
        ];

        var spellcastTriggers = [TriggerAffixTypesEnum.CastSpell];

        if (type == TriggerStatsEnum.PhysicalAttack)
            triggerAffixes = physicalAttackTriggers;

        if (type == TriggerStatsEnum.SpellAttack)
            triggerAffixes = spellAttackTriggers;

        if (type == TriggerStatsEnum.PhysicalAoE)
            triggerAffixes = physicalAoETriggers;

        if (type == TriggerStatsEnum.CCPhysical)
            triggerAffixes = ccPhysicalTriggers;

        if (type == TriggerStatsEnum.Spellcast)
            triggerAffixes = spellcastTriggers;

        return triggerAffixes;
    }

// PhysicalAttack = 1,           //TriggerAffixes [1,2], 4 CCEffectTypesEnum[1,2]
// SpellAttack = 1,              //TA[6], CCET[5,6,8,9,10]
// PhysicalAoE = 2,              //TriggerAffixes [3, 6], 3 CCEffectTypesEnum[4,7]
// CCPhysical = 4,               //TA[3], CCET[3,4,7]
// Spellcast = 5,                //Cast a spell

    private GetAppropriateEffectsForAffix(type:TriggerAffixTypesEnum): CCEffectTypesEnum[] {
        var triggerAffixes:CCEffectTypesEnum[] = [];

        var physicalAttackTriggers:CCEffectTypesEnum[] = [
            CCEffectTypesEnum.CriticalHit,
            CCEffectTypesEnum.CrushingBlow,
            CCEffectTypesEnum.Bleed,
            CCEffectTypesEnum.ReduceArmor
        ];

        var physicalCCTriggers:CCEffectTypesEnum[] = [
            CCEffectTypesEnum.Stun,
            CCEffectTypesEnum.Blind
        ];

        var spellAttackTriggers:CCEffectTypesEnum[] = [
            CCEffectTypesEnum.Burn,
            CCEffectTypesEnum.Wither,
            CCEffectTypesEnum.Curse,
            CCEffectTypesEnum.Root,
            CCEffectTypesEnum.Freeze
        ];

        // PhysicalAoE
        var physicalAoETriggers:CCEffectTypesEnum[] = [
            CCEffectTypesEnum.Knockback,
        ];

        if (type == TriggerAffixTypesEnum.PhysicalAttack)
            triggerAffixes = physicalAttackTriggers;

        if (type == TriggerAffixTypesEnum.PhysicalCC)
            triggerAffixes = physicalCCTriggers;

        if (type == TriggerAffixTypesEnum.SpellDebuff)
            triggerAffixes = spellAttackTriggers;

        if (type == TriggerAffixTypesEnum.PhysicalAoE)
            triggerAffixes = physicalAoETriggers;
            
        return triggerAffixes;
    }    
}
