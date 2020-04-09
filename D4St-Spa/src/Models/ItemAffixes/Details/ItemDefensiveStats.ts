import { IDescribable } from '../IDescribable';
import { DefensiveStatCategoryEnum, DefensiveStatsEnum, DamageTypesEnum, AttackTypesEnum, ResistanceTypesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { CCEffectTypesEnum } from 'src/_Enums/triggerAffixEnums';

export class ItemDefenseStats implements IDescribable {
    CCDamageAndDurationReduced?:ItemDefensiveStatsDetail;
    PotionAndGlobeBonus?:ItemDefensiveStatsDetail;
    DamageTypeTakenReduced?:ItemDefensiveStatsDetail;
    AttackTypeTakenReduced?:ItemDefensiveStatsDetail;
    ThornsDamage?:ItemDefensiveStatsDetail;
    DamageStaggered?:ItemDefensiveStatsDetail;
    LifestealOrShielding?:ItemDefensiveStatsDetail;
    Socket:ItemDefensiveStatsDetail;
    private PowerLevel: number;
    private selectedStat:string;
    private statsCalculated:boolean;

    GetDescription(): string {
        var data = this.GetData();
        var socketPowerPercentage = (new CalculationsHelper().getEmpoweredValue(Helpers.getRandom(20, 30) + Helpers.getRandom(-5, 5), data.PowerLevel) + (10 - data.Level/4)).toFixed(0);
        var descr1 = (data.CCDamageAndDurationReduced) ? data.CCDamageAndDurationReduced.GetDescription() : "";
        var descr2 = (data.PotionAndGlobeBonus) ? data.PotionAndGlobeBonus.GetDescription() : "";
        var descr3 = (data.DamageTypeTakenReduced) ? data.DamageTypeTakenReduced.GetDescription() : "";
        var descr4 = (data.AttackTypeTakenReduced) ? data.AttackTypeTakenReduced.GetDescription() : "";
        var descr5 = (data.ThornsDamage) ? data.ThornsDamage.GetDescription() : "";
        var descr6 = (data.DamageStaggered) ? data.DamageStaggered.GetDescription() : "";
        var descr7 = (data.LifestealOrShielding) ? data.LifestealOrShielding.GetDescription() : "";
        var descr8 = data.Socket.Amount != 0 ? "Defensive Sockets empowered by " + socketPowerPercentage + "%": "";

        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", data.PowerLevel);
        return descr1 + descr2 + descr3 + descr4 + descr5 + descr6 + descr7 + descr8 + empoweredStr;
    }

    constructor(level:number, powerLevel:number, amount:number, amountPercentage:number, chance:number, duration:number, type:DefensiveStatsEnum, affectedCategories?:DefensiveStatCategoryEnum[]) {
        this.Socket = new ItemDefensiveStatsDetail(0, 0, 0, 0, DefensiveStatsEnum.Socket, []);
        this.PowerLevel = powerLevel;
        this.Level = level;
        var appropriateCategories = affectedCategories ? affectedCategories : this.GenerateAppropriateCategoriesByType(type);

        // Instead of adressing this relatively weaker stat from outside we address it here..
        if (type == DefensiveStatsEnum.DamageStaggered && amount && !amountPercentage)
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
            this.Socket.Amount++;
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

    GetData() {
        var data = new ItemDefenseStats(this.Level, this.PowerLevel, this[this.selectedStat].Amount, this[this.selectedStat].AmountPercentage, this[this.selectedStat].Chance, this[this.selectedStat].Duration, this[this.selectedStat].Type, null); //No biggie, categories will recreate themselves from type
        data.selectedStat = this.selectedStat;

        if (!this.statsCalculated) {
            if (data.selectedStat)
            {
                if (data.selectedStat != "Socket") {
                    data[data.selectedStat].Amount = new CalculationsHelper().getEmpoweredValue(data[data.selectedStat].Amount, data.PowerLevel);
                    data[data.selectedStat].AmountPercentage = new CalculationsHelper().getEmpoweredValue(data[data.selectedStat].AmountPercentage, data.PowerLevel);
                }
                else
                    data[data.selectedStat].Amount++;
            }
            // var data = new ItemDefenseStats(this.Level, this[this.selectedStat].Amount, this[this.selectedStat].AmountPercentage, this[this.selectedStat].Chance, this[this.selectedStat].Duration, this[this.selectedStat].Type, null); //No biggie, categories will recreate themselves from type
            data[data.selectedStat].Amount = new CalculationsHelper().getEmpoweredValue(data[data.selectedStat].Amount, data.PowerLevel);
            data[data.selectedStat].AmountPercentage = new CalculationsHelper().getEmpoweredValue(data[data.selectedStat].AmountPercentage, data.PowerLevel);
        }
    
        this.statsCalculated = true;
        return data;
    }
    SetLevel(level: number) { this.Level = level; }
    Level: number;    
}

export class ItemDefensiveStatsDetail implements IDescribable {
    Amount?:number;
    private AmountPercentage?:number;
    private Duration?:number;
    private Chance?: number;
    private DefensiveAffixStatCategories:DefensiveStatCategoryEnum[];
    private Type:DefensiveStatsEnum;
    // private selectedStat:string;
    private Socket:number;

    GetDescription(): string {
        var str = "";

        var defensiveAffixStatCategoryStr = "";
        this.DefensiveAffixStatCategories.forEach(element => {
            if (str.length == 0)
            defensiveAffixStatCategoryStr += " " + Helpers.getPropertyByValue(DefensiveStatCategoryEnum, element);
            else defensiveAffixStatCategoryStr += " and " + Helpers.getPropertyByValue(DefensiveStatCategoryEnum, element);
        });

        var damageType = Helpers.getPropertyByValue(DamageTypesEnum, Helpers.getRandom(1 ,8));
        var attackType = Helpers.getPropertyByValue(AttackTypesEnum, Helpers.getRandom(1 ,5));
        var ccType = Helpers.getPropertyByValue(CCEffectTypesEnum, Helpers.getRandom(1 ,5));

        if (this.Type == DefensiveStatsEnum.CCEffects)
        {
            if (this.AmountPercentage)
                str += "Decrease " + defensiveAffixStatCategoryStr + " of " + ccType + " " +  Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " by " + this.AmountPercentage;
            if (!str)
            if (this.Amount)
                str += this.Amount + "%" + " less stamina per " + ccType + Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " suffered";
        }
        if (this.Type == DefensiveStatsEnum.PotionAndGlobe)
        {
            if (this.AmountPercentage)
                str += "Increase " + Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + defensiveAffixStatCategoryStr + " by " + this.AmountPercentage;
            if (this.Amount)
            if (!str)
                str += "Increase " + Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + defensiveAffixStatCategoryStr + " by " + this.Amount;
        }
        if (this.Type == DefensiveStatsEnum.DamageTaken)
        {
            if (this.AmountPercentage)
                str += Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " of type " + damageType + " reduced by " + this.AmountPercentage + "%";
            if (this.Amount)
            if (!str)
                str += Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " of type " + damageType + " reduced by " + this.Amount;
        }
        if (this.Type == DefensiveStatsEnum.AttacksTaken)
        {
            if (this.AmountPercentage)
                str += Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " of type " + attackType + " reduced by " + this.AmountPercentage + "%";
            if (this.Amount)
            if (!str)
                str += Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " of type " + attackType + " reduced by " + this.Amount;
        }
        if (this.Type == DefensiveStatsEnum.ThornsDamage)
        {
            if (this.AmountPercentage)
                str += this.AmountPercentage + "% " + Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " as " + Helpers.getPropertyByValue(ResistanceTypesEnum, Helpers.getRandom(1, 5));
            if (this.Amount)
            if (!str)
                str += this.Amount + " " + Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " as " + Helpers.getPropertyByValue(ResistanceTypesEnum, Helpers.getRandom(1, 5));
        }
        if (this.Type == DefensiveStatsEnum.DamageStaggered)
        {
            if (this.AmountPercentage)
                str += this.AmountPercentage + "% " + Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " of type " + damageType + " for " + this.Duration + " seconds";
            if (this.Amount)
            if (!str)
                str += this.Amount + " " + Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " for " + this.Duration + " seconds";
        }
        if (this.Type == DefensiveStatsEnum.LifestealOrShielding)
        {
            if (this.AmountPercentage)
                str += this.AmountPercentage + "% of " +  damageType + " damage returned as " + Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " for " + this.Duration + " seconds";
            if (this.Amount)
            if (!str)
                str += this.Chance + "% chance " + " of " +  attackType + " attacks to return as " + Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type);
        }
        // if (this.Type == DefensiveStatsEnum.Socket)
        //     str += "Socket";

        return str;
    }

    constructor(amount:number, amountPercentage:number, chance:number, duration:number, type: DefensiveStatsEnum, defensiveStatCategories: DefensiveStatCategoryEnum[]) {
        this.Socket = 0;
        this.Amount = amount;
        this.AmountPercentage = amountPercentage;
        this.Chance = chance;
        this.Duration = duration;
        this.Type = type;
        this.DefensiveAffixStatCategories = defensiveStatCategories;
    }
}
