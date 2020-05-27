import { ItemCategoriesEnum, ItemRarityTypesEnum, ItemAffixTypeEnum, AffixCategoryEnum, ResistanceTypesEnum, ItemWeaponTypesEnum, DamageTypesEnum, BasicStatTypesEnum, SecondaryStatTypesEnum, ItemArmorTypesEnum, ArmorTypesEnum } from 'src/_Enums/itemAffixEnums';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { LegendaryAffixHelper } from './LegendaryAffixHelper';
import { DefensiveAffixHelper } from './DefensiveAffixHelper';
import { OfensiveAffixHelper } from './OfensiveAffixHelper';
import { ItemBasicStats } from '../Details/ItemBasicStats';
import { TriggerAffixHelper } from './TriggerAffixHelper';
import { DamageAffixHelper, DamageEmpowerAffixHelper } from './DamageAffixHelper';
import { BasicAffixHelper } from './BasicAffixHelper';
import { ArmorAffixHelper } from './ArmorAffixHelper';
import { Helpers } from 'src/_Helpers/helpers';
import { SkillVM } from 'src/Models/SkillVM';
import { ItemAffix } from '../ItemAffix';
import { SecondaryTriggerAffixHelper } from './SecondaryAffixCategoryHelper';
import { ItemTriggerStats } from '../Details/ItemTriggerStats';
import { TriggerTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { IItemAffix } from '../IItemAffix';
import { ItemDamageStats } from '../Details/ItemDamageStats';
import { ConditionalTriggerAffixHelper } from './ConditionalTriggerAffixHelper';
import { SecondaryStatAffixHelper } from './SecondaryStatAffixHelper';

export class ItemAffixEnumsHelper {
    skillPool:SkillVM[]
    constructor(skillPool?:SkillVM[]) {
        this.skillPool = skillPool || [];
    }

    public GetRandomTypeByIndex(itemType:ItemCategoriesEnum, level: number, powerLevel:number, rarity:ItemRarityTypesEnum, affix:ItemAffix, selectedSkill:SkillVM, isPrimary:boolean):ItemAffixOutput {

        // 1, 4, 6, [L14]
        var basicStatAffixesCategory = [AffixCategoryEnum.IncreaseBasicStat
            , AffixCategoryEnum.IncreaseSkillStat
        ];
        if (rarity == ItemRarityTypesEnum.Legendary)
            basicStatAffixesCategory.push(AffixCategoryEnum.AlterBasicAffixStat);

        var damageAffixesCategory = [AffixCategoryEnum.PrimaryDamage
            , AffixCategoryEnum.IncreaseDamage
            , AffixCategoryEnum.ExtraDamageEffect
        ];
        if (rarity == ItemRarityTypesEnum.Legendary) {
            damageAffixesCategory.push(AffixCategoryEnum.EmpowerDamageType);
        }

        var secondaryDefensiveStatCategory = [
            AffixCategoryEnum.IncreaseSecondaryStatDefensive,
        ]
        var secondaryBasicDamageCategory = [
            AffixCategoryEnum.EmpowerDamageType,
            AffixCategoryEnum.IncreaseSecondaryStatDamage
        ]

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
            // TODO: Fix later when other things are fixed,
            // , AffixCategoryEnum.EmpowerProcSkillAffixStat //This still crashes, so, OMIT
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

        var secondaryStatAffixesCategory = [AffixCategoryEnum.ConditionalProcBasicAffix,
            AffixCategoryEnum.EmpowerProcEffectAffixStat,
            AffixCategoryEnum.EmpowerProcSkillAffixStat,
            AffixCategoryEnum.EmpowerProcTriggerAffixStat,
            AffixCategoryEnum.ConditionalSkillTriggerAffix
        ]

        var affixOutput:ItemAffixOutput = new ItemAffixOutput(affix.AffixCategory, null);
        var affixType = affix.AffixType;
        var availableSkills:SkillVM[] = [];
        this.skillPool.forEach(s => {if (s.tier * 6 >= level) availableSkills.push(s)});

        var damageCategory = damageAffixesCategory[Helpers.getRandom(0, damageAffixesCategory.length-1)];
        var armorCategory = basicStatAffixesCategory[Helpers.getRandom(0, basicStatAffixesCategory.length-1)];
        var powerUpCategory = AffixCategoryEnum.IncreaseSkillStat;
        var basicCategory = basicStatAffixesCategory[Helpers.getRandom(0, basicStatAffixesCategory.length-1)];
        var secondaryDefensiveCategory = secondaryDefensiveStatCategory[Helpers.getRandom(0, secondaryDefensiveStatCategory.length-1)];
        var secondaryDamageCategory = secondaryBasicDamageCategory[Helpers.getRandom(0, secondaryBasicDamageCategory.length-1)];
        var secondaryStatCategory = secondaryStatAffixesCategory[Helpers.getRandom(0, secondaryStatAffixesCategory.length-1)];
        var ofensiveOrDefensiveCategory = defensiveOrOfensiveStatAffixesCategory[Helpers.getRandom(0, defensiveOrOfensiveStatAffixesCategory.length-1)];
        var triggerCategory = triggerAffixesCategory[Helpers.getRandom(0, triggerAffixesCategory.length-1)];
        var secondaryCategory = secondaryTriggerCategory[Helpers.getRandom(0, secondaryTriggerCategory.length-1)];
        var legendaryCategory = legendaryAffixesCategory[Helpers.getRandom(0, legendaryAffixesCategory.length-1)];

        var selectedCategory = affixType == ItemAffixTypeEnum.Damage ? damageCategory
        : affixType == ItemAffixTypeEnum.Armor ? armorCategory
        : affixType == ItemAffixTypeEnum.PowerUpSkill ? powerUpCategory
        : affixType == ItemAffixTypeEnum.BasicStat ? basicCategory
        : affixType == ItemAffixTypeEnum.SecondaryStat ? secondaryStatCategory
        : affixType == ItemAffixTypeEnum.SecondaryDefensiveStat ? secondaryDefensiveCategory
        : affixType == ItemAffixTypeEnum.SecondaryDamageStat ? secondaryDamageCategory
        : affixType == (ItemAffixTypeEnum.Offensive || ItemAffixTypeEnum.Defensive) ? ofensiveOrDefensiveCategory
        : affixType == ItemAffixTypeEnum.TriggerEffect ? triggerCategory
        : affixType == ItemAffixTypeEnum.SecondaryTrigger ? secondaryCategory
        : legendaryCategory;

        affix.AffixCategory = selectedCategory;

        if (affixType == ItemAffixTypeEnum.Damage || affix.AffixCategory == AffixCategoryEnum.IncreaseDamage)
            affixOutput = this.GetDamageAffixFromCategoryStats(level, powerLevel, affixType, itemType, rarity, affix, isPrimary);
        if (affixType == ItemAffixTypeEnum.Armor)
            affixOutput = this.GetArmorAffixFromCategoryStats(level, powerLevel, affixType, itemType, affix, isPrimary);

        if (affixType == ItemAffixTypeEnum.PowerUpSkill)
            affixOutput = this.GetSkillAffixFromCategoryStats(level, powerLevel, affixType, itemType, affix, selectedSkill);
        else if (affixType == ItemAffixTypeEnum.BasicStat)
            affixOutput = this.GetBasicAffixFromCategoryStats(level, powerLevel, Helpers.getRandom(1, 9), affixType, itemType, affix, selectedSkill);

        if (affixType == ItemAffixTypeEnum.Offensive)
            affixOutput = new OfensiveAffixHelper().GetByIndex(ofensiveOrDefensiveCategory, level, powerLevel, Helpers.getRandom(1, 8));
        else if (affixType == ItemAffixTypeEnum.Defensive)
            affixOutput = new DefensiveAffixHelper().GetByIndex(ofensiveOrDefensiveCategory, level, powerLevel, Helpers.getRandom(1, 8));

        if (affixType == ItemAffixTypeEnum.TriggerEffect)
            affixOutput = this.GetTriggerAffixFromCategoryStats(level, powerLevel, affixType, itemType, affix, selectedSkill);
        if (affixType == ItemAffixTypeEnum.SecondaryTrigger)
            affixOutput = this.GetSecondaryTriggerAffixFromCategoryStats(level, powerLevel, affixType, itemType, affix, selectedSkill);

        var defensiveSecStats = [SecondaryStatTypesEnum.Resistance, SecondaryStatTypesEnum.ReduceCCTaken, SecondaryStatTypesEnum.ReduceDamageTaken, SecondaryStatTypesEnum.Socket];
        if (rarity == ItemRarityTypesEnum.Legendary) {
            defensiveSecStats.push(SecondaryStatTypesEnum.EmpowerTrapsAndSummons);
            defensiveSecStats.push(SecondaryStatTypesEnum.EmpowerSkillType);
        }
        var ofensiveSecStats = [SecondaryStatTypesEnum.IncreaseStatSunder, SecondaryStatTypesEnum.EmpowerTrapsAndSummons, SecondaryStatTypesEnum.EmpowerSkillType, SecondaryStatTypesEnum.Socket];
        if (rarity == ItemRarityTypesEnum.Legendary) {
            defensiveSecStats.push(SecondaryStatTypesEnum.Resistance);
            defensiveSecStats.push(SecondaryStatTypesEnum.ReduceCCTaken);
            defensiveSecStats.push(SecondaryStatTypesEnum.ReduceDamageTaken);
        }

        if (secondaryDefensiveStatCategory.includes(affix.AffixCategory)) {
            var selectedSecondaryStatCategorySet = itemType == ItemCategoriesEnum.Armor ? defensiveSecStats
                                                                                        : itemType == ItemCategoriesEnum.Weapon ? ofensiveSecStats
                                                                                        : defensiveSecStats.concat(ofensiveSecStats); // Let both happen for Jewelry (will see..)
            var selectedSecondaryStatType = selectedSecondaryStatCategorySet[Helpers.getRandom(0, selectedSecondaryStatCategorySet.length - 1)]
            affixOutput = this.GetSecondaryDefensiveStats(level, powerLevel, selectedSecondaryStatType, affixType, itemType, affix, selectedSkill);
        }
        if (secondaryBasicDamageCategory.includes(affix.AffixCategory)) {
            var selectedSecondaryStatType = selectedSecondaryStatCategorySet[Helpers.getRandom(0, ofensiveSecStats.length - 1)];
            // Same method as above, no need change
            affixOutput = this.GetSecondaryDefensiveStats(level, powerLevel, selectedSecondaryStatType, affixType, itemType, affix, selectedSkill);
        }

        if (selectedCategory == AffixCategoryEnum.ExtraDamageEffect) {
            // 1-4 (instead of 1-5) cause we don't want to empower specific skill usage with an elemental damage, very specific usage
            var amount = Helpers.getRandom(3, 4);
            var secondaryEffectsPowerLevel = powerLevel + Helpers.getRandom(2, 4);
            var triggerType = Helpers.getRandom(1, 2);
            var triggerSubtype = this.GetTriggerAffixTypeFromStats(triggerType);
            var triggerStat = new TriggerAffixHelper().GetByIndex(triggerCategory, level, secondaryEffectsPowerLevel, amount, 0, triggerType, triggerSubtype, availableSkills[Helpers.getRandom(0, availableSkills.length -1)]);
            var descr = triggerStat.AffixData.GetDescription();
            if (descr.indexOf("null") != -1) {
                debugger;
            }

            affixOutput = triggerStat;
        }

        if (secondaryStatAffixesCategory.includes(selectedCategory)) {
            // Non-Legendary Armor doesn't get ofensive, and nonL weapon doesn't get defensive affixes [other than Resistance]
            var addOfensive = itemType != ItemCategoriesEnum.Armor && rarity != ItemRarityTypesEnum.Legendary;
            var addDefensive = itemType != ItemCategoriesEnum.Weapon && rarity != ItemRarityTypesEnum.Legendary;
            var minStat = addDefensive ? 1 : 3;           var maxStat = addOfensive ? 6 : 4;
            var selected = Helpers.getRandom(addOfensive ? 1 : 3, addDefensive ? 6 : 4);
            if (itemType == ItemCategoriesEnum.Weapon && rarity == ItemRarityTypesEnum.Legendary)
                if (Helpers.getRandom(1, 100) % 4 == 0) selected = 1;

            affixOutput = this.GetSecondaryAffixFromCategoryStats(level, powerLevel, selected, itemType, affix);
        }

        var conditionalBasicAffixTypes:AffixCategoryEnum[] = [
            AffixCategoryEnum.ConditionalProcBasicAffix,
            AffixCategoryEnum.ConditionalSkillTriggerAffix,
        ];

        if (conditionalBasicAffixTypes.includes(affixOutput.CategoryStat))
            affixOutput = this.GetConditionalBasicAffixFromCategoryStats(level, powerLevel, affixType, itemType, affix, selectedSkill);

        var otherAffixTypes:AffixCategoryEnum[] = [
            AffixCategoryEnum.ConditionalProcCastAffix,
            AffixCategoryEnum.ConditionalProcEffectAffix,
            AffixCategoryEnum.ConditionalProcTriggerAffix,
        ];

        if (otherAffixTypes.includes(affixOutput.CategoryStat))
            affixOutput = this.GetSecondaryTriggerAffixFromCategoryStats(level, powerLevel, affixType, itemType, affix, selectedSkill);

        if (affixType == ItemAffixTypeEnum.Legendary)
            affixOutput = new LegendaryAffixHelper().GetByIndex(legendaryCategory, level, powerLevel, Helpers.getRandom(1, 12));//.legendaryStat;

        return affixOutput;
    }

    public GetPrimaryArmorAffix(category:AffixCategoryEnum, itemArmorType:ItemArmorTypesEnum, armorType:ArmorTypesEnum, level:number, powerLevel:number, rarity:ItemRarityTypesEnum, affix:ItemAffix, isPrimary:boolean):ItemAffixOutput {
        var affixData:ItemAffixOutput = new ItemAffixOutput(null, null);
        affixData.CategoryStat = AffixCategoryEnum.PrimaryArmor;
        affixData = new ArmorAffixHelper().GetByIndex(category, level, powerLevel, itemArmorType, armorType, isPrimary);
        return affixData;
    }
    public GetPrimaryDamageAffix(category:AffixCategoryEnum, itemWeaponType:ItemWeaponTypesEnum, damageElementType:ResistanceTypesEnum, level:number, powerLevel:number, rarity:ItemRarityTypesEnum, affix:ItemAffix, isPrimary:boolean):ItemAffixOutput {
        var affixData:ItemAffixOutput = new ItemAffixOutput(null, null);
        var damageStat = this.GetDamageAffixFromStats(category, level, powerLevel, itemWeaponType, Helpers.getRandom(1, 5), damageElementType);
        affixData = damageStat;
        return affixData;
    }

    //# region Private AffixOutput Creation Methods

    private GetDamageAffixFromCategoryStats(level:number, powerLevel:number, affixType: ItemAffixTypeEnum, itemType: ItemCategoriesEnum, rarity:ItemRarityTypesEnum, affix: IItemAffix, isPrimary:boolean): ItemAffixOutput {
        var affixOutput:ItemAffixOutput = new ItemAffixOutput(affix.AffixCategory, null);

        var addPrimaryDamageFactor = itemType == ItemCategoriesEnum.Weapon ? 3 : itemType == ItemCategoriesEnum.Armor ? 17 : 5; // Add Primary damage more often on weapons and much less often on Armor
        var primaryRoll = Helpers.getRandom(1, 100) % addPrimaryDamageFactor == 0;
        var addPrimary = isPrimary || primaryRoll;
        var addEmpower = isPrimary || itemType != ItemCategoriesEnum.Weapon;

        if (!(addPrimary || addEmpower)) {
            addPrimary = itemType == ItemCategoriesEnum.Weapon;
            addEmpower = itemType != ItemCategoriesEnum.Weapon;
        }

        if (addPrimary)
            affixOutput = this.GetDamageAffixFromStats(affix.AffixCategory, level, powerLevel, Helpers.getRandom(1, 7), Helpers.getRandom(1, 5), Helpers.getRandom(1, 5));
        else affixOutput = this.GetDamageEmpowerAffixFromStats(affix.AffixCategory, level, powerLevel, Helpers.getRandom(1, 7), rarity, Helpers.getRandom(1, 5), Helpers.getRandom(3, 5), Helpers.getRandom(1, 5));

        // Reduce damage if not primary by some factor
        if (affix.AffixCategory != AffixCategoryEnum.PrimaryDamage) {
            var levelFactorMin = Helpers.getRandom(3, (40 + level)/10);
            var levelFactorMax = Helpers.getRandom(3, (40 + level)/10);
            var factorMin = Math.round((Helpers.getRandom(40, 60) + Helpers.getRandom(-5, 5) - levelFactorMin)/10)/10;
            var factorMax = Math.round((Helpers.getRandom(40, 60) + Helpers.getRandom(-5, 5) - levelFactorMax)/10)/10;
            var damageStats = affixOutput.AffixData as ItemDamageStats;
            if (damageStats.MinDamage && damageStats.MaxDamage) {
                (affixOutput.AffixData as ItemDamageStats).SetDamageFactor(factorMin, "Min");
                (affixOutput.AffixData as ItemDamageStats).SetDamageFactor(factorMax, "Max");
            }
        }

        if (!affixOutput.EquippableStatData.InputMeta.SelectedStat) affixOutput.EquippableStatData.InputMeta = affixOutput.AffixData.InputMeta;
        if (!affixOutput.EquippableStatData.OutputMeta.SelectedStat) affixOutput.EquippableStatData.OutputMeta = affixOutput.AffixData.OutputMeta;
        return affixOutput;
    }

    private GetArmorAffixFromCategoryStats(level:number, powerLevel:number, affixType: ItemAffixTypeEnum, itemType: ItemCategoriesEnum, affix: IItemAffix, isPrimary:boolean): ItemAffixOutput {
        var affixOutput:ItemAffixOutput = new ArmorAffixHelper().GetByIndex(affix.AffixCategory, level, powerLevel, Helpers.getRandom(1, 5), Helpers.getRandom(1, 3), isPrimary);
        // If it's not the primary armor then reduce additional armor affixes by somewhat 60%
        if (affix.ItemCategory != ItemCategoriesEnum.Armor || affix.AffixCategory != AffixCategoryEnum.PrimaryArmor)
            affixOutput.AffixData.Amount = Math.round((Helpers.getRandom(30, 45) + level/8)/100 * affixOutput.AffixData.Amount);

        if (!affixOutput.EquippableStatData.InputMeta.SelectedStat) affixOutput.EquippableStatData.InputMeta = affixOutput.AffixData.InputMeta;
        if (!affixOutput.EquippableStatData.OutputMeta.SelectedStat) affixOutput.EquippableStatData.OutputMeta = affixOutput.AffixData.OutputMeta;
        return affixOutput;
    }

    private GetSkillAffixFromCategoryStats(level: number, powerLevel: number, affixType: ItemAffixTypeEnum, itemType: ItemCategoriesEnum, affix: ItemAffix, selectedSkill:SkillVM): ItemAffixOutput {
        var affixOutput:ItemAffixOutput = new BasicAffixHelper().GetByIndex(affix.AffixCategory, level, powerLevel, BasicStatTypesEnum.SkillEmpower, Helpers.getRandom(1, 3), selectedSkill);
        var basicAffix = new ItemBasicStats(affix.AffixCategory, level, powerLevel);
        basicAffix.SetSkill(level, selectedSkill);
        affixOutput.AffixData = basicAffix;

        if (!affixOutput.EquippableStatData.InputMeta.SelectedStat) affixOutput.EquippableStatData.InputMeta = affixOutput.AffixData.InputMeta;
        if (!affixOutput.EquippableStatData.OutputMeta.SelectedStat) affixOutput.EquippableStatData.OutputMeta = affixOutput.AffixData.OutputMeta;
        return affixOutput;
    }

    private GetBasicAffixFromCategoryStats(level: number, powerLevel: number, basicAffixType:BasicStatTypesEnum, affixType: ItemAffixTypeEnum, itemType: ItemCategoriesEnum, affix: ItemAffix, selectedSkill: SkillVM): ItemAffixOutput {
        // Starting lvl1 numbers
        var amount = basicAffixType == BasicStatTypesEnum.Resistance ? Helpers.getRandom(5,6) // Starting Resistance amount
        : [BasicStatTypesEnum.PowerStats, BasicStatTypesEnum.Socket].includes(basicAffixType) ? Helpers.getRandom(1, 2) // Socket, Powers
        : ![BasicStatTypesEnum.StatPercentage, BasicStatTypesEnum.StatPercentageRegen].includes(basicAffixType) ? Helpers.getRandom(6, 10) // Percentage, PercentageRegen
        : basicAffixType == BasicStatTypesEnum.StatAmount ? Helpers.getRandom(3, 4) // StatAmount
        : Helpers.getRandom(1, 2); // ? BasicStatAmount : Regen/Sec/StatReturn

        var affixOutput:ItemAffixOutput = new BasicAffixHelper().GetByIndex(affix.AffixCategory, level, powerLevel, basicAffixType, amount, selectedSkill);
        if (basicAffixType == BasicStatTypesEnum.SkillEmpower)
            (affixOutput.AffixData as ItemBasicStats).SetSkill(level, selectedSkill);

        if (!affixOutput.EquippableStatData.InputMeta.SelectedStat) affixOutput.EquippableStatData.InputMeta = affixOutput.AffixData.InputMeta;
        if (!affixOutput.EquippableStatData.OutputMeta.SelectedStat) affixOutput.EquippableStatData.OutputMeta = affixOutput.AffixData.OutputMeta;
        return affixOutput;
    }

    private GetSecondaryDefensiveStats(level: number, powerLevel: number, secondaryAffixType:SecondaryStatTypesEnum, affixType: ItemAffixTypeEnum, itemType: ItemCategoriesEnum, affix: ItemAffix, selectedSkill: SkillVM): ItemAffixOutput{
        var amount = secondaryAffixType == SecondaryStatTypesEnum.Resistance ? Helpers.getRandom(3,5) // Starting Resistance amount
        : [SecondaryStatTypesEnum.Socket].includes(secondaryAffixType) ? Helpers.getRandom(1, 2) // Socket
        : [SecondaryStatTypesEnum.ReduceCCTaken, SecondaryStatTypesEnum.EmpowerTrapsAndSummons].includes(secondaryAffixType) ? Helpers.getRandom(6, 10) // CCReduction, TrapsSummons, SkillTypeEmpower
        : Helpers.getRandom(3, 6); // Everything else

        var affixOutput:ItemAffixOutput = new SecondaryStatAffixHelper().GetByIndex(affix.AffixCategory, level, powerLevel, secondaryAffixType, amount, amount);

        if (!affixOutput.EquippableStatData.InputMeta.SelectedStat) affixOutput.EquippableStatData.InputMeta = affixOutput.AffixData.InputMeta;
        if (!affixOutput.EquippableStatData.OutputMeta.SelectedStat) affixOutput.EquippableStatData.OutputMeta = affixOutput.AffixData.OutputMeta;
        return affixOutput;
    }

    GetSecondaryAffixFromCategoryStats(level: number, powerLevel: number, affixType: SecondaryStatTypesEnum, itemType: ItemCategoriesEnum, affix: ItemAffix): ItemAffixOutput {
        var amount = affixType == SecondaryStatTypesEnum.Resistance ? Helpers.getRandom(3,5) // Starting Resistance amount
        : [SecondaryStatTypesEnum.Socket].includes(affixType) ? Helpers.getRandom(1, 2) // Socket
        : [SecondaryStatTypesEnum.ReduceCCTaken, SecondaryStatTypesEnum.EmpowerTrapsAndSummons, SecondaryStatTypesEnum.EmpowerSkillType].includes(affixType) ? Helpers.getRandom(10, 14) // CCReduction, TrapsSummons, SkillTypeEmpower
        : Helpers.getRandom(3, 6); // Everything else

        var affixOutput:ItemAffixOutput = new SecondaryStatAffixHelper().GetByIndex(affix.AffixCategory, level, powerLevel, affixType, amount, amount);
        if (!affixOutput.EquippableStatData.InputMeta.SelectedStat)
            affixOutput.EquippableStatData.InputMeta = affixOutput.AffixData.InputMeta;
        if (!affixOutput.EquippableStatData.OutputMeta.SelectedStat)
            affixOutput.EquippableStatData.OutputMeta = affixOutput.AffixData.OutputMeta;
        return affixOutput;
    }

    private GetTriggerAffixFromCategoryStats(level: number, powerLevel: number, affixType: ItemAffixTypeEnum, itemType: ItemCategoriesEnum, affix: ItemAffix, selectedSkill:SkillVM): ItemAffixOutput {
        var chance = Helpers.getRandom(3,4);
        var amount = Helpers.getRandom(3,4);
        var triggerType = Helpers.getRandom(1, 3);
        var triggerSubtype = this.GetTriggerAffixTypeFromStats(triggerType);
        var affixOutput:ItemAffixOutput = new TriggerAffixHelper().GetByIndex(affix.AffixCategory, level, powerLevel, amount, chance, triggerType, triggerSubtype, selectedSkill);
        var descr = affixOutput.AffixData.GetDescription();
        if (descr.indexOf("null") != -1) {
            debugger;
        }

        if (!affixOutput.EquippableStatData.InputMeta.SelectedStat) affixOutput.EquippableStatData.InputMeta = affixOutput.AffixData.InputMeta;
        if (!affixOutput.EquippableStatData.OutputMeta.SelectedStat) affixOutput.EquippableStatData.OutputMeta = affixOutput.AffixData.OutputMeta;
        return affixOutput;
    }

    private GetConditionalBasicAffixFromCategoryStats(level: number, powerLevel: number, affixType: ItemAffixTypeEnum, itemType: ItemCategoriesEnum, affix: ItemAffix, selectedSkill: SkillVM): ItemAffixOutput {
        var basicStat = this.GetBasicAffixFromCategoryStats(level, powerLevel, Helpers.getRandom(2, 7), affixType, itemType, affix, null);
        var basicStatsData = (basicStat.AffixData as ItemBasicStats);
        var chanceSec = new CalculationsHelper().getTriggerChanceForLevel(Helpers.getRandom(4, 6), level, powerLevel);
        var triggerType = Helpers.getRandom(1, 2);
        var triggerSubtype = this.GetTriggerAffixTypeFromStats(triggerType);
        var triggerStat = new TriggerAffixHelper().GetByIndex(affix.AffixCategory, level, powerLevel, 0, chanceSec, triggerType, triggerSubtype, selectedSkill);
        var descr = triggerStat.AffixData.GetDescription();
        if (descr.indexOf("null") != -1) {
            debugger;
        }

        var durationBonus = Helpers.getRandom(4, 6) + Helpers.getRandom(-2, 1);
        var affixOutput = new ConditionalTriggerAffixHelper().GetByIndex(affix.AffixCategory, level, powerLevel, durationBonus, basicStatsData, triggerStat.AffixData as ItemTriggerStats);
        if (!affixOutput.EquippableStatData.InputMeta.SelectedStat) affixOutput.EquippableStatData.InputMeta = affixOutput.AffixData.InputMeta;
        if (!affixOutput.EquippableStatData.OutputMeta.SelectedStat) affixOutput.EquippableStatData.OutputMeta = affixOutput.AffixData.OutputMeta;
        return affixOutput;
    }

    private GetSecondaryTriggerAffixFromCategoryStats(level: number, powerLevel: number, affixType: ItemAffixTypeEnum, itemType: ItemCategoriesEnum, affix: ItemAffix, selectedSkill: SkillVM): ItemAffixOutput {
        var selectedTrigger = Helpers.getRandom(1, 100);
        var amount = new CalculationsHelper().getTriggerStatsForLevel(Helpers.getRandom(3,4), level, powerLevel, selectedTrigger);
        var triggerType = Helpers.getRandom(1, 3);
        var triggerSubtype = this.GetTriggerAffixTypeFromStats(triggerType);
        var triggerStat = new TriggerAffixHelper().GetByIndex(affix.AffixCategory, level, powerLevel, amount, 0, triggerType, triggerSubtype, selectedSkill);
        var descr = triggerStat.AffixData.GetDescription();
        if (descr.indexOf("null") != -1) {
            debugger;
        }

        var chanceSec = new CalculationsHelper().getTriggerChanceForLevel(Helpers.getRandom(10,15), level, powerLevel);
        var amountSec = new CalculationsHelper().getSecondaryTriggerStatForLevel(Helpers.getRandom(4, 6), level, powerLevel);
        var duration = Helpers.getRandom(3, 5);
        var damageType = Helpers.getRandom(1, 5);
        var affixOutput = new SecondaryTriggerAffixHelper().GetByIndex(affix.AffixCategory, level, powerLevel, amountSec, chanceSec, duration, selectedTrigger, triggerStat.AffixData as ItemTriggerStats, damageType);
        if (!affixOutput.EquippableStatData.InputMeta.SelectedStat) affixOutput.EquippableStatData.InputMeta = affixOutput.AffixData.InputMeta;
        if (!affixOutput.EquippableStatData.OutputMeta.SelectedStat) affixOutput.EquippableStatData.OutputMeta = affixOutput.AffixData.OutputMeta;
        return affixOutput;
    }

    private GetDamageAffixFromStats(category:AffixCategoryEnum, level:number, powerLevel: number, weaponType:ItemWeaponTypesEnum, damageType:DamageTypesEnum, damageResistanceType: ResistanceTypesEnum) {
        return new DamageAffixHelper().GetByIndex(category, level, powerLevel, weaponType, damageType, damageResistanceType);
    }

    private GetDamageEmpowerAffixFromStats(category:AffixCategoryEnum, level:number, powerLevel: number, weaponType:ItemWeaponTypesEnum, rarity:ItemRarityTypesEnum, damageType:DamageTypesEnum, empowerPercentage:number, damageResistanceType: ResistanceTypesEnum) {
        return new DamageEmpowerAffixHelper().GetByIndex(category, level, powerLevel, weaponType, rarity, damageType, empowerPercentage, damageResistanceType);
    }    

    private GetTriggerAffixTypeFromStats(triggerType:TriggerTypesEnum) {
        var hitEffectPhysical = triggerType == TriggerTypesEnum.HitEffectPhysical ? Helpers.getRandom(1, 12) : null;
        var hitEffectCC = triggerType == TriggerTypesEnum.HitEffectCC ? Helpers.getRandom(1, 6) : null;

        // SpellEffectTypesEnum [
        //    CastRange = 1,     DoT = 3,           Multicast = 5,          StaminaSunder = 7,
        //    AoE = 2,           Stackable = 4,     ResourceSunder = 6,     CastSpell = 8 
        // ]
        var spellEffectType = triggerType == TriggerTypesEnum.SpellEffect ? Helpers.getRandom(2, 7) : null;
        return hitEffectPhysical || hitEffectCC || spellEffectType;
    }

    //# endregion
}

export interface IItemAffixHelper {
    GetByIndex(index:number, rarity:ItemRarityTypesEnum):ItemAffixOutput;
}
