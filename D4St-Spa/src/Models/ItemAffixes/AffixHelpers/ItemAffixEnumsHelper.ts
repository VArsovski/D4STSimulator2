import { SkillVM } from 'src/Models/SkillVM';
import { ItemCategoriesEnum, ItemRarityTypesEnum, ItemAffixTypeEnum, AffixCategoryEnum, BasicAffixEnum } from 'src/_Enums/itemAffixEnums';
import { ItemAffixOutput } from '../Details/ItemAffixOutput';
import { Helpers } from 'src/_Helpers/helpers';
import { DamageAffixHelper } from './DamageAffixHelper';
import { ArmorAffixHelper } from './ArmorAffixHelper';
import { ItemBasicStats, BasicStatTypesEnum } from '../Details/ItemBasicStats';
import { BasicAffixHelper } from './BasicAffixHelper';
import { OfensiveAffixHelper } from './OfensiveAffixHelper';
import { DefensiveAffixHelper } from './DefensiveAffixHelper';
import { TriggerAffixHelper } from './TriggerAffixHelper';
import { LegendaryAffixHelper } from './LegendaryAffixHelper';

export class ItemAffixEnumsHelper {
    skillPool:SkillVM[]
    constructor(skillPool?:SkillVM[]) {
        this.skillPool = skillPool || [];
    }

    public GetRandomTypeByIndex(level: number, powerLevel:number, itemCategory:ItemCategoriesEnum, rarity:ItemRarityTypesEnum, affixType:ItemAffixTypeEnum):ItemAffixOutput {

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
            var addPrimaryDamageNumbers = itemCategory != ItemCategoriesEnum.Weapon;
            affixData.categoryStat = damageAffixesCategory[Helpers.getRandom(0, damageAffixesCategory.length-1)];
            
            if (itemCategory != ItemCategoriesEnum.Weapon)
            
            affixData.damageStat =  new DamageAffixHelper().GetByIndex(level, powerLevel, Helpers.getRandom(1, 7), Helpers.getRandom(1, 5), addPrimaryDamageNumbers).damageStat;
            // for (let i = 0; i < powerLevel; i++) { affixData.damageStat.PowerUp(); }
        }

        if (affixType == ItemAffixTypeEnum.Armor)
        {
            affixData.categoryStat = damageAffixesCategory[Helpers.getRandom(0, damageAffixesCategory.length-1)];
            affixData.armorStat =  new ArmorAffixHelper().GetByIndex(level, powerLevel, Helpers.getRandom(1, 5), Helpers.getRandom(1, 3)).armorStat;
            //for (let i = 0; i < powerLevel; i++) { affixData.armorStat.PowerUp(); }
        }

        if (affixType == ItemAffixTypeEnum.PowerUpSkill)
        {
            affixData.categoryStat = AffixCategoryEnum.IncreaseSkillStat;
            var basicAffix = new ItemBasicStats(level, powerLevel);
            basicAffix.SetSkill(level, this.skillPool[Helpers.getRandom(0, this.skillPool.length -1)]);
            //for (let i = 0; i < powerLevel; i++) { basicAffix.PowerUp(); }
            affixData.basicStat = basicAffix;
        }
        else if (affixType == ItemAffixTypeEnum.BasicStat)
        {
            affixData.categoryStat = basicStatAffixesCategory[Helpers.getRandom(0, basicStatAffixesCategory.length-1)];
            var selectedBasicStatType = Helpers.getRandom(1, 7);
            // PowerStats= 1,
            // StatNumbers=2,
            // StatRegen=3,
            // StatPercentage=4,
            // StatPercentageRegen=5,
            // Resistance=6,
            // SkillEmpower=7,
            // Socket=8
            var amount = selectedBasicStatType == 6 ? Helpers.getRandom(3,5)
            : selectedBasicStatType != 3 ? Helpers.getRandom(2, 4) : 1;
            var selectedSkill = this.skillPool[Helpers.getRandom(0, this.skillPool.length -1)];
            affixData.basicStat = new BasicAffixHelper().GetByIndex(level, powerLevel, selectedBasicStatType, amount, selectedSkill).basicStat
            //for (let i = 0; i < powerLevel; i++) { affixData.basicStat.PowerUp(); }
        }
        
        if (affixType == ItemAffixTypeEnum.Offensive || affixType == ItemAffixTypeEnum.Defensive)
        {
            affixData.categoryStat = defensiveOrOfensiveStatAffixesCategory[Helpers.getRandom(0, defensiveOrOfensiveStatAffixesCategory.length-1)];
            if (affixType == ItemAffixTypeEnum.Offensive) {
                affixData.ofensiveStat = new OfensiveAffixHelper().GetByIndex(level, powerLevel, Helpers.getRandom(1, 8)).ofensiveStat;
                //for (let i = 0; i < powerLevel; i++) { affixData.ofensiveStat.PowerUp(); }
            }
            if (affixType == ItemAffixTypeEnum.Defensive) {
                affixData.defensiveStat = new DefensiveAffixHelper().GetByIndex(level, powerLevel, Helpers.getRandom(1, 8)).defensiveStat;
                //for (let i = 0; i < powerLevel; i++) { affixData.defensiveStat.PowerUp(); }
            }
        }
        if (affixType == ItemAffixTypeEnum.TriggerEffect)
        {
            affixData.categoryStat = triggerAffixesCategory[Helpers.getRandom(0, triggerAffixesCategory.length-1)];
            affixData.triggerStat = new TriggerAffixHelper().GetByIndex(level, powerLevel, Helpers.getRandom(1, 6)).triggerStat;
            // // TODO: Next make Trigger Stats calculate properly
            // for (let i = 0; i < powerLevel; i++) { affixData.triggerStat.PowerUp(); }
        }
        if (affixType == ItemAffixTypeEnum.Legendary)
        {
            affixData.categoryStat = legendaryAffixesCategory[Helpers.getRandom(0, legendaryAffixesCategory.length-1)];
            affixData.legendaryStat = new LegendaryAffixHelper().GetByIndex(level, powerLevel, Helpers.getRandom(1, 12)).legendaryStat;
            // // TODO: Next make Trigger Stats calculate properly
            // for (let i = 0; i < powerLevel; i++) { affixData.legendaryStat.PowerUp(); }
        }
    
        return affixData;
    }

    // GetRandomAmountByType(index: number, level:number) {
    //     var amount = 4;
    //     var delimiter = 6;

    //     var selected:BasicAffixEnum;
    //     var basicAffix:ItemBasicStats = new ItemBasicStats(level);
    //     if (index % delimiter == 1) {
    //         // Powers
    //         var bonus = parseInt(((level || 1) * Helpers.getRandom(40, 60)/100).toString(), 10);
    //     }
    //     if (index % delimiter == 2) {
    //         // HP/Mana
    //         var bonus = parseInt(((level || 1) * Helpers.getRandom(80, 120)/100).toString(), 10);
    //     }
    //     if (index % delimiter == 3) {
    //         // HP/Mana regen
    //         var regenFactor = level / 4;
    //         amount = 1;
    //     }
    //     if (index % delimiter == 4) {
    //         var resusFactor = level / 4;
    //         var bonus = parseInt((resusFactor * Helpers.getRandom(60, 80)/100).toString(), 10);
    //         if (isNaN(bonus)) bonus = 0;
    //         selected = BasicAffixEnum.IncreaseResistance;
    //         var selectedRes = Helpers.getRandom(1,6);
    //         if (selectedRes == 6)
    //             amount = ((amount * Helpers.getRandom(50, 75)/100).toString(), 10);
    //     }

    //     return amount;
    // }

    public GetPrimaryItemAffix(level:number, powerLevel:number, itemCategory:ItemCategoriesEnum, rarity:ItemRarityTypesEnum, affixType:ItemAffixTypeEnum):ItemAffixOutput {
        var affixData = new ItemAffixOutput();
        if (affixType == ItemAffixTypeEnum.Armor)
        {
            affixData.categoryStat = AffixCategoryEnum.PrimaryArmor;
            affixData.armorStat = new ArmorAffixHelper().GetByIndex(level, powerLevel, Helpers.getRandom(1, 5), Helpers.getRandom(1, 3)).armorStat;
            //for (let i = 0; i < powerLevel; i++) { affixData.armorStat.PowerUp(); }
        }
        if (affixType == ItemAffixTypeEnum.Damage)
        {
            affixData.categoryStat = AffixCategoryEnum.PrimaryDamage;
            var damageStat = new DamageAffixHelper().GetByIndex(level, powerLevel, Helpers.getRandom(1, 7), Helpers.getRandom(1, 5), itemCategory != ItemCategoriesEnum.Weapon).damageStat;
            affixData.damageStat = damageStat;
            //for (let i = 0; i < powerLevel; i++) { affixData.damageStat.PowerUp(); }
        }

        return affixData;
    }
}

export interface IItemAffixHelper {
    GetByIndex(index:number, rarity:ItemRarityTypesEnum):ItemAffixOutput;
}
