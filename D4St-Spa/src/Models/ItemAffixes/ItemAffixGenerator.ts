import { ItemCategoriesEnum, ItemAffixTypeEnum, ItemWeaponTypesEnum, ItemJewelryTypesEnum, ItemArmorTypesEnum, ItemRarityTypesEnum, AffixCategoryEnum, AttackTypesEnum, CastProcTypesEnum, DamageTypesEnum, ArmorTypesEnum, BasicStatTypesEnum } from "../../_Enums/itemAffixEnums";
import { ItemAffix } from './ItemAffix';
import { Helpers } from 'src/_Helpers/helpers';
import { ItemAffixBlueprint } from './ItemAffixBlueprint';
import { ItemAffixCondition } from './ItemAffixCondition';
import { PowerTypesEnum } from 'src/_Enums/powerTypesEnum';
import { SkillVM } from '../SkillVM';
import { ItemDamageStats } from './Details/ItemDamageStats';
import { ItemAffixEnumsHelper } from './AffixHelpers/ItemAffixEnumsHelper';
import { BasicAffixHelper } from './AffixHelpers/BasicAffixHelper';
import { TriggerAffixTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { ItemTriggerStats } from './Details/ItemTriggerStats';

export class ItemAffixGenerator {
    SkillPool: SkillVM[];
    ItemType:ItemCategoriesEnum;

    constructor(skillPool:SkillVM[]) {
        this.SkillPool = skillPool;
    }

    public GenerateArmorAffixes(level:number, itemType: ItemArmorTypesEnum, rarity: ItemRarityTypesEnum): ItemAffix[] {
        if (!this.ItemType)
            this.ItemType = ItemCategoriesEnum.Armor;

        var affixesList:ItemAffix[] = []
        var affixesListBlueprint = this.GenerateBluePrintByRarityAndType(ItemCategoriesEnum.Armor, rarity);
        affixesListBlueprint.unshift(new ItemAffixBlueprint(ItemAffixTypeEnum.Armor, false, AffixCategoryEnum.PrimaryArmor));
        affixesList = this.AddConditionsToAffixesFromBlueprint(level, affixesListBlueprint, rarity);
        affixesList.forEach(a => a.ItemCategory = ItemCategoriesEnum.Armor);
        affixesList = this.AddCategoryToAffixes(level, affixesList, rarity);
    
        // var powerLevelDefault = 0;
        // var selectedArmor = new ItemArmorStats(level, powerLevelDefault, itemType, Helpers.getRandom(1,3));
        // affixesList.forEach(a => {
        //     if (a.AffixCategory == AffixCategoryEnum.PrimaryArmor)
        //         a.Contents.armorStat = selectedArmor;
        // });
    
        return affixesList;
    }

    public GenerateWeaponAffixes(level:number, itemType: ItemWeaponTypesEnum, rarity: ItemRarityTypesEnum): ItemAffix[] {
        if (!this.ItemType)
            this.ItemType = ItemCategoriesEnum.Weapon;

        var affixesList:ItemAffix[] = [];
        var affixesListBlueprint = this.GenerateBluePrintByRarityAndType(ItemCategoriesEnum.Weapon, rarity);

        // Insert/Add this affix as first
        affixesListBlueprint.unshift(new ItemAffixBlueprint(ItemAffixTypeEnum.Damage, false, AffixCategoryEnum.PrimaryDamage));
        affixesList = this.AddConditionsToAffixesFromBlueprint(level, affixesListBlueprint, rarity);
        affixesList.forEach(a => a.ItemCategory = ItemCategoriesEnum.Weapon);
        affixesList = this.AddCategoryToAffixes(level, affixesList, rarity);

        var powerLevelDefault = 0;
        // Set primary affix (the one with index 0)
        var selectedDamage = new ItemDamageStats(AffixCategoryEnum.PrimaryDamage, true, true, level, powerLevelDefault, itemType);
        affixesList[0].Contents.AffixData = selectedDamage;

        //////// new CalculationsHelper().LogAffixData([a], AffixCategoryEnum.PrimaryDamage, this.skillPool);
        return affixesList;
    }
    
    public GenerateJewelryAffixes(level:number, itemType: ItemJewelryTypesEnum, rarity: ItemRarityTypesEnum): ItemAffix[] {
        if (!this.ItemType)
            this.ItemType = ItemCategoriesEnum.Jewelry;

        var affixesList:ItemAffix[] = [];
        var affixesListBlueprint = this.GenerateBluePrintByRarityAndType(ItemCategoriesEnum.Jewelry, rarity);
        affixesListBlueprint.unshift(new ItemAffixBlueprint(ItemAffixTypeEnum.PowerUpSkill, false, AffixCategoryEnum.IncreaseSkillStat));
        affixesList = this.AddConditionsToAffixesFromBlueprint(level, affixesListBlueprint, rarity);
        affixesList.forEach(a => a.ItemCategory = ItemCategoriesEnum.Jewelry);
        affixesList = this.AddCategoryToAffixes(level, affixesList, rarity);

        // switch(itemType)
        // {
        //     case ItemJewelryTypesEnum.Amulet: {
        //         break;
        //     }
        //     case ItemJewelryTypesEnum.Ring: {
        //         break;
        //     }
        //     default: break;
        // }

        return affixesList;
    }

    private GenerateBluePrintByRarityAndType(itemCategory: ItemCategoriesEnum, rarity:ItemRarityTypesEnum): ItemAffixBlueprint[]
    {
        var affixesListBlueprint = rarity == ItemRarityTypesEnum.Magic ? this.GenerateMagicBlueprint(itemCategory)
            : rarity == ItemRarityTypesEnum.Rare ? this.GenerateRareBlueprint(itemCategory)
            : this.GenerateLegendaryBlueprint(itemCategory);

        return affixesListBlueprint;
    }

    private AddConditionsToAffixesFromBlueprint(level:number, affixesListBlueprint:ItemAffixBlueprint[], rarity:ItemRarityTypesEnum):ItemAffix[] {
        var itemAffixes = [];
        affixesListBlueprint.forEach(element => {
            // Crafting Weapon Affixes
            var affix = new ItemAffix(element.AffixType, null, element.AffixCategory, element.PowerLevel);

            if (element.IsConditional)
            {
                // level:number, condition:number, conditionPowerType:PowerTypesEnum
                var rand1 = Helpers.getRandom(35, 60);
                var rand2 = Helpers.getRandom(87, 114);
                var conditionNum = Math.min(level * 3, Math.floor(Math.floor(level * 3 * rand1)/100 * rand2/100));
                if (level > 24)
                    conditionNum += Math.round(level/4);
                if (level < 3)
                    conditionNum += level*2;

                var rand = Helpers.getRandom(1, 3);
                var conditionalPower = rand % 3 == 0 ? PowerTypesEnum.Angelic
                : rand % 3 == 1 ? PowerTypesEnum.Demonic
                : PowerTypesEnum.Ancestral;

                affix.Condition = new ItemAffixCondition(level, conditionNum, conditionalPower, conditionNum);
            }

            affix.PowerLevel = element.PowerLevel;
            itemAffixes.push(affix);
        });

        return itemAffixes;
    }

    private AddCategoryToAffixes(level:number, affixesList:ItemAffix[], rarity:ItemRarityTypesEnum):ItemAffix[] {
        var availableSkills:SkillVM[] = [];
        //1, 5, 12, 28
        var tiersToInclude:number[] = level < 6 ? [1] : level < 12 ? [1, 2] : level < 28 ? [1, 2, 3] : [1, 2, 3, 4];
        this.SkillPool.forEach(s => { if (tiersToInclude.indexOf(s.tier) != -1) availableSkills.push(s); });

        // Not enough affixes or quite a bit of conditional
        var conditionalAffixes = affixesList.filter(a => a.Condition).length;

        if (10-affixesList.length >4 && conditionalAffixes >=2 && rarity != ItemRarityTypesEnum.Magic)
        {
            var socketStat = new BasicAffixHelper().GetByIndex(AffixCategoryEnum.IncreaseBasicStat, level, 0, BasicStatTypesEnum.Socket, 0, this.SkillPool[0]);
            var socketAffix = new ItemAffix(ItemAffixTypeEnum.BasicStat, null, AffixCategoryEnum.IncreaseBasicStat, 0, null, null);
            socketAffix.Contents = socketStat;
            affixesList.push(socketAffix);
        }
        
        console.clear();
        affixesList.forEach(affix => {
            if (affix.AffixCategory == AffixCategoryEnum.PrimaryDamage)
                affix.Contents = new ItemAffixEnumsHelper(availableSkills).GetPrimaryItemAffix(affix.AffixCategory, this.ItemType, level, affix.PowerLevel, rarity, affix);
            else if (affix.AffixCategory == AffixCategoryEnum.PrimaryArmor)
                affix.Contents = new ItemAffixEnumsHelper(availableSkills).GetPrimaryItemAffix(affix.AffixCategory, this.ItemType, level, affix.PowerLevel, rarity, affix);
            else affix.Contents = new ItemAffixEnumsHelper(availableSkills).GetRandomTypeByIndex(this.ItemType, level, affix.PowerLevel, rarity, affix, this.GetSelectedSkill());

            // If Bow or Wand, Change cleave with ChainOrPierce
            if (this.ItemType == ItemCategoriesEnum.Weapon)
                if ((affix.ItemType == ItemWeaponTypesEnum.Bow || affix.ItemType == ItemWeaponTypesEnum.Wand) && affix.Contents.AffixData) {
                    if ((affix.Contents.AffixData as ItemTriggerStats).AffixType == TriggerAffixTypesEnum.Cleave)
                        (affix.Contents.AffixData as ItemTriggerStats).AffixType = TriggerAffixTypesEnum.ChainOrPierce;
                }
            
            affix.AffixCategory = affix.Contents.CategoryStat;
        });

        return affixesList;
    }

    private GetSelectedSkill() {
        return this.SkillPool[Helpers.getRandom(0, this.SkillPool.length -1)];
    }    

    //# region Generate Blueprints

    private GenerateMagicBlueprint(itemCategory:ItemCategoriesEnum, omitConditional?: boolean): ItemAffixBlueprint[] {
        var affixesBlueprint:ItemAffixBlueprint[] = [];

        var rand = Helpers.getRandom(1, 100);
        var empowerCond = rand % 5 == 0;
        var empowerUnc = rand % 7 == 0;

        // switch(itemCategory) {
        if (itemCategory ==  ItemCategoriesEnum.Armor) {
            // 2 Basic stats, 2 Defensive stats; 1 Conditional each
            affixesBlueprint.push(new ItemAffixBlueprint(ItemAffixTypeEnum.BasicStat, false))
            affixesBlueprint.push(new ItemAffixBlueprint(ItemAffixTypeEnum.Defensive, false));
            if (empowerUnc)
                affixesBlueprint[Helpers.getRandom(0,1)].PowerUp();

            if (!omitConditional) {
                affixesBlueprint.push(new ItemAffixBlueprint(ItemAffixTypeEnum.BasicStat, true));
                affixesBlueprint.push(new ItemAffixBlueprint(ItemAffixTypeEnum.Defensive, true));
                if (empowerCond)
                    affixesBlueprint[Helpers.getRandom(2,3)].PowerUp();
            }
        }
        else if (itemCategory ==  ItemCategoriesEnum.Weapon) {
            // 2 Ofensive stats, 2 random, 1 conditional each
            var selectedSecondary = rand % 3 == 0 ? ItemAffixTypeEnum.Damage : rand % 3 == 1 ? ItemAffixTypeEnum.TriggerEffect : ItemAffixTypeEnum.PowerUpSkill;
            affixesBlueprint.push(new ItemAffixBlueprint(ItemAffixTypeEnum.Offensive, false))
            affixesBlueprint.push(new ItemAffixBlueprint(selectedSecondary, false));
            if (empowerUnc)
                affixesBlueprint[Helpers.getRandom(0,1)].PowerUp();

            if (!omitConditional) {
                affixesBlueprint.push(new ItemAffixBlueprint(ItemAffixTypeEnum.Offensive, true))
                affixesBlueprint.push(new ItemAffixBlueprint(selectedSecondary, true));
                if (empowerCond)
                    affixesBlueprint[Helpers.getRandom(2,3)].PowerUp();
            }
        }
        else {
            // 2 PowerUpOrBasic stats, 2 random, 1 conditional each
            var selectedPrimary = rand % 2 == 0 ? ItemAffixTypeEnum.BasicStat : ItemAffixTypeEnum.PowerUpSkill;
            var selectedSecondary = rand % 3 == 0 ? ItemAffixTypeEnum.TriggerEffect : rand % 3 == 1 ? ItemAffixTypeEnum.Offensive : ItemAffixTypeEnum.Defensive;

            affixesBlueprint.push(new ItemAffixBlueprint(selectedPrimary, false));
            affixesBlueprint.push(new ItemAffixBlueprint(selectedSecondary, false))
            if (empowerUnc)
                affixesBlueprint[Helpers.getRandom(0,1)].PowerUp();

            if (!omitConditional) {
                affixesBlueprint.push(new ItemAffixBlueprint(selectedPrimary, true));
                affixesBlueprint.push(new ItemAffixBlueprint(selectedSecondary, true))
                if (empowerCond)
                    affixesBlueprint[Helpers.getRandom(0,1)].PowerUp();
            }
        }

        if (!omitConditional)
            affixesBlueprint.forEach(ab => { ab.PowerUp() });
        
        return affixesBlueprint;
    }

    private GenerateRareBlueprint(itemCategory:ItemCategoriesEnum, omitAdditional?:boolean): ItemAffixBlueprint[] {
        var affixesBlueprint = this.GenerateMagicBlueprint(itemCategory, true);

        // Add trigger or empower last stat
        var rand = Helpers.getRandom(1, 100);
        var addTrigger = rand % 4 == 0;
        var addPrimary = rand % 7 == 0 || rand % 13 == 0;
        var addSecondary = rand % 5 == 0 || rand % 11 == 0

        if (addTrigger)
            affixesBlueprint.push(new ItemAffixBlueprint(ItemAffixTypeEnum.TriggerEffect, rand % 3 == 0));
   
        var selectedPrimary:ItemAffixTypeEnum;
        var selectedSecondary:ItemAffixTypeEnum;
            
        if (itemCategory == ItemCategoriesEnum.Armor) {
            selectedPrimary = rand % 2 == 0 ? ItemAffixTypeEnum.Armor : ItemAffixTypeEnum.BasicStat;
            selectedSecondary = rand % 2 == 0 ? ItemAffixTypeEnum.PowerUpSkill : ItemAffixTypeEnum.Defensive;
        }
        else if (itemCategory == ItemCategoriesEnum.Weapon) {
            selectedPrimary = rand % 2 == 0 ? ItemAffixTypeEnum.Damage : ItemAffixTypeEnum.BasicStat;
            selectedSecondary = rand % 2 == 0 ? ItemAffixTypeEnum.TriggerEffect : ItemAffixTypeEnum.Offensive;
        }
        else {
            selectedPrimary = rand % 2 == 0 ? ItemAffixTypeEnum.PowerUpSkill : ItemAffixTypeEnum.BasicStat;
            selectedSecondary = rand % 2 == 0 ? ItemAffixTypeEnum.Offensive : ItemAffixTypeEnum.Defensive;
        }

        if (addPrimary)
            affixesBlueprint.push(new ItemAffixBlueprint(selectedPrimary, rand % 3 == 0));
        if (addSecondary)
            affixesBlueprint.push(new ItemAffixBlueprint(selectedSecondary, rand % 3 != 0));

        // Add 3 more random stats
        if (!omitAdditional)
        {
            var conditionalAdded = 0;
            var hasPredefined = addTrigger || addPrimary || addSecondary;
            var additionalAffixesList = hasPredefined ? [1,2,3] : [1,2,3,4];
            additionalAffixesList.forEach(element => {
                var randAdditional = Helpers.getRandom(1, 100);
                var selectedPrimary = itemCategory == ItemCategoriesEnum.Armor ? ItemAffixTypeEnum.Armor
                    : itemCategory == ItemCategoriesEnum.Weapon ? ItemAffixTypeEnum.Damage
                    : ItemAffixTypeEnum.PowerUpSkill;
    
                var selected = randAdditional % 4 == 0 ? selectedPrimary : Helpers.getRandom(1, 8);
                var affixBlueprint = new ItemAffixBlueprint(selected, randAdditional % 3 == 0);
                if (rand % 3 == 0)
                    conditionalAdded+=1;
    
                affixesBlueprint.push(affixBlueprint);
            });
    
            if (conditionalAdded >= 2)
            {
                var lastIndex1 = Helpers.getRandom(0, additionalAffixesList.length-2);
                var lastIndex2 = Helpers.getRandom(0, additionalAffixesList.length-2);

                affixesBlueprint[affixesBlueprint.length-1-lastIndex1].PowerUp();
                affixesBlueprint[affixesBlueprint.length-1-lastIndex2].PowerUp();
            }
        }
    
        return affixesBlueprint;
    }

    private GenerateLegendaryBlueprint(itemCategory:ItemCategoriesEnum): ItemAffixBlueprint[] {
        var affixesBlueprints = this.GenerateRareBlueprint(itemCategory, true);
        var rand = Helpers.getRandom(1, 100);

        var doublePowerUpCertainAffixes = rand % 4 == 0;
        var addNonStandardAffixes = rand % 4 == 1;
        var addAdditionalRandom = rand % 4 == 2;

        var primarySelected:ItemAffixTypeEnum;
        var secondarySelected:ItemAffixTypeEnum;
        var empowerPrimary:boolean;
        var empowerSecondary:boolean;

        // Scenario 1, add additional powerups to 2 random affixes (twice)
        if (doublePowerUpCertainAffixes) {
            var randomAffixToEmpower = Helpers.getRandom(1, affixesBlueprints.length - 1);
            affixesBlueprints[randomAffixToEmpower].PowerUp();
            affixesBlueprints[randomAffixToEmpower].PowerUp();
            affixesBlueprints[randomAffixToEmpower-1].PowerUp();
            affixesBlueprints[randomAffixToEmpower-1].PowerUp();
        }
        // Scenario 2, add non-Standard for item type affixes (damage on Armor, defense on Weapon, armor/damage on jewelry ...)
        else if (addNonStandardAffixes)
        {
            if (itemCategory == ItemCategoriesEnum.Armor) {
                primarySelected = rand % 2 == 0 ? ItemAffixTypeEnum.Damage : ItemAffixTypeEnum.Offensive;
                secondarySelected = rand % 2 == 0 ? ItemAffixTypeEnum.PowerUpSkill : ItemAffixTypeEnum.TriggerEffect;
            }
            else if (itemCategory == ItemCategoriesEnum.Weapon) {
                primarySelected = rand % 2 == 0 ? ItemAffixTypeEnum.BasicStat : ItemAffixTypeEnum.PowerUpSkill;
                secondarySelected = rand % 2 == 0 ? ItemAffixTypeEnum.Armor : ItemAffixTypeEnum.Defensive;
            }
            else {
                primarySelected = rand % 2 == 0 ? ItemAffixTypeEnum.Armor : ItemAffixTypeEnum.Damage;
                secondarySelected = rand % 2 == 0 ? ItemAffixTypeEnum.SecondaryTrigger : ItemAffixTypeEnum.TriggerEffect;
                if (secondarySelected == ItemAffixTypeEnum.TriggerEffect)
                    empowerSecondary = true;
                
                affixesBlueprints.push(new ItemAffixBlueprint(primarySelected, rand % 3 == 0));
                affixesBlueprints.push(new ItemAffixBlueprint(secondarySelected, rand % 3 == 0));

                if (empowerSecondary)
                    affixesBlueprints[affixesBlueprints.length-1].PowerUp();

                if (rand % 3 == 0) {
                    affixesBlueprints[affixesBlueprints.length-1].PowerUp();
                    affixesBlueprints[affixesBlueprints.length-2].PowerUp();
                }
            }
        }
        // Scenario 2, add 2 additional random affixes, same/similar as Rare [Empower them, TWICE]
        else if (addAdditionalRandom) {
            var conditionalAdded = 0;
            [1, 2].forEach(element => {
                var randAdditional = Helpers.getRandom(1, 100);
                var selectedPrimary = itemCategory == ItemCategoriesEnum.Armor ? ItemAffixTypeEnum.Armor
                    : itemCategory == ItemCategoriesEnum.Weapon ? ItemAffixTypeEnum.Damage
                    : ItemAffixTypeEnum.PowerUpSkill;
    
                var selected = randAdditional % 4 == 0 ? selectedPrimary : Helpers.getRandom(1, 8);
                var affixBlueprint = new ItemAffixBlueprint(selected, rand % 3 == 0);
                if (rand % 3 == 0)
                conditionalAdded+=1;
    
                affixesBlueprints.push(affixBlueprint);
            });

            // Empower one of these, TWICE
            var lastFewRand = Helpers.getRandom(0, 2);
            affixesBlueprints[affixesBlueprints.length-1-lastFewRand].PowerUp();
            affixesBlueprints[affixesBlueprints.length-1-lastFewRand].PowerUp();
        }
        // Scenario 4, add additional (conditional) random legendary affix
        else {
            affixesBlueprints.push(new ItemAffixBlueprint(ItemAffixTypeEnum.Legendary, true));
            // Empower the most primrary affix
            affixesBlueprints[0].PowerUp();
        }

        // Add THE Legendary affix
        affixesBlueprints.push(new ItemAffixBlueprint(ItemAffixTypeEnum.Legendary, false));

        return affixesBlueprints;
    }

    //# endregion
}
