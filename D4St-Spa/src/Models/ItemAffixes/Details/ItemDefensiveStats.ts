import { IDescribable } from '../IDescribable';
import { DefensiveStatCategoryEnum, DefensiveStatsEnum, DamageTypesEnum, AttackTypesEnum, CCEffectTypesEnum, ResistanceTypesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { IPowerUp } from '../IPowerUp';

export class ItemDefensiveStatsDetail implements IDescribable {
    private Amount?:number;
    private AmountPercentage?:number;
    private Duration?:number;
    private Chance?: number;
    private DefensiveAffixStatCategories:DefensiveStatCategoryEnum[];
    private Type:DefensiveStatsEnum;
    private selectedStat:string;

    GetDescription(): string {
        var str = "";

        var defensiveAffixStatCategoryStr = "";
        this.DefensiveAffixStatCategories.forEach(element => {
            if (str.length == 0)
            defensiveAffixStatCategoryStr += " " + Helpers.getPropertyByValue(DefensiveStatCategoryEnum, element);
            else defensiveAffixStatCategoryStr += " and " + Helpers.getPropertyByValue(DefensiveStatCategoryEnum, element);
        });

        var quantifier = this.Amount;
        var quantifierPercentage = this.AmountPercentage + "%";

        var damageType = Helpers.getPropertyByValue(DamageTypesEnum, Helpers.getRandom(1 ,5));
        var attackType = Helpers.getPropertyByValue(AttackTypesEnum, Helpers.getRandom(1 ,5));
        var ccType = Helpers.getPropertyByValue(CCEffectTypesEnum, Helpers.getRandom(1 ,5));

        if (this.Type == DefensiveStatsEnum.CCEffects)
        {
            if (this.AmountPercentage)
                str += "Decrease " + defensiveAffixStatCategoryStr + " of " + ccType + " " +  Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " by " + quantifierPercentage;
            if (this.Amount)
                str += this.Amount + " less stamina taken per " + ccType + Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type);
        }
        if (this.Type == DefensiveStatsEnum.PotionAndGlobe)
        {
            if (this.AmountPercentage)
                str += "Increase " + Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + defensiveAffixStatCategoryStr + " by " + this.AmountPercentage;
            if (this.Amount)
                str += "Increase " + Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + defensiveAffixStatCategoryStr + " by " + this.Amount;
        }
        if (this.Type == DefensiveStatsEnum.DamageTaken)
        {
            if (this.AmountPercentage)
                str += Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " of type " + damageType + " reduced by " + quantifierPercentage;
            if (this.Amount)
                str += Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " of type " + damageType + " reduced by " + quantifier;
        }
        if (this.Type == DefensiveStatsEnum.AttacksTaken)
        {
            if (this.AmountPercentage)
                str += Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " of type " + attackType + " reduced by " + quantifierPercentage;
            if (this.Amount)
                str += Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " of type " + attackType + " reduced by " + quantifier;
        }
        if (this.Type == DefensiveStatsEnum.ThornsDamage)
        {
            if (this.AmountPercentage)
                str += quantifierPercentage + " " + Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " as " + Helpers.getPropertyByValue(ResistanceTypesEnum, Helpers.getRandom(1, 5));
            if (this.Amount)
                str += quantifier + " " + Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " as " + Helpers.getPropertyByValue(ResistanceTypesEnum, Helpers.getRandom(1, 5));
        }
        if (this.Type == DefensiveStatsEnum.DamageStaggered)
        {
            if (this.AmountPercentage)
                str += quantifierPercentage + " " + Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " of type " + damageType + " for " + this.Duration + " seconds";
            if (this.Amount)
                str += quantifier + " " + Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " for " + this.Duration + " seconds";
        }
        if (this.Type == DefensiveStatsEnum.LifestealOrShielding)
        {
            if (this.AmountPercentage)
                str += quantifierPercentage + " of " +  damageType + " damage returned as " + Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " for " + this.Duration + " seconds";
            if (this.Amount)
                str += this.Chance + "% chance " + " of " +  attackType + " attacks to return as " + Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type);
        }
        if (this.Type == DefensiveStatsEnum.Socket)
            str += "Socket";

        return str;
    }

    constructor(amount:number, amountPercentage:number, chance:number, duration:number, type: DefensiveStatsEnum, defensiveStatCategories: DefensiveStatCategoryEnum[]) {
        
        this.Amount = amount;
        this.AmountPercentage = amountPercentage;
        this.Chance = chance;
        this.Duration = duration;
        this.Type = type;
        this.DefensiveAffixStatCategories = defensiveStatCategories;
    }
}

export class ItemDefensiveStats implements IDescribable, IPowerUp {
    CCDamageAndDurationReduced?:ItemDefensiveStatsDetail;
    PotionAndGlobeBonus?:ItemDefensiveStatsDetail;
    DamageTypeTakenReduced?:ItemDefensiveStatsDetail;
    AttackTypeTakenReduced?:ItemDefensiveStatsDetail;
    ThornsDamage?:ItemDefensiveStatsDetail;
    DamageStaggered?:ItemDefensiveStatsDetail;
    LifestealOrShielding?:ItemDefensiveStatsDetail;
    Socket:number;
    private PowerLevel: number;
    private selectedStat:string;

    GetDescription(): string {
        var descr1 = (this.CCDamageAndDurationReduced) ? this.CCDamageAndDurationReduced.GetDescription() : "";
        var descr2 = (this.PotionAndGlobeBonus) ? this.PotionAndGlobeBonus.GetDescription() : "";
        var descr3 = (this.DamageTypeTakenReduced) ? this.DamageTypeTakenReduced.GetDescription() : "";
        var descr4 = (this.AttackTypeTakenReduced) ? this.AttackTypeTakenReduced.GetDescription() : "";
        var descr5 = (this.ThornsDamage) ? this.ThornsDamage.GetDescription() : "";
        var descr6 = (this.DamageStaggered) ? this.DamageStaggered.GetDescription() : "";
        var descr7 = (this.LifestealOrShielding) ? this.LifestealOrShielding.GetDescription() : "";
        var descr8 = (this.Socket) ? "Socket" : "";

        return descr1 + descr2 + descr3 + descr4 + descr5 + descr6 + descr7 + descr8;
    }

    constructor(amount:number, amountPercentage:number, chance:number, duration:number, type:DefensiveStatsEnum, affectedCategories?:DefensiveStatCategoryEnum[]) {

        this.Socket = 0;
        this.PowerLevel = 0;
        this.Level = 1;
        var appropriateCategories = affectedCategories ? affectedCategories : this.GenerateAppropriateCategoriesByType(type);

        // Instead of adressing this relatively weaker stat from outside we address it here..
        if (type == DefensiveStatsEnum.CCEffects && amount && !amountPercentage)
            amount *= 2.5;

        var newDefensiveAffixStats = new ItemDefensiveStatsDetail(amount, amountPercentage, chance, duration, type, appropriateCategories);
        if (type == DefensiveStatsEnum.CCEffects)
        {
            this.CCDamageAndDurationReduced = newDefensiveAffixStats;
            this.selectedStat = "CCDamageAndDurationReduced";
        }
        if (type == DefensiveStatsEnum.PotionAndGlobe)
        {
            this.PotionAndGlobeBonus = newDefensiveAffixStats;
            this.selectedStat = "PotionAndGlobeBonus";
        }
        if (type == DefensiveStatsEnum.DamageTaken)
        {
            this.DamageTypeTakenReduced = newDefensiveAffixStats;
            this.selectedStat = "DamageTypeTakenReduced";
        }
        if (type == DefensiveStatsEnum.AttacksTaken)
        {
            this.AttackTypeTakenReduced = newDefensiveAffixStats;
            this.selectedStat = "AttackTypeTakenReduced";
        }
        if (type == DefensiveStatsEnum.ThornsDamage)
        {
            this.ThornsDamage = newDefensiveAffixStats;
            this.selectedStat = "ThornsDamage";
        }
        if (type == DefensiveStatsEnum.DamageStaggered)
        {
            this.DamageStaggered = newDefensiveAffixStats;
            this.selectedStat = "DamageStaggered";
        }
        if (type == DefensiveStatsEnum.LifestealOrShielding)
        {
            this.LifestealOrShielding = newDefensiveAffixStats;
            this.selectedStat = "LifestealOrShielding";
        }
        if (type == DefensiveStatsEnum.Socket)
        {
            this.Socket++;
            this.selectedStat = "Socket";
        }
    }

    private GenerateAppropriateCategoriesByType(type:DefensiveStatsEnum, quantifier?:number, percentage?:number) {
        var categories:DefensiveStatCategoryEnum[] = [];

        var damageUpgrades = [DefensiveStatsEnum.AttacksTaken
            , DefensiveStatsEnum.DamageTaken
            // , DefensiveStatsEnum.DamageStaggered //Damage is covered by "Amount, or amount %"
            , DefensiveStatsEnum.ThornsDamage
            // , DefensiveStatsEnum.LifestealOrShielding // Same, Damage covered by "Amount/% value"
        ];

        var durationUpgrades = [DefensiveStatsEnum.CCEffects, DefensiveStatsEnum.DamageStaggered, DefensiveStatsEnum.LifestealOrShielding];
        var chanceUpgrades = [DefensiveStatsEnum.LifestealOrShielding];
        if (quantifier)
            chanceUpgrades.push(DefensiveStatsEnum.CCEffects);

        var bonusUpgrades = [DefensiveStatsEnum.PotionAndGlobe];
        
        if (damageUpgrades.indexOf(type) != -1)
            categories.push(DefensiveStatCategoryEnum.Damage);
        if (durationUpgrades.indexOf(type) != -1)
            categories.push(DefensiveStatCategoryEnum.Duration);
        if (chanceUpgrades.indexOf(type) != -1)
            categories.push(DefensiveStatCategoryEnum.Chance);
        if (bonusUpgrades.indexOf(type) != -1)
            categories.push(DefensiveStatCategoryEnum.Bonus);

        return categories;
    }

    PowerUp(){
        this.PowerLevel++;
    }

    GetData() {
        var varianceToEmpower = (100 + Helpers.getRandom(120, 140))/100;
        if (this.selectedStat)
        {
            if (this.selectedStat != "Socket") {
                this[this.selectedStat].Amount *= Math.pow(varianceToEmpower, this.PowerLevel);
                this[this.selectedStat].AmountPercentage *= Math.pow(varianceToEmpower, this.PowerLevel);
            }
            else this.Socket++;
        }
        return this;
    }
    SetLevel(level: number) { this.Level = level; }
    Level: number;    
}
