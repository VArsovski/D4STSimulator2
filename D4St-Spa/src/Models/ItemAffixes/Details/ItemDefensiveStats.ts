import { DefensiveStatCategoryEnum, DefensiveStatsEnum, DamageTypesEnum, AttackTypesEnum, ResistanceTypesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { CCEffectTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { IItemAffixStats } from './IItemAffixStats';

export class ItemDefenseStats implements IItemAffixStats {
    CCDamageAndDurationReduced?:ItemDefensiveStatsDetail;
    PotionAndGlobeBonus?:ItemDefensiveStatsDetail;
    DamageTaken?:ItemDefensiveStatsDetail;
    AttacksTaken?:ItemDefensiveStatsDetail;
    ThornsDamage?:ItemDefensiveStatsDetail;
    DamageStaggered?:ItemDefensiveStatsDetail;
    LifestealOrShielding?:ItemDefensiveStatsDetail;
    Socket:ItemDefensiveStatsDetail;
    private Level:number;
    private PowerLevel: number;
    private selectedStat:string;
    private statsCalculated:boolean;
    private SocketPowerPercentage:number;
    Amount:number;

    GetDescription(): string {
        var descr1 = (this.CCDamageAndDurationReduced) ? this.CCDamageAndDurationReduced.GetDescription() : "";
        var descr2 = (this.PotionAndGlobeBonus) ? this.PotionAndGlobeBonus.GetDescription() : "";
        var descr3 = (this.DamageTaken) ? this.DamageTaken.GetDescription() : "";
        var descr4 = (this.AttacksTaken) ? this.AttacksTaken.GetDescription() : "";
        var descr5 = (this.ThornsDamage) ? this.ThornsDamage.GetDescription() : "";
        var descr6 = (this.DamageStaggered) ? this.DamageStaggered.GetDescription() : "";
        var descr7 = (this.LifestealOrShielding) ? this.LifestealOrShielding.GetDescription() : "";
        var descr8 = this.Socket.Amount != 0 ? "Defensive Sockets empowered by " + this.SocketPowerPercentage + "%": "";

        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
        var allAffixDescr = ["+ " + descr1, "+ " + descr2, "+ " + descr3, "+ " + descr4, "+ " + descr5, "+ " + descr6, "+ " + descr7, "+ " + descr8];
        var descr = allAffixDescr.filter(f => (f.replace("+ ", "") || []).length != 0);
        descr.forEach(d => { d += empoweredStr; });
        return descr.join('\n\n');
        // return descr1 + descr2 + descr3 + descr4 + descr5 + descr6 + descr7 + descr8 + empoweredStr;
    }

    constructor(level:number, powerLevel:number, amount:number, amountPercentage:number, chance:number, duration:number, type:DefensiveStatsEnum, affectedCategories?:DefensiveStatCategoryEnum[]) {

        this.Amount = -1; // Just make sure it's not 0, (again) for outside check
        this.Socket = new ItemDefensiveStatsDetail(0, 0, 0, 0, DefensiveStatsEnum.Socket, []);
        this.PowerLevel = powerLevel;
        this.Level = level;
        var appropriateCategories = affectedCategories ? affectedCategories : this.GenerateAppropriateCategoriesByType(type);

        // Instead of adressing this relatively weaker stat from outside we address it here..
        if (type == DefensiveStatsEnum.DamageStaggered && amount && !amountPercentage)
            amount = Math.round(amount * 2.5);

        var selectedStat = Helpers.getPropertyByValue(DefensiveStatsEnum, type);
        this.selectedStat = selectedStat;
        if (type == DefensiveStatsEnum.Socket)
        {
            this.Socket.Amount = 1;
            this.selectedStat = "Socket";
        }

        if (!this.statsCalculated) {
            if (this.selectedStat) {
                var newDefensiveAffixStats = new ItemDefensiveStatsDetail(amount, amountPercentage, chance, duration, type, appropriateCategories);
                this[selectedStat] = newDefensiveAffixStats;
        
                if (this.selectedStat != "Socket") {
                    this[this.selectedStat].Amount = new CalculationsHelper().getEmpoweredValue(this[this.selectedStat].Amount, this.PowerLevel);
                    this[this.selectedStat].AmountPercentage = new CalculationsHelper().getEmpoweredValue(this[this.selectedStat].AmountPercentage, this.PowerLevel);
                }
                else this.Socket.Amount += this.PowerLevel;
                this.SocketPowerPercentage = Math.round(new CalculationsHelper().getEmpoweredValue(Helpers.getRandom(20, 30) + Helpers.getRandom(-5, 5), this.PowerLevel) + (10 - this.Level/4));
            }
            this.statsCalculated = true;
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

        var bonusUpgrades = [DefensiveStatsEnum.PotionAndGlobeBonus];
        
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
}

export class ItemDefensiveStatsDetail implements IItemAffixStats {
    Amount:number;
    private AmountPercentage?:number;
    private Duration?:number;
    private Chance?: number;
    private DefensiveAffixStatCategories:DefensiveStatCategoryEnum[];
    private Type:DefensiveStatsEnum;

    private DamageType:DamageTypesEnum;
    private AttackType:AttackTypesEnum;
    private CCType:CCEffectTypesEnum;
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

        var damageType = Helpers.getPropertyByValue(DamageTypesEnum, this.DamageType);
        var attackType = Helpers.getPropertyByValue(AttackTypesEnum, this.AttackType);
        var ccType = Helpers.getPropertyByValue(CCEffectTypesEnum, this.CCType);

        if (this.Type == DefensiveStatsEnum.CCEffects)
        {
            if (this.AmountPercentage)
                str += "Decrease " + defensiveAffixStatCategoryStr + " of " + ccType + " " +  Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " by " + this.AmountPercentage;
            if (!str)
            if (this.Amount)
                str += this.Amount + "%" + " less stamina per " + ccType + Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " suffered";
        }
        if (this.Type == DefensiveStatsEnum.PotionAndGlobeBonus)
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

        var damageType = Helpers.getRandom(1 ,8);
        var attackType = Helpers.getRandom(1 ,5);
        var ccType = Helpers.getRandom(1 ,5);

        this.DamageType = damageType;
        this.AttackType = attackType;
        this.CCType = ccType;
    }
}
