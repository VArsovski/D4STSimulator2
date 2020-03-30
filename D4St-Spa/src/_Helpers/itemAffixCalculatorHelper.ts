import { ItemRarityTypesEnum, AffixCategoryEnum, ItemAffixTypeEnum, OfensiveStatsEnum, DefensiveStatsEnum, BasicAffixEnum, TriggerStatsEnum, LegendaryStatsEnum, ItemCategoriesEnum, DamageTypesEnum, ItemWeaponTypesEnum, ItemArmorTypesEnum, ArmorTypesEnum, BasicStatsEnum, ResistanceTypesEnum } from "../_Enums/itemAffixEnums";
import { Helpers } from 'src/_Helpers/helpers';
import { SkillVM } from 'src/Models/SkillVM';
import { ItemAffixOutput } from 'src/Models/ItemAffixes/Details/ItemAffixOutput';
import { ItemBasicStats } from 'src/Models/ItemAffixes/Details/ItemBasicStats';
import { ItemArmorStats } from 'src/Models/ItemAffixes/Details/ItemArmorStats';
import { ItemDamageStats } from 'src/Models/ItemAffixes/Details/ItemDamageStats';
import { ItemOfensiveStats } from 'src/Models/ItemAffixes/Details/ItemOfensiveStats';
import { ItemDefensiveStats } from 'src/Models/ItemAffixes/Details/ItemDefensiveStats';

export class ItemAffixEnumsHelper {
    skillPool:SkillVM[]
    constructor(skillPool?:SkillVM[]) {
        this.skillPool = skillPool || [];
    }

    public GetRandomTypeByIndex(itemCategory:ItemCategoriesEnum, rarity:ItemRarityTypesEnum, affixType:ItemAffixTypeEnum):ItemAffixOutput {

        // 1, 4, 6, [L14]
        var basicStatAffixesCategory = [AffixCategoryEnum.IncreaseBasicStat
            , AffixCategoryEnum.IncreaseSkillStat
            , AffixCategoryEnum.ConditionalProcBasicAffix
        ];

        if (rarity == ItemRarityTypesEnum.Legendary)
            basicStatAffixesCategory.push(AffixCategoryEnum.AlterBasicAffixStat);

        var damageAffixesCategory = [AffixCategoryEnum.IncreaseTriggerStat
            , AffixCategoryEnum.IncreaseDamage
            , AffixCategoryEnum.ExtraDamageEffect
        ];

        // 2, [W3], [J5], 7, 8, 10
        var defensiveOrOfensiveStatAffixesCategory = [AffixCategoryEnum.IncreaseCastAffixStat
            , AffixCategoryEnum.ConditionalProcCastAffix
            , AffixCategoryEnum.ConditionalProcTriggerAffix
            , AffixCategoryEnum.ConditionalProcEffectAffix
        ];
        if (itemCategory == ItemCategoriesEnum.Jewelry) {
            defensiveOrOfensiveStatAffixesCategory.push(AffixCategoryEnum.IncreaseEffectStat);
        }
        if (itemCategory == ItemCategoriesEnum.Weapon) {
            defensiveOrOfensiveStatAffixesCategory.push(AffixCategoryEnum.IncreaseTriggerStat);
        }

        // 3, 5, 18, 19
        if (rarity == ItemRarityTypesEnum.Legendary) {
            defensiveOrOfensiveStatAffixesCategory.push(AffixCategoryEnum.IncreaseTriggerStat);
            defensiveOrOfensiveStatAffixesCategory.push(AffixCategoryEnum.IncreaseEffectStat);
            defensiveOrOfensiveStatAffixesCategory.push(AffixCategoryEnum.IncreaseDamage);
            defensiveOrOfensiveStatAffixesCategory.push(AffixCategoryEnum.ExtraDamageEffect);
        }

        // 11, 12, 13
        var triggerAffixesCategory = [
            AffixCategoryEnum.EmpowerProcTriggerAffixStat
            , AffixCategoryEnum.EmpowerProcSkillAffixStat
            , AffixCategoryEnum.EmpowerProcEffectAffixStat
        ]

        // 15, 16, 17, 18, 19
        var legendaryAffixesCategory = [
            AffixCategoryEnum.AlterProcTriggerAffixStat,
            AffixCategoryEnum.AlterProcSkillAffixStat,
            AffixCategoryEnum.AlterProcEffectAffixStat,
            AffixCategoryEnum.IncreaseDamage,
            AffixCategoryEnum.ExtraDamageEffect
        ];

        var affixData = new ItemAffixOutput();

        if (affixType == ItemAffixTypeEnum.Damage)
        {
            affixData.categoryStat = damageAffixesCategory[Helpers.getRandom(0, damageAffixesCategory.length-1)];
            affixData.damageStat =  new DamageAffixHelper().GetByIndex(Helpers.getRandom(1, 7), rarity).damageStat;
        }

        if (affixType == ItemAffixTypeEnum.Armor)
        {
            affixData.categoryStat = damageAffixesCategory[Helpers.getRandom(0, damageAffixesCategory.length-1)];
            affixData.armorStat =  new ArmorAffixHelper().GetByIndex(Helpers.getRandom(1, 5), rarity).armorStat;
        }

        if (affixType == ItemAffixTypeEnum.PowerUpSkill)
        {
            affixData.categoryStat = AffixCategoryEnum.IncreaseSkillStat;
            var basicAffix = new ItemBasicStats();
            basicAffix.SetSkill(this.skillPool[Helpers.getRandom(0, this.skillPool.length -1)]);
            affixData.basicStat = basicAffix;
        }
        else if (affixType == ItemAffixTypeEnum.BasicStat)
        {
            affixData.categoryStat = basicStatAffixesCategory[Helpers.getRandom(0, basicStatAffixesCategory.length-1)];
            affixData.basicStat = new BasicAffixHelper().GetByIndex(Helpers.getRandom(1, 7), rarity).basicStat;
        }
        
        if (affixType == ItemAffixTypeEnum.Offensive || affixType == ItemAffixTypeEnum.Defensive)
        {
            affixData.categoryStat = defensiveOrOfensiveStatAffixesCategory[Helpers.getRandom(0, defensiveOrOfensiveStatAffixesCategory.length-1)];
            if (affixType == ItemAffixTypeEnum.Offensive)
                affixData.ofensiveStat = new OfensiveAffixHelper().GetByIndex(Helpers.getRandom(1, 8), rarity).ofensiveStat;
            if (affixType == ItemAffixTypeEnum.Defensive)
                affixData.defensiveStat = new DefensiveAffixHelper().GetByIndex(Helpers.getRandom(1, 8), rarity).defensiveStat;
        }
        if (affixType == ItemAffixTypeEnum.TriggerEffect)
        {
            affixData.categoryStat = triggerAffixesCategory[Helpers.getRandom(0, triggerAffixesCategory.length-1)];
            affixData.triggerStat = new TriggerAffixHelper().GetByIndex(Helpers.getRandom(1, 6), rarity).triggerStat;
        }
        if (affixType == ItemAffixTypeEnum.Legendary)
        {
            affixData.categoryStat = legendaryAffixesCategory[Helpers.getRandom(0, legendaryAffixesCategory.length-1)];
            affixData.legendaryStat = new LegendaryAffixHelper().GetByIndex(Helpers.getRandom(1, 12), rarity).legendaryStat;
        }
    
        return affixData;
    }

    public GetPrimaryItemAffix(itemCategory:ItemCategoriesEnum, rarity:ItemRarityTypesEnum, affixType:ItemAffixTypeEnum):ItemAffixOutput {
        var affixData = new ItemAffixOutput();
        if (affixType == ItemAffixTypeEnum.Armor)
        {
            affixData.categoryStat = AffixCategoryEnum.PrimaryArmor;
            affixData.armorStat = new BasicAffixHelper().GetByIndex(2, rarity).armorStat;
        }
        if (affixType == ItemAffixTypeEnum.Damage)
        {
            affixData.categoryStat = AffixCategoryEnum.PrimaryDamage;
            var damageStat = new DamageAffixHelper().GetByIndex(Helpers.getRandom(1, 6), rarity).damageStat;
            affixData.damageStat = damageStat;
        }
        return affixData;
    }
}

export interface IItemAffixHelper {
    GetByIndex(index:number, rarity:ItemRarityTypesEnum):ItemAffixOutput;
}

export class AffixCategoryHelper {
    public GetByIndex(index:number, rarity:ItemRarityTypesEnum):ItemAffixOutput {
        var result = null;
        var delimiter = rarity == ItemRarityTypesEnum.Legendary ? 19 : 13;
    
        var selected = index % delimiter == 1 ? AffixCategoryEnum.IncreaseBasicStat
        : index % delimiter == 2 ? AffixCategoryEnum.IncreaseCastAffixStat
        : index % delimiter == 3 ? AffixCategoryEnum.IncreaseTriggerStat
        : index % delimiter == 4 ? AffixCategoryEnum.IncreaseSkillStat
        : index % delimiter == 5 ? AffixCategoryEnum.IncreaseEffectStat
        : index % delimiter == 6 ? AffixCategoryEnum.ConditionalProcBasicAffix
        : index % delimiter == 7 ? AffixCategoryEnum.ConditionalProcCastAffix
        : index % delimiter == 8 ? AffixCategoryEnum.ConditionalProcTriggerAffix
        : index % delimiter == 9 ? AffixCategoryEnum.ConditionalSkillTriggerAffix
        : index % delimiter == 10 ? AffixCategoryEnum.ConditionalProcEffectAffix
        // Legendary Secondary
        : index % delimiter == 11 ? AffixCategoryEnum.EmpowerProcTriggerAffixStat
        : index % delimiter == 12 ? AffixCategoryEnum.EmpowerProcSkillAffixStat
        : index % delimiter == 13 ? AffixCategoryEnum.EmpowerProcEffectAffixStat
        // LegendaryOnly
        : index % delimiter == 14 ? AffixCategoryEnum.AlterBasicAffixStat
        : index % delimiter == 15 ? AffixCategoryEnum.AlterProcTriggerAffixStat
        : index % delimiter == 16 ? AffixCategoryEnum.AlterProcSkillAffixStat
        : index % delimiter == 17 ? AffixCategoryEnum.AlterProcEffectAffixStat
        : index % delimiter == 18 ? AffixCategoryEnum.IncreaseDamage
        : AffixCategoryEnum.ExtraDamageEffect;
    
        return new ItemAffixOutput(selected);
    }
}

export class ArmorAffixHelper {
    public GetByIndex(index:number, rarity:ItemRarityTypesEnum):ItemAffixOutput {

        var selected = Helpers.getRandom(1, 3);
        // var selected = index % delimiter == 1 ? ArmorTypesEnum.HeavyArmor
        // : index % delimiter == 2 ? ArmorTypesEnum.LightArmor
        // : ArmorTypesEnum.MysticArmor;
    
        var armorStat = new ItemArmorStats(null, null, null, selected).GetBasicArmorStats(Helpers.getRandom(1, 5), selected);
        return new ItemAffixOutput(null, armorStat);
    }
}

export class DamageAffixHelper {
    public GetByIndex(index:number, rarity:ItemRarityTypesEnum):ItemAffixOutput {
        var delimiter = 7;

        var selected = index % delimiter == 1 ? DamageTypesEnum.Physical
        : index % delimiter == 2 ? DamageTypesEnum.FreezeStun
        : index % delimiter == 3 ? DamageTypesEnum.BleedOrArmorReduction
        : index % delimiter == 4 ? DamageTypesEnum.PoisonOrBurn
        : index % delimiter == 5 ? DamageTypesEnum.KnockbackOrRoot
        : index % delimiter == 6 ? DamageTypesEnum.ChainOrPierceAttack
        : DamageTypesEnum.SpellOrSummon;
    
        var damageAffix = new ItemDamageStats(null, selected).GetBasicWeaponStats(null, selected);
        return new ItemAffixOutput(null, null, damageAffix);
    }
}

export class BasicAffixHelper {
    public GetByIndex(index:number, level?:number):ItemAffixOutput {
        var delimiter = 6;

        var selected:BasicAffixEnum;
        var basicAffix:ItemBasicStats = new ItemBasicStats();
        if (index % delimiter == 1) {
            var amount = 4;
            var bonus = parseInt(((level || 1) * Helpers.getRandom(40, 60)/100).toString(), 10);
            if (isNaN(bonus)) bonus = 0;
            selected = BasicAffixEnum.IncreaseBasicPower;
            basicAffix.SetPowers(amount, Helpers.getRandom(1,3));
        }
        if (index % delimiter == 2) {
            var amount = 4;
            var bonus = parseInt(((level || 1) * Helpers.getRandom(80, 120)/100).toString(), 10);
            if (isNaN(bonus)) bonus = 0;
            selected = BasicAffixEnum.IncreaseBasicStat;
            basicAffix.SetBasicStat(amount, Helpers.getRandom(1,4));
        }
        if (index % delimiter == 3) {
            var regenFactor = level / 4;
            var amount = 1;
            var bonus = parseInt((regenFactor * Helpers.getRandom(50, 80)/100).toString(), 10);
            if (isNaN(bonus)) bonus = 0;
            selected = BasicAffixEnum.IncreaseStatRegen;
            basicAffix.SetBasicStat(amount, Helpers.getRandom(1,3));
        }
        if (index % delimiter == 4) {
            var resusFactor = level / 4;
            var amount = 4;
            var bonus = parseInt((resusFactor * Helpers.getRandom(60, 80)/100).toString(), 10);
            if (isNaN(bonus)) bonus = 0;
            selected = BasicAffixEnum.IncreaseResistance;
            var selectedRes = Helpers.getRandom(1,6);
            if (selectedRes == 6)
                amount = ((amount * Helpers.getRandom(50, 75)/100).toString(), 10);

            basicAffix.SetResistance(amount, selectedRes);
        }
        if (index % delimiter == 5) {
            selected = BasicAffixEnum.IncreaseSkillStat;
        }
        if (index % delimiter == 0) {
            selected = BasicAffixEnum.Socket;
            basicAffix.SetSocket();
        }

        return new ItemAffixOutput(null, null, null, basicAffix);
    }
}

export class OfensiveAffixHelper {
    public GetByIndex(index:number, level?:number):ItemAffixOutput {
        var delimiter = 8;

        var selected = index % delimiter == 1 ? OfensiveStatsEnum.CleaveAndAoE
        : index % delimiter == 2 ? OfensiveStatsEnum.PoisonAndBurn
        : index % delimiter == 3 ? OfensiveStatsEnum.ArmorReductionAndBleed
        : index % delimiter == 4 ? OfensiveStatsEnum.FreezeAndStun
        : index % delimiter == 5 ? OfensiveStatsEnum.KnockbackAndRoot
        : index % delimiter == 6 ? OfensiveStatsEnum.ChainAndPierce
        : index % delimiter == 7 ? OfensiveStatsEnum.CastAndProjectileRange
        : OfensiveStatsEnum.Socket;
    
        var rand = Helpers.getRandom(1, 10);
        var amountVariance = 4 + level / 2 + Helpers.getRandom(-3, +3);
        var percentageVariance = 14 + level + Helpers.getRandom(-10, +10);

        var amount = rand % 2 == 0 ? amountVariance : 0;
        var amountPercentage = rand % 2 != 0 ? percentageVariance : 0;
        var ofensiveStatsData = new ItemOfensiveStats(amount, amountPercentage, selected);

        return new ItemAffixOutput(null, null, null, null, ofensiveStatsData);
    }
}

export class DefensiveAffixHelper {
    public GetByIndex(index:number, level?:number):ItemAffixOutput {
        var delimiter = 8;

        var selected = index % delimiter == 1 ? DefensiveStatsEnum.CCEffects //Chance%Duration
        : index % delimiter == 2 ? DefensiveStatsEnum.PotionAndGlobe //Bonus
        : index % delimiter == 3 ? DefensiveStatsEnum.DamageTaken    //Reduction
        : index % delimiter == 4 ? DefensiveStatsEnum.AttacksTaken   //Reduction
        : index % delimiter == 5 ? DefensiveStatsEnum.ThornsDamage
        : index % delimiter == 6 ? DefensiveStatsEnum.DamageStaggered
        : index % delimiter == 7 ? DefensiveStatsEnum.LifestealOrShielding
        : DefensiveStatsEnum.Socket;
    
        var rand = Helpers.getRandom(1, 10);
        var amountVariance = 4 + level / 2 + Helpers.getRandom(-3, +3);
        var percentageVariance = 14 + level + Helpers.getRandom(-10, +10);
        var chance = 8 + level / 4 + Helpers.getRandom(-6, +6);
        var durationNum = 3 + (level / 10 + (Helpers.getRandom(-10, +10)/10));
        var duration = Math.round(durationNum * 10) / 10;

        var amount = rand % 2 == 0 ? amountVariance : 0;
        var amountPercentage = rand % 2 != 0 ? percentageVariance : 0;
        var defensiveStatsData = new ItemDefensiveStats(amount, amountPercentage, chance, duration, selected);
       
        
        // defensiveStatsData.PowerUp();

        return new ItemAffixOutput(null, null, null, null, null, defensiveStatsData);
    }
}

export class TriggerAffixHelper {
    public GetByIndex(index:number, level?:number):ItemAffixOutput {
        var delimiter = 6;

        var selected = index % delimiter == 1 ? TriggerStatsEnum.ProcCleaveOrAoEEffect
        : index % delimiter == 2 ? TriggerStatsEnum.ProcPoisonOrBurnEffect
        : index % delimiter == 3 ? TriggerStatsEnum.ProcArmorReductionAndBleed
        : index % delimiter == 4 ? TriggerStatsEnum.ProcFreezeStunAttack
        : index % delimiter == 5 ? TriggerStatsEnum.ProcRandomSpellAttack
        : TriggerStatsEnum.ProcChainOrPierceAttack;
    
        return new ItemAffixOutput(null, null, null, null, null, null, selected);
    }
}

export class LegendaryAffixHelper {
    public GetByIndex(index:number, level?:number):ItemAffixOutput {
        var delimiter = 12;

        var selected = index % delimiter == 1 ? LegendaryStatsEnum.AlternateCleaveOrAoEEffect
        : index % delimiter == 2 ? LegendaryStatsEnum.AlternatePoisonOrBurnEffect
        : index % delimiter == 3 ? LegendaryStatsEnum.AlternateArmorReductionAndBleed
        : index % delimiter == 4 ? LegendaryStatsEnum.AlternateFreezeStunAttack
        : index % delimiter == 5 ? LegendaryStatsEnum.AlternateRandomSpellAttack
        : index % delimiter == 6 ? LegendaryStatsEnum.AlternateChainOrPierceAttack
        : index % delimiter == 7 ? LegendaryStatsEnum.AlternateBasicStats
        : index % delimiter == 8 ? LegendaryStatsEnum.AlternateCCEffectDuration
        : index % delimiter == 9 ? LegendaryStatsEnum.AlternateCCEffectDamageTaken
        : index % delimiter == 10 ? LegendaryStatsEnum.AlternateDamageTypeTaken
        : index % delimiter == 11 ? LegendaryStatsEnum.AlternateAttackTypeTaken
        : LegendaryStatsEnum.AlternateLifestealOrShielding;
    
        return new ItemAffixOutput(null, null, null, null, null, null, null, selected);
    }
}
