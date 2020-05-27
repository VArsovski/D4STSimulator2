import { ItemCategoriesEnum, ItemAffixTypeEnum, ItemWeaponTypesEnum, ItemJewelryTypesEnum, ItemArmorTypesEnum, ItemRarityTypesEnum, AffixCategoryEnum, BasicStatTypesEnum, SecondaryStatTypesEnum, DefensiveStatCategoryEnum, DefensiveStatsEnum, ResistanceTypesEnum } from "../../_Enums/itemAffixEnums";
import { ItemAffix } from './ItemAffix';
import { Helpers } from 'src/_Helpers/helpers';
import { ItemAffixBlueprint } from './ItemAffixBlueprint';
import { ItemAffixCondition } from './ItemAffixCondition';
import { PowerTypesEnum } from 'src/_Enums/powerTypesEnum';
import { SkillVM } from '../SkillVM';
import { ItemDamageStats } from './Details/ItemDamageStats';
import { ItemAffixEnumsHelper } from './AffixHelpers/ItemAffixEnumsHelper';
import { BasicAffixHelper } from './AffixHelpers/BasicAffixHelper';
import { ItemDamageEmpowerStats } from './Details/ItemDamageEmpowerStats';

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
    
        return affixesList;
    }

    public GenerateWeaponAffixes(level:number, itemType: ItemWeaponTypesEnum, rarity: ItemRarityTypesEnum): ItemAffix[] {
        if (!this.ItemType)
            this.ItemType = ItemCategoriesEnum.Weapon;

        var affixesList:ItemAffix[] = [];
        var affixesListBlueprint = this.GenerateBluePrintByRarityAndType(ItemCategoriesEnum.Weapon, rarity);

        // Insert/Add these affixes as first
        affixesListBlueprint.unshift(new ItemAffixBlueprint(ItemAffixTypeEnum.Damage, false, AffixCategoryEnum.PrimaryDamage));
        affixesListBlueprint.unshift(new ItemAffixBlueprint(ItemAffixTypeEnum.Damage, false, AffixCategoryEnum.PrimaryDamage));

        affixesList = this.AddConditionsToAffixesFromBlueprint(level, affixesListBlueprint, rarity);
        affixesList.forEach(a => a.ItemCategory = ItemCategoriesEnum.Weapon);
        affixesList = this.AddCategoryToAffixes(level, affixesList, rarity);

        // Set primary affix (the one with index 0)
        var selectedDamage = new ItemDamageStats(AffixCategoryEnum.PrimaryDamage, level, 1, itemType, null, null, null, Helpers.getRandom(1,5));
        var selectedDamageEmpower = new ItemDamageEmpowerStats(AffixCategoryEnum.PrimaryDamage, Helpers.getRandom(3, 4), level, 0, 0, rarity, null);
        // TODO: Kinda weird that there the function gets out of the AffixData container..
        var selectedPrimaryDamageAffix = Helpers.getRandom(1, 100) % 5 == 0 ? selectedDamage : selectedDamageEmpower;
        affixesList[1].Contents.AffixData = selectedPrimaryDamageAffix;
        affixesList[1].Contents.updateEquippedStats = selectedPrimaryDamageAffix.updateEquippedStats;
        
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
        
        affixesList.forEach((affix, index) => {
            // !@#$!@#$!@#$!@#$ TODO: Rework Deciding logic here
            // affixData.CategoryStat = isPrimary ? AffixCategoryEnum.PrimaryDamage : AffixCategoryEnum.IncreaseDamage;
            // var addPrimary = isPrimary;
            // var addEmpower = (itemType == ItemCategoriesEnum.Weapon && isPrimary) || (!isPrimary && itemType != ItemCategoriesEnum.Weapon);

            // if (! (isPrimary || addEmpower)) {
            //     addPrimary = itemType == ItemCategoriesEnum.Weapon;
            //     addEmpower = itemType != ItemCategoriesEnum.Weapon;
            // }

            if (affix.AffixCategory == AffixCategoryEnum.PrimaryDamage) {
                var selectedWeaponType = Helpers.getRandom(1, 7);
                var selectedElementType = selectedWeaponType == ItemWeaponTypesEnum.Wand || selectedWeaponType == ItemWeaponTypesEnum.Staff ? Helpers.getRandom(1,5) : ResistanceTypesEnum.Physical;
                affix.Contents = new ItemAffixEnumsHelper(availableSkills).GetPrimaryDamageAffix(affix.AffixCategory, selectedWeaponType, selectedElementType, level, affix.PowerLevel, rarity, affix, index == 0);
            }
            else if (affix.AffixCategory == AffixCategoryEnum.PrimaryArmor) {
                var itemArmorType = Helpers.getRandom(1,5);
                var armorType = Helpers.getRandom(1,3);
                affix.Contents = new ItemAffixEnumsHelper(availableSkills).GetPrimaryArmorAffix(affix.AffixCategory, itemArmorType, armorType, level, affix.PowerLevel, rarity, affix, index == 0);
            }
            else affix.Contents = new ItemAffixEnumsHelper(availableSkills).GetRandomTypeByIndex(this.ItemType, level, affix.PowerLevel, rarity, affix, this.GetSelectedSkill(), index == 0);

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
        var empowerCond = !omitConditional && rand % 5 == 0;
        var empowerUnc = rand % 11 == 0;

        // switch(itemCategory) {
        if (itemCategory == ItemCategoriesEnum.Armor) {
            // 2 Basic stats, 2 Defensive stats; 1 Conditional each
            affixesBlueprint.push(new ItemAffixBlueprint(ItemAffixTypeEnum.BasicStat, false))
            affixesBlueprint.push(this.GetPrimaryArmorBlueprint(rand % 3 == 0));
            affixesBlueprint.push(this.GetSecondaryArmorBlueprint(false));
            if (!omitConditional) {
                var usePrimaryStat = rand % 7 > 4;
                if (usePrimaryStat)
                    affixesBlueprint.push(this.GetPrimaryArmorBlueprint(rand % 11 < 3));
                else affixesBlueprint.push(this.GetSecondaryArmorBlueprint(rand % 11 < 3));
            }
        }
        else if (itemCategory == ItemCategoriesEnum.Weapon) {
            // 2 Ofensive stats, 2 random, 1 conditional each
            affixesBlueprint.push(new ItemAffixBlueprint(ItemAffixTypeEnum.Offensive, false));
            affixesBlueprint.push(this.GetPrimaryDamageBlueprint(false));
            if (!omitConditional) {
                affixesBlueprint.push(new ItemAffixBlueprint(ItemAffixTypeEnum.TriggerEffect, true))
                affixesBlueprint.push(this.GetSecondaryDamageBlueprint(true));
                if (empowerCond)
                    affixesBlueprint[Helpers.getRandom(2,3)].PowerUp();
            }
        }
        else {
            // 2 PowerUpOrBasic stats, 2 random, 1 conditional each
            affixesBlueprint.push(this.GetPrimaryJewelryBlueprint(false));
            affixesBlueprint.push(this.GetPrimaryJewelryBlueprint(false));
            if (empowerUnc)
                affixesBlueprint[Helpers.getRandom(0, !omitConditional ? 2 : 1)].PowerUp();
            if (!omitConditional) {
                affixesBlueprint.push(this.GetPrimaryJewelryBlueprint(true));
                affixesBlueprint.push(this.GetSecondaryJewelryBlueprint(true))
            }
        }

        if (empowerUnc)
            affixesBlueprint[Helpers.getRandom(0, 1)].PowerUp();
        if (empowerCond)
            affixesBlueprint[Helpers.getRandom(2,3)].PowerUp();

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
            selectedPrimary = this.GetPrimaryArmorBlueprint(Helpers.getRandom(1, 100) % 3 == 0).AffixType;
            selectedSecondary = this.GetSecondaryArmorBlueprint(Helpers.getRandom(1, 100) % 3 == 0).AffixType;//rand % 2 == 0 ? ItemAffixTypeEnum.PowerUpSkill : ItemAffixTypeEnum.Defensive;
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
                var selectedPrimary = itemCategory == ItemCategoriesEnum.Armor ? this.GetPrimaryArmorBlueprint(randAdditional % 3 == 0).AffixType
                    : itemCategory == ItemCategoriesEnum.Weapon ? this.GetPrimaryDamageBlueprint(randAdditional % 3 == 0).AffixType
                    : this.GetPrimaryJewelryBlueprint(randAdditional % 3 == 0).AffixType;

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
            [1, 2].forEach(t => {
                var randomAffixToEmpower = Helpers.getRandom(1, affixesBlueprints.length - 1);
                affixesBlueprints[randomAffixToEmpower].PowerUp();
                affixesBlueprints[randomAffixToEmpower].PowerUp();
            })
        }

        // Scenario 2, add non-Standard for item type affixes (damage on Armor, defense on Weapon, armor/damage on jewelry ...)
        else if (addNonStandardAffixes)
        {
            if (itemCategory == ItemCategoriesEnum.Armor) {
                primarySelected = rand % 2 == 0 ? ItemAffixTypeEnum.Damage : ItemAffixTypeEnum.Offensive;
                secondarySelected = rand % 2 == 0 ? ItemAffixTypeEnum.Offensive : ItemAffixTypeEnum.TriggerEffect;
            }
            else if (itemCategory == ItemCategoriesEnum.Weapon) {
                primarySelected = rand % 2 == 0 ? ItemAffixTypeEnum.BasicStat : ItemAffixTypeEnum.Defensive;
                secondarySelected = rand % 2 == 0 ? ItemAffixTypeEnum.Defensive : ItemAffixTypeEnum.TriggerEffect;
            }
            else {
                primarySelected = rand % 2 == 0 ? ItemAffixTypeEnum.Armor : ItemAffixTypeEnum.Damage;
                secondarySelected = this.GetPrimaryJewelryBlueprint(false).AffixType;
            }

            if ([ItemAffixTypeEnum.TriggerEffect, ItemAffixTypeEnum.SecondaryTrigger].includes(secondarySelected))
                empowerPrimary = true;

            affixesBlueprints.push(new ItemAffixBlueprint(primarySelected, Helpers.getRandom(1, 100) % 3 != 0));
            if (empowerPrimary) {
                affixesBlueprints[0].PowerUp();
                affixesBlueprints[0].PowerUp();
            }

            affixesBlueprints.push(new ItemAffixBlueprint(secondarySelected, Helpers.getRandom(1, 100) % 3 != 0));
            affixesBlueprints[affixesBlueprints.length - 1].PowerUp();
        }
        
        // Scenario 3, add 2 additional random affixes, same/similar as Rare [Empower them, THRICE]
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
            affixesBlueprints[affixesBlueprints.length-1-lastFewRand].PowerUp();
        }
        // Scenario 4, add additional legendary affixes (1 conditional and empowered)
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

    //# region RandomAffixForBlueprintCreation

    private GetPrimaryDamageBlueprint(conditional:boolean):ItemAffixBlueprint {
        var rand = Helpers.getRandom(1, 100);
        var selectedPrimary = rand % 3 != 0 ? ItemAffixTypeEnum.Damage : ItemAffixTypeEnum.Offensive;
        return new ItemAffixBlueprint(selectedPrimary, conditional);
    }

    private GetPrimaryArmorBlueprint(conditional:boolean):ItemAffixBlueprint {
        var rand = Helpers.getRandom(1, 100);
        var useArmor = rand % 8 >= 5; //3/8
        var usePrimaryStat = rand % 11 <= 3 //3/11;
        var useDefensive = rand % 15 >= 5 //1/3 of rest;

        DefensiveStatsEnum

        var selectedPrimary = useArmor ? ItemAffixTypeEnum.Armor
                            : usePrimaryStat ? ItemAffixTypeEnum.BasicStat
                            : useDefensive ? ItemAffixTypeEnum.Defensive
                            : ItemAffixTypeEnum.PowerUpSkill;

        return new ItemAffixBlueprint(selectedPrimary, conditional);
    }

    private GetPrimaryJewelryBlueprint(conditional:boolean):ItemAffixBlueprint {
        var rand = Helpers.getRandom(1, 100);
        var useBasicStat = rand % 3 == 0;
        var useSkillEmpowerStat = rand % 7 > 2;
        var useDamage = rand % 13 != 0;

        var selectedPrimary = useBasicStat ? ItemAffixTypeEnum.BasicStat
                            : useSkillEmpowerStat ? ItemAffixTypeEnum.PowerUpSkill
                            : useDamage ? ItemAffixTypeEnum.Damage
                            : ItemAffixTypeEnum.TriggerEffect;
        return new ItemAffixBlueprint(selectedPrimary, conditional);
    }

    private GetSecondaryDamageBlueprint(conditional:boolean):ItemAffixBlueprint {
        var rand = Helpers.getRandom(1, 100);
        var selectedSecondary = rand % 3 != 0 ? ItemAffixTypeEnum.TriggerEffect: ItemAffixTypeEnum.Damage;
        return new ItemAffixBlueprint(selectedSecondary, conditional);
    }

    private GetSecondaryArmorBlueprint(conditional:boolean):ItemAffixBlueprint {
        var rand = Helpers.getRandom(1, 100);
        var useSecondaryStat = rand % 8 >= 5; // 3/8
        var useDefensive = rand % 11 <= 3 // 3/11;
        var useTriggerStat = rand % 15 >= 5;//1/3 rest
        var selectedPrimary = useSecondaryStat ? ItemAffixTypeEnum.SecondaryDefensiveStat
                            : useDefensive ? ItemAffixTypeEnum.SecondaryStat
                            : useTriggerStat ? ItemAffixTypeEnum.Defensive
                            : ItemAffixTypeEnum.SecondaryTrigger;

        return new ItemAffixBlueprint(selectedPrimary, conditional);
    }

    private GetSecondaryJewelryBlueprint(conditional:boolean):ItemAffixBlueprint {
        var rand = Helpers.getRandom(1, 100);
        var selectedSecondary = rand % 3 == 0 ? ItemAffixTypeEnum.TriggerEffect : rand % 3 == 1 ? ItemAffixTypeEnum.Offensive : ItemAffixTypeEnum.Defensive;
        return new ItemAffixBlueprint(selectedSecondary, conditional);
    }

    //# endregion
}
