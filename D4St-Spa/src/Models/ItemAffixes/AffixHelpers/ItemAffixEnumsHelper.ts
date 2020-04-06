import { ItemCategoriesEnum, ItemRarityTypesEnum, ItemAffixTypeEnum, AffixCategoryEnum, BasicStatsEnum, ItemArmorTypesEnum } from 'src/_Enums/itemAffixEnums';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { LegendaryAffixHelper } from './LegendaryAffixHelper';
import { DefensiveAffixHelper } from './DefensiveAffixHelper';
import { OfensiveAffixHelper } from './OfensiveAffixHelper';
import { ItemBasicStats, BasicStatTypesEnum } from '../Details/ItemBasicStats';
import { TriggerAffixHelper } from './TriggerAffixHelper';
import { DamageAffixHelper } from './DamageAffixHelper';
import { BasicAffixHelper } from './BasicAffixHelper';
import { ArmorAffixHelper } from './ArmorAffixHelper';
import { Helpers } from 'src/_Helpers/helpers';
import { SkillVM } from 'src/Models/SkillVM';
import { ItemAffix } from '../ItemAffix';
import { SecondaryTriggerAffixHelper } from './SecondaryAffixCategoryHelper';

export class ItemAffixEnumsHelper {
    skillPool:SkillVM[]
    constructor(skillPool?:SkillVM[]) {
        this.skillPool = skillPool || [];
    }

    public GetRandomTypeByIndex(level: number, powerLevel:number, rarity:ItemRarityTypesEnum, affix:ItemAffix):ItemAffixOutput {

        // 1, 4, 6, [L14]
        var basicStatAffixesCategory = [AffixCategoryEnum.IncreaseBasicStat
            , AffixCategoryEnum.IncreaseSkillStat
            , AffixCategoryEnum.ConditionalProcBasicAffix
        ];

        if (rarity == ItemRarityTypesEnum.Legendary)
            basicStatAffixesCategory.push(AffixCategoryEnum.AlterBasicAffixStat);

        var damageAffixesCategory = [AffixCategoryEnum.IncreaseTriggerStat
            , AffixCategoryEnum.ExtraDamageEffect
            , AffixCategoryEnum.IncreaseDamage
        ];

        // 2, [W3], [J5], 7, 8, 10
        var defensiveOrOfensiveStatAffixesCategory = [AffixCategoryEnum.IncreaseCastAffixStat
            , AffixCategoryEnum.ConditionalProcCastAffix
            , AffixCategoryEnum.ConditionalProcTriggerAffix
            , AffixCategoryEnum.ConditionalProcEffectAffix
        ];
        if (affix.ItemCategory == ItemCategoriesEnum.Jewelry) {
            defensiveOrOfensiveStatAffixesCategory.push(AffixCategoryEnum.IncreaseEffectStat);
        }
        if (affix.ItemCategory == ItemCategoriesEnum.Weapon) {
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

        // ExtraDamageEffect, IncreaseDamage, IncreaseTriggerStat, ConditionalProcBasicAffix, ConditionalProcCastAffix, ConditionalSkillTriggerAffix
        var secondaryTriggerCategory = [
            AffixCategoryEnum.ConditionalProcBasicAffix,
            AffixCategoryEnum.ConditionalProcCastAffix,
            AffixCategoryEnum.ConditionalProcEffectAffix,
            AffixCategoryEnum.ConditionalProcTriggerAffix,
            AffixCategoryEnum.ConditionalSkillTriggerAffix
        ];

        // 15, 16, 17, 18, 19
        var legendaryAffixesCategory = [
            AffixCategoryEnum.AlterProcTriggerAffixStat,
            AffixCategoryEnum.AlterProcSkillAffixStat,
            AffixCategoryEnum.AlterProcEffectAffixStat,
            AffixCategoryEnum.IncreaseDamage,
            AffixCategoryEnum.ExtraDamageEffect
        ];

        var affixData = new ItemAffixOutput();
        var affixType = affix.AffixType;

        if (affixType == ItemAffixTypeEnum.Damage)
        {
            var skipPrimaryDamageNumbers = affix.ItemCategory != ItemCategoriesEnum.Weapon;
            var skipDamageEffectEmpower = affix.ItemCategory == ItemCategoriesEnum.Weapon;
            affixData.categoryStat = damageAffixesCategory[Helpers.getRandom(0, damageAffixesCategory.length-1)];
            affixData.damageStat =  new DamageAffixHelper().GetByIndex(level, powerLevel, Helpers.getRandom(1, 7), Helpers.getRandom(1, 5), skipPrimaryDamageNumbers, skipDamageEffectEmpower).damageStat;
        }

        if (affixType == ItemAffixTypeEnum.Armor)
        {
            affixData.categoryStat = damageAffixesCategory[Helpers.getRandom(0, damageAffixesCategory.length-1)];
            affixData.armorStat =  new ArmorAffixHelper().GetByIndex(level, powerLevel, Helpers.getRandom(1, 5), Helpers.getRandom(1, 3)).armorStat;
            if (affix.ItemCategory != ItemCategoriesEnum.Armor || affix.AffixCategory != AffixCategoryEnum.PrimaryArmor)
                affixData.armorStat.Armor = Math.round((Helpers.getRandom(30, 45) + level/8)/100 * affixData.armorStat.Armor);
        }

        if (affixType == ItemAffixTypeEnum.PowerUpSkill)
        {
            affixData.categoryStat = AffixCategoryEnum.IncreaseSkillStat;
            var basicAffix = new ItemBasicStats(level, powerLevel);
            basicAffix.SetSkill(level, this.skillPool[Helpers.getRandom(0, this.skillPool.length -1)]);
            affixData.basicStat = basicAffix;
        }
        else if (affixType == ItemAffixTypeEnum.BasicStat)
        {
            affixData.categoryStat = basicStatAffixesCategory[Helpers.getRandom(0, basicStatAffixesCategory.length-1)];
            var selectedBasicStatType = Helpers.getRandom(1, 7);
            var amount = selectedBasicStatType == 6 ? Helpers.getRandom(3,5)
            : selectedBasicStatType != 3 ? Helpers.getRandom(2, 4) : 1;
            var selectedSkill = this.skillPool[Helpers.getRandom(0, this.skillPool.length -1)];

            affixData.basicStat = new BasicAffixHelper().GetByIndex(level, powerLevel, selectedBasicStatType, amount, selectedSkill).basicStat;
            if (selectedBasicStatType == BasicStatTypesEnum.SkillEmpower)
                affixData.basicStat.SetSkill(level, this.skillPool[Helpers.getRandom(0, this.skillPool.length -1)]);
        }
        
        if (affixType == ItemAffixTypeEnum.Offensive || affixType == ItemAffixTypeEnum.Defensive)
        {
            affixData.categoryStat = defensiveOrOfensiveStatAffixesCategory[Helpers.getRandom(0, defensiveOrOfensiveStatAffixesCategory.length-1)];
            if (affixType == ItemAffixTypeEnum.Offensive)
                affixData.ofensiveStat = new OfensiveAffixHelper().GetByIndex(level, powerLevel, Helpers.getRandom(1, 8)).ofensiveStat;
            else //if (affixType == ItemAffixTypeEnum.Defensive)
                affixData.defensiveStat = new DefensiveAffixHelper().GetByIndex(level, powerLevel, Helpers.getRandom(1, 8)).defensiveStat;
        }
        if (affixType == ItemAffixTypeEnum.TriggerEffect)
        {
            // // TODO: Next make Trigger Stats calculate properly
            affixData.categoryStat = triggerAffixesCategory[Helpers.getRandom(0, triggerAffixesCategory.length-1)];
            var selectedTrigger = Helpers.getRandom(1, 5);
            var chance = Helpers.getRandom(3,4);
            var amount = Helpers.getRandom(3,4);
            var availableSkills:SkillVM[] = [];
            this.skillPool.forEach(s => {if (s.tier * 6 >= level) availableSkills.push(s)});
            affixData.triggerStat = new TriggerAffixHelper().GetByIndex(level, powerLevel, amount, chance, Helpers.getRandom(1, 5), availableSkills[Helpers.getRandom(0, availableSkills.length -1)]).triggerStat;
        }
        if (affixType == ItemAffixTypeEnum.SecondaryTriggers)
        {
            // // TODO: Next make Trigger Stats calculate properly
            affixData.categoryStat = secondaryTriggerCategory[Helpers.getRandom(0, secondaryTriggerCategory.length-1)];
            var selectedTrigger = Helpers.getRandom(1, 4);
            var amount = new CalculationsHelper().getTriggerStatsForLevel(Helpers.getRandom(3,4), level, powerLevel, selectedTrigger);
            var triggerStat = new TriggerAffixHelper().GetByIndex(level, powerLevel, amount, 0, selectedTrigger, this.skillPool[Helpers.getRandom(0, this.skillPool.length -1)]).triggerStat;

            var chanceSec = new CalculationsHelper().getTriggerChanceForLevel(Helpers.getRandom(10,15), level, powerLevel);
            var amountSec = new CalculationsHelper().getSecondaryTriggerStatForLevel(Helpers.getRandom(4, 6), level, powerLevel);
            var duration = Helpers.getRandom(3, 5);
            affixData.secondaryTriggerStat = new SecondaryTriggerAffixHelper().GetByIndex(level, powerLevel, amountSec, chanceSec, duration, selectedTrigger, triggerStat).secondaryTriggerStat;
        }
        if (affixType == ItemAffixTypeEnum.Legendary)
        {
            affixData.categoryStat = legendaryAffixesCategory[Helpers.getRandom(0, legendaryAffixesCategory.length-1)];
            affixData.legendaryStat = new LegendaryAffixHelper().GetByIndex(level, powerLevel, Helpers.getRandom(1, 12)).legendaryStat;
            // // TODO: Next make Legendary Stats calculate properly
        }
    
        return affixData;
    }

    public GetPrimaryItemAffix(level:number, powerLevel:number, itemCategory:ItemCategoriesEnum, rarity:ItemRarityTypesEnum, affix:ItemAffix):ItemAffixOutput {
        var affixData = new ItemAffixOutput();
        if (affix.AffixType == ItemAffixTypeEnum.Armor)
        {
            affixData.categoryStat = AffixCategoryEnum.PrimaryArmor;
            affixData.armorStat = new ArmorAffixHelper().GetByIndex(level, powerLevel, Helpers.getRandom(1, 5), Helpers.getRandom(1, 3)).armorStat;
        }
        if (affix.AffixType == ItemAffixTypeEnum.Damage)
        {
            affixData.categoryStat = AffixCategoryEnum.PrimaryDamage;
            var omitPrimaryDamageNumbers = itemCategory != ItemCategoriesEnum.Weapon;
            var omitEmpowerPercentage = affix.AffixCategory != AffixCategoryEnum.PrimaryDamage;
            var damageStat = new DamageAffixHelper().GetByIndex(level, powerLevel, Helpers.getRandom(1, 7), Helpers.getRandom(1, 5), omitPrimaryDamageNumbers, omitEmpowerPercentage).damageStat;
            affixData.damageStat = damageStat;
        }

        return affixData;
    }
}

export interface IItemAffixHelper {
    GetByIndex(index:number, rarity:ItemRarityTypesEnum):ItemAffixOutput;
}
