import { ItemCategoriesEnum, ItemRarityTypesEnum, ItemAffixTypeEnum, AffixCategoryEnum, ResistanceTypesEnum, ItemWeaponTypesEnum, DamageTypesEnum, BasicStatTypesEnum } from 'src/_Enums/itemAffixEnums';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { LegendaryAffixHelper } from './LegendaryAffixHelper';
import { DefensiveAffixHelper } from './DefensiveAffixHelper';
import { OfensiveAffixHelper } from './OfensiveAffixHelper';
import { ItemBasicStats } from '../Details/ItemBasicStats';
import { TriggerAffixHelper } from './TriggerAffixHelper';
import { DamageAffixHelper } from './DamageAffixHelper';
import { BasicAffixHelper } from './BasicAffixHelper';
import { ArmorAffixHelper } from './ArmorAffixHelper';
import { Helpers } from 'src/_Helpers/helpers';
import { SkillVM } from 'src/Models/SkillVM';
import { ItemAffix } from '../ItemAffix';
import { SecondaryTriggerAffixHelper } from './SecondaryAffixCategoryHelper';
import { ItemTriggerStats } from '../Details/ItemTriggerStats';
import { SecondaryTriggerStatsEnum } from 'src/_Enums/triggerAffixEnums';
import { IItemAffix } from '../IItemAffix';
import { ItemDamageStats } from '../Details/ItemDamageStats';

export class ItemAffixEnumsHelper {
    skillPool:SkillVM[]
    constructor(skillPool?:SkillVM[]) {
        this.skillPool = skillPool || [];
    }

    public GetRandomTypeByIndex(itemType:ItemCategoriesEnum, level: number, powerLevel:number, rarity:ItemRarityTypesEnum, affix:ItemAffix, selectedSkill:SkillVM):ItemAffixOutput {

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

        var affixOutput:ItemAffixOutput = new ItemAffixOutput(affix.AffixCategory, null);
        var affixType = affix.AffixType;
        var availableSkills:SkillVM[] = [];
        this.skillPool.forEach(s => {if (s.tier * 6 >= level) availableSkills.push(s)});

        var damageCategory = damageAffixesCategory[Helpers.getRandom(0, damageAffixesCategory.length-1)];
        var armorCategory = basicStatAffixesCategory[Helpers.getRandom(0, basicStatAffixesCategory.length-1)];
        var powerUpCategory = AffixCategoryEnum.IncreaseSkillStat;
        var basicCategory = basicStatAffixesCategory[Helpers.getRandom(0, basicStatAffixesCategory.length-1)];
        var ofensiveOrDefensiveCategory = defensiveOrOfensiveStatAffixesCategory[Helpers.getRandom(0, defensiveOrOfensiveStatAffixesCategory.length-1)];
        var triggerCategory = triggerAffixesCategory[Helpers.getRandom(0, triggerAffixesCategory.length-1)];
        var secondaryCategory = secondaryTriggerCategory[Helpers.getRandom(0, secondaryTriggerCategory.length-1)];
        var legendaryCategory = legendaryAffixesCategory[Helpers.getRandom(0, legendaryAffixesCategory.length-1)];

        var selectedCategory = affixType == ItemAffixTypeEnum.Damage ? damageCategory
        : affixType == ItemAffixTypeEnum.Armor ? armorCategory
        : affixType == ItemAffixTypeEnum.PowerUpSkill ? powerUpCategory
        : affixType == ItemAffixTypeEnum.BasicStat ? basicCategory
        : affixType == (ItemAffixTypeEnum.Offensive || ItemAffixTypeEnum.Defensive) ? ofensiveOrDefensiveCategory
        : affixType == ItemAffixTypeEnum.TriggerEffect ? triggerCategory
        : affixType == ItemAffixTypeEnum.SecondaryTrigger ? secondaryCategory
        : legendaryCategory;

        affix.AffixCategory = selectedCategory;

        // TODO: Check if some of the following appear not appropriate
        // IncreaseBasicStat (BasicStat),
        // ExtraDamageEffect (Damage),
        // IncreaseTriggerStat (Damage),
        // IncreaseSkillStat (BasicStat),
        // ConditionalProcTriggerAffix (Defensive),
        // ConditionalProcCastAffix (BasicStat),
        // ConditionalProcBasicAffix (BasicStat)
        // AlterBasicAffixStat (BasicStat)
        
        // ExtraDamageEffect (Damage),
        // IncreaseDamage (Damage),
        // IncreaseTriggerStat (Damage),
        if (affixType == ItemAffixTypeEnum.Damage || affix.AffixCategory == AffixCategoryEnum.IncreaseDamage)
            affixOutput = this.GetDamageAffixFromCategoryStats(level, powerLevel, affixType, itemType, affix);
        if (affixType == ItemAffixTypeEnum.Armor)
            affixOutput = this.GetArmorAffixFromCategoryStats(level, powerLevel, affixType, itemType, affix);

        if (affixType == ItemAffixTypeEnum.PowerUpSkill)
            affixOutput = this.GetSkillAffixFromCategoryStats(level, powerLevel, affixType, itemType, affix, selectedSkill);
        else if (affixType == ItemAffixTypeEnum.BasicStat)
            affixOutput = this.GetBasicAffixFromCategoryStats(level, powerLevel, affixType, itemType, affix, selectedSkill);

        if (affixType == ItemAffixTypeEnum.Offensive)
            affixOutput = new OfensiveAffixHelper().GetByIndex(ofensiveOrDefensiveCategory, level, powerLevel, Helpers.getRandom(1, 8));
        else if (affixType == ItemAffixTypeEnum.Defensive)
            affixOutput = new DefensiveAffixHelper().GetByIndex(ofensiveOrDefensiveCategory, level, powerLevel, Helpers.getRandom(1, 8));

        if (affixType == ItemAffixTypeEnum.TriggerEffect)
            affixOutput = this.GetTriggrAffixFromCategoryStats(level, powerLevel, affixType, itemType, affix, selectedSkill);
        if (affixType == ItemAffixTypeEnum.SecondaryTrigger)
            affixOutput = this.GetSecondaryTriggrAffixFromCategoryStats(level, powerLevel, affixType, itemType, affix, selectedSkill);

        if (affixType == ItemAffixTypeEnum.Legendary)
            affixOutput = new LegendaryAffixHelper().GetByIndex(legendaryCategory, level, powerLevel, Helpers.getRandom(1, 12));//.legendaryStat;

        var affixIsEmpty = !affixOutput.AffixData;
        if (affixIsEmpty) {
            debugger;
            var amount = Helpers.getRandom(3, 4);
            var amountSec = new CalculationsHelper().getSecondaryTriggerStatForLevel(Helpers.getRandom(2, 3), level, powerLevel);
            var secondaryEffectsPowerLevel = powerLevel + Helpers.getRandom(2, 4);
    
            if (affix.AffixCategory == AffixCategoryEnum.IncreaseDamage)
                affixOutput =  this.GetDamageAffixFromStats(damageCategory, level, powerLevel, Helpers.getRandom(1, 7), Helpers.getRandom(1, 5), Helpers.getRandom(3, 4), true, false);
            if (affixOutput.CategoryStat == AffixCategoryEnum.ConditionalProcTriggerAffix) {
                // // TODO: Gain X when X
            }
            if (affixOutput.CategoryStat == AffixCategoryEnum.IncreaseTriggerStat) {
                affixOutput = new TriggerAffixHelper().GetByIndex(triggerCategory, level, secondaryEffectsPowerLevel, amount, 0, Helpers.getRandom(1, 5), availableSkills[Helpers.getRandom(0, availableSkills.length -1)]);
                if (affixType == ItemAffixTypeEnum.Legendary) affixType = ItemAffixTypeEnum.TriggerEffect;
            }
            if (affixOutput.CategoryStat == AffixCategoryEnum.ExtraDamageEffect) {
                // 1-4 (instead of 1-5) cause we don't want to empower specific skill usage with an elemental damage, very specific usage
                var triggerStat = new TriggerAffixHelper().GetByIndex(triggerCategory, level, secondaryEffectsPowerLevel, amount, 0, Helpers.getRandom(1, 4), availableSkills[Helpers.getRandom(0, availableSkills.length -1)]);
                affixOutput = new SecondaryTriggerAffixHelper().GetByIndex(secondaryCategory, level, secondaryEffectsPowerLevel, amountSec, 0, 0, SecondaryTriggerStatsEnum.AddElementalDamage, triggerStat.AffixData as ItemTriggerStats, Helpers.getRandom(1, 5));
                if (affixType == ItemAffixTypeEnum.Legendary) affixType = ItemAffixTypeEnum.SecondaryTrigger;
            }
        }
    
        return affixOutput;
    }
    GetSecondaryTriggrAffixFromCategoryStats(level: number, powerLevel: number, affixType: ItemAffixTypeEnum, itemType: ItemCategoriesEnum, affix: ItemAffix, selectedSkill: SkillVM): ItemAffixOutput {
        var selectedTrigger = Helpers.getRandom(1, 4);
        var amount = new CalculationsHelper().getTriggerStatsForLevel(Helpers.getRandom(3,4), level, powerLevel, selectedTrigger);
        var triggerStat = new TriggerAffixHelper().GetByIndex(affix.AffixCategory, level, powerLevel, amount, 0, selectedTrigger, selectedSkill);
        var chanceSec = new CalculationsHelper().getTriggerChanceForLevel(Helpers.getRandom(10,15), level, powerLevel);
        var amountSec = new CalculationsHelper().getSecondaryTriggerStatForLevel(Helpers.getRandom(4, 6), level, powerLevel);
        var duration = Helpers.getRandom(3, 5);
        var affixOutput = new SecondaryTriggerAffixHelper().GetByIndex(affix.AffixCategory, level, powerLevel, amountSec, chanceSec, duration, selectedTrigger, triggerStat.AffixData as ItemTriggerStats);
        return affixOutput;
}

    public GetPrimaryItemAffix(category:AffixCategoryEnum, itemType:ItemCategoriesEnum, level:number, powerLevel:number, rarity:ItemRarityTypesEnum, affix:ItemAffix):ItemAffixOutput {
        var affixData:ItemAffixOutput = new ItemAffixOutput(null, null);
        if (affix.AffixType == ItemAffixTypeEnum.Armor)
        {
            affixData.CategoryStat = AffixCategoryEnum.PrimaryArmor;
            affixData = new ArmorAffixHelper().GetByIndex(category, level, powerLevel, Helpers.getRandom(1, 5), Helpers.getRandom(1, 3));//.armorStat;
        }
        if (affix.AffixType == ItemAffixTypeEnum.Damage)
        {
            affixData.CategoryStat = AffixCategoryEnum.PrimaryDamage;
            var addPrimary = itemType == ItemCategoriesEnum.Weapon && affix.AffixCategory == AffixCategoryEnum.PrimaryDamage;
            var addEmpower = (affix.AffixType == ItemAffixTypeEnum.Damage && itemType != ItemCategoriesEnum.Weapon) || (itemType == ItemCategoriesEnum.Weapon && affix.AffixCategory == AffixCategoryEnum.PrimaryDamage);

            var damageStat = this.GetDamageAffixFromStats(category, level, powerLevel, Helpers.getRandom(1, 7), Helpers.getRandom(1, 5), ResistanceTypesEnum.Physical, addPrimary, addEmpower);
            affixData = damageStat;
        }

        return affixData;
    }

    //# region Private AffixOutput Creation Methods

    private GetDamageAffixFromCategoryStats(level:number, powerLevel:number, affixType: ItemAffixTypeEnum, itemType: ItemCategoriesEnum, affix: IItemAffix): ItemAffixOutput {
        var affixOutput:ItemAffixOutput = new ItemAffixOutput(affix.AffixCategory, null);

        var addPrimaryDamageFactor = itemType == ItemCategoriesEnum.Weapon ? 2 : itemType == ItemCategoriesEnum.Armor ? 17 : 5; // Add Primary damage more often on weapons and much less often on Armor
        var primaryRoll = Helpers.getRandom(1, 100) % addPrimaryDamageFactor == 0;
        var addPrimary = affix.AffixCategory == AffixCategoryEnum.PrimaryDamage || primaryRoll;
        var addEmpower = affix.AffixCategory == AffixCategoryEnum.PrimaryDamage || !primaryRoll; // ((affixType == ItemAffixTypeEnum.Damage && itemType != ItemCategoriesEnum.Weapon) || (itemType == ItemCategoriesEnum.Weapon && affix.AffixCategory == AffixCategoryEnum.PrimaryDamage)) || !addPrimary;
        affixOutput = this.GetDamageAffixFromStats(affix.AffixCategory, level, powerLevel, Helpers.getRandom(1, 7), Helpers.getRandom(1, 5), Helpers.getRandom(1, 5), addPrimary, addEmpower);

        // Reduce damage if not primary by some factor
        if (affix.AffixCategory != AffixCategoryEnum.PrimaryDamage) {
            var levelFactorMin = Helpers.getRandom(3, (40 + level)/10);
            var levelFactorMax = Helpers.getRandom(3, (40 + level)/10);
            var factorMin = Math.round((Helpers.getRandom(40, 60) + Helpers.getRandom(-5, 5) - levelFactorMin)/10)/10;
            var factorMax = Math.round((Helpers.getRandom(40, 60) + Helpers.getRandom(-5, 5) - levelFactorMax)/10)/10;
            (affixOutput.AffixData as ItemDamageStats).SetDamageFactor(factorMin, "Min");
            (affixOutput.AffixData as ItemDamageStats).SetDamageFactor(factorMax, "Max");
        }

        return affixOutput;
    }

    private GetArmorAffixFromCategoryStats(level:number, powerLevel:number, affixType: ItemAffixTypeEnum, itemType: ItemCategoriesEnum, affix: IItemAffix): ItemAffixOutput {
        var affixOutput:ItemAffixOutput = new ArmorAffixHelper().GetByIndex(affix.AffixCategory, level, powerLevel, Helpers.getRandom(1, 5), Helpers.getRandom(1, 3));
        // If it's not the primary armor then reduce additional armor affixes by somewhat 60%
        if (affix.ItemCategory != ItemCategoriesEnum.Armor || affix.AffixCategory != AffixCategoryEnum.PrimaryArmor)
            affixOutput.AffixData.Amount = Math.round((Helpers.getRandom(30, 45) + level/8)/100 * affixOutput.AffixData.Amount);

        return affixOutput;
    }

    GetSkillAffixFromCategoryStats(level: number, powerLevel: number, affixType: ItemAffixTypeEnum, itemType: ItemCategoriesEnum, affix: ItemAffix, selectedSkill:SkillVM): ItemAffixOutput {
        var affixOutput:ItemAffixOutput = new BasicAffixHelper().GetByIndex(affix.AffixCategory, level, powerLevel, BasicStatTypesEnum.SkillEmpower, Helpers.getRandom(1, 3), selectedSkill);
        var basicAffix = new ItemBasicStats(affix.AffixCategory, level, powerLevel);
        basicAffix.SetSkill(level, selectedSkill);
        affixOutput.AffixData = basicAffix;
        return affixOutput;
    }

    GetBasicAffixFromCategoryStats(level: number, powerLevel: number, affixType: ItemAffixTypeEnum, itemType: ItemCategoriesEnum, affix: ItemAffix, selectedSkill: SkillVM): ItemAffixOutput {
        // PowerStats= 1,       // StatPercentage=4,           // SkillEmpower=7,
        // StatNumbers=2,       // StatPercentageRegen=5,      // Socket=8
        // StatRegen=3,         // Resistance=6,
        var selectedBasicStatType = Helpers.getRandom(1, 7);

        // Starting lvl1 numbers
        var amount = selectedBasicStatType == BasicStatTypesEnum.Resistance ? Helpers.getRandom(5,6) // Starting Resistance amount
        : [BasicStatTypesEnum.PowerStats, BasicStatTypesEnum.Socket].includes(selectedBasicStatType) ? Helpers.getRandom(1, 2) // Socket, Powers
        : ![BasicStatTypesEnum.StatPercentage, BasicStatTypesEnum.StatPercentageRegen].includes(selectedBasicStatType) ? Helpers.getRandom(6, 10) // Percentage, PercentageRegen
        : selectedBasicStatType == BasicStatTypesEnum.StatNumbers ? Helpers.getRandom(3, 4) : Helpers.getRandom(1, 2); // ? BasicStatAmount : Regen/Sec

        var affixOutput:ItemAffixOutput = new BasicAffixHelper().GetByIndex(affix.AffixCategory, level, powerLevel, selectedBasicStatType, amount, selectedSkill);
        if (selectedBasicStatType == BasicStatTypesEnum.SkillEmpower)
            (affixOutput.AffixData as ItemBasicStats).SetSkill(level, selectedSkill);

        return affixOutput;
    }

    GetTriggrAffixFromCategoryStats(level: number, powerLevel: number, affixType: ItemAffixTypeEnum, itemType: ItemCategoriesEnum, affix: ItemAffix, selectedSkill:SkillVM): ItemAffixOutput {
        var selectedTrigger = Helpers.getRandom(1, 5);
        var chance = Helpers.getRandom(3,4);
        var amount = Helpers.getRandom(3,4);
        var affixOutput:ItemAffixOutput = new TriggerAffixHelper().GetByIndex(affix.AffixCategory, level, powerLevel, amount, chance, Helpers.getRandom(1, 5), selectedSkill);
        return affixOutput;
    }

    private GetDamageAffixFromStats(category:AffixCategoryEnum, level:number, powerLevel: number, weaponType:ItemWeaponTypesEnum, damageType:DamageTypesEnum, damageResistanceType: ResistanceTypesEnum, addPrimary: boolean, addEmpower: boolean) {
        var amount = Helpers.getRandom(3, 4);
        return new DamageAffixHelper().GetByIndex(category, level, powerLevel, weaponType, damageType, amount, damageResistanceType, addPrimary, addEmpower);
    }

    //# endregion
}

export interface IItemAffixHelper {
    GetByIndex(index:number, rarity:ItemRarityTypesEnum):ItemAffixOutput;
}
