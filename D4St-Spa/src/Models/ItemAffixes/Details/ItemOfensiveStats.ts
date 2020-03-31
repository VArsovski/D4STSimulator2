import { IDescribable } from '../IDescribable';
import { OfensiveStatCategoryEnum, OfensiveStatsEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { IPowerUp } from '../IPowerUp';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';

export class ItemOfensiveStatsDetail implements IDescribable {
    private Amount?:number;
    private AmountPercentage?:number;
    private OfensiveAffixStatCategories:OfensiveStatCategoryEnum[];
    private Type:OfensiveStatsEnum;

    GetDescription(): string {
        var str = "";

        var ofensiveAffixStatCategoryStr = "";
        this.OfensiveAffixStatCategories.forEach(element => {
            if (str.length == 0)
                ofensiveAffixStatCategoryStr += " " + Helpers.getPropertyByValue(OfensiveStatCategoryEnum, element);
            else ofensiveAffixStatCategoryStr += " and " + Helpers.getPropertyByValue(OfensiveStatCategoryEnum, element);
        });

        var quantifier = this.Amount ? this.Amount : this.AmountPercentage + "%";

        if (this.Type == OfensiveStatsEnum.CleaveAndAoE)
            str += "Increase " + Helpers.getPropertyByValue(OfensiveStatsEnum, this.Type) + ofensiveAffixStatCategoryStr + " by " + quantifier;
        if (this.Type == OfensiveStatsEnum.PoisonAndBurn)
            str += "Increase " + Helpers.getPropertyByValue(OfensiveStatsEnum, this.Type) + ofensiveAffixStatCategoryStr + " by " + quantifier;
        if (this.Type == OfensiveStatsEnum.ArmorReductionAndBleed)
            str += "Increase " + Helpers.getPropertyByValue(OfensiveStatsEnum, this.Type) + ofensiveAffixStatCategoryStr + " by " + quantifier;
        if (this.Type == OfensiveStatsEnum.FreezeAndStun)
            str += "Increase " + Helpers.getPropertyByValue(OfensiveStatsEnum, this.Type) + ofensiveAffixStatCategoryStr + " by " + quantifier;
        if (this.Type == OfensiveStatsEnum.KnockbackAndRoot)
            str += "Increase " + Helpers.getPropertyByValue(OfensiveStatsEnum, this.Type) + ofensiveAffixStatCategoryStr + " by " + quantifier;
        if (this.Type == OfensiveStatsEnum.ChainAndPierce)
            str += "Increase " + Helpers.getPropertyByValue(OfensiveStatsEnum, this.Type) + ofensiveAffixStatCategoryStr + " by " + quantifier;
        if (this.Type == OfensiveStatsEnum.CastAndProjectileRange)
            str += "Increase " + Helpers.getPropertyByValue(OfensiveStatsEnum, this.Type) + " by " + quantifier;
        if (this.Type == OfensiveStatsEnum.Socket)
            str += "Socket";

        return str;
    }

    constructor(amount:number, amountPercentage:number, type: OfensiveStatsEnum, ofensiveStatCategories: OfensiveStatCategoryEnum[]) {
        this.Amount = amount;
        this.AmountPercentage = amountPercentage;
        this.Type = type;
        this.OfensiveAffixStatCategories = ofensiveStatCategories;
    }
}

export class ItemOfensiveStats implements IDescribable, IPowerUp {
    private CleaveAndAoE?:ItemOfensiveStatsDetail;
    private PoisonAndBurn?:ItemOfensiveStatsDetail;
    private ArmorReductionAndBleed?:ItemOfensiveStatsDetail;
    private FreezeAndStun?:ItemOfensiveStatsDetail;
    private KnockbackAndRoot?:ItemOfensiveStatsDetail;
    private ChainAndPierce?:ItemOfensiveStatsDetail;
    private CastAndProjectileRange?:ItemOfensiveStatsDetail;
    private Socket:number;
    private selectedStat:string;
    private Level: number;
    private PowerLevel:number;
    SetLevel(level: number) { this.Level = level; }

    GetDescription(): string {
        var data = this.GetData();
        var descr1 = (this.CleaveAndAoE) ? data.CleaveAndAoE.GetDescription() : "";
        var descr2 = (this.PoisonAndBurn) ? data.PoisonAndBurn.GetDescription() : "";
        var descr3 = (this.ArmorReductionAndBleed) ? data.ArmorReductionAndBleed.GetDescription() : "";
        var descr4 = (this.FreezeAndStun) ? data.FreezeAndStun.GetDescription() : "";
        var descr5 = (this.KnockbackAndRoot) ? data.KnockbackAndRoot.GetDescription() : "";
        var descr6 = (this.ChainAndPierce) ? data.ChainAndPierce.GetDescription() : "";
        var descr7 = (this.CastAndProjectileRange) ? data.CastAndProjectileRange.GetDescription() : "";
        var descr8 = this.Socket != 0 ? "Socket/s " + data.Socket: "";

        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
        return descr1 + descr2 + descr3 + descr4 + descr5 + descr6 + descr7 + descr8 + empoweredStr;
    }

    constructor(amount:number, amountPercentage:number, type:OfensiveStatsEnum, affectedCategories?:OfensiveStatCategoryEnum[]) {
        this.Socket = 0;
        this.PowerLevel = 0;
        this.Level = 1;

        var appropriateCategories = affectedCategories ? affectedCategories : this.GenerateAppropriateCategoriesByType(type);

        var newOfensiveAffixStats = new ItemOfensiveStatsDetail(amount, amountPercentage, type, appropriateCategories);
        if (type == OfensiveStatsEnum.CleaveAndAoE)
        {
            this.CleaveAndAoE = newOfensiveAffixStats;
            this.selectedStat = "CleaveAndAoE";
        }
        if (type == OfensiveStatsEnum.PoisonAndBurn)
        {
            this.PoisonAndBurn = newOfensiveAffixStats;
            this.selectedStat = "PoisonAndBurn";
        }
        if (type == OfensiveStatsEnum.ArmorReductionAndBleed)
        {
            this.ArmorReductionAndBleed = newOfensiveAffixStats;
            this.selectedStat = "ArmorReductionAndBleed";
        }
        if (type == OfensiveStatsEnum.FreezeAndStun)
        {
            this.FreezeAndStun = newOfensiveAffixStats;
            this.selectedStat = "FreezeAndStun";
        }
        if (type == OfensiveStatsEnum.KnockbackAndRoot)
        {
            this.KnockbackAndRoot = newOfensiveAffixStats;
            this.selectedStat = "KnockbackAndRoot";
        }
        if (type == OfensiveStatsEnum.ChainAndPierce)
        {
            this.ChainAndPierce = newOfensiveAffixStats;
            this.selectedStat = "ChainAndPierce";
        }
        if (type == OfensiveStatsEnum.CastAndProjectileRange)
        {
            this.CastAndProjectileRange = newOfensiveAffixStats;
            this.selectedStat = "CastAndProjectileRange";
        }
        if (type == OfensiveStatsEnum.Socket)
        {
            this.Socket++;
            this.selectedStat = "Socket";
        }
    }

    private GenerateAppropriateCategoriesByType(type:OfensiveStatsEnum) {
        var categories:OfensiveStatCategoryEnum[] = [];

        var damageUpgrades = [OfensiveStatsEnum.CleaveAndAoE
            , OfensiveStatsEnum.PoisonAndBurn
            , OfensiveStatsEnum.ChainAndPierce];

        var durationUpgrades = [OfensiveStatsEnum.PoisonAndBurn
            , OfensiveStatsEnum.ArmorReductionAndBleed
            , OfensiveStatsEnum.FreezeAndStun];

        var chanceUpgrades = [OfensiveStatsEnum.FreezeAndStun
            , OfensiveStatsEnum.KnockbackAndRoot
            , OfensiveStatsEnum.ChainAndPierce];
        
        if (damageUpgrades.indexOf(type) != -1)
            categories.push[OfensiveStatCategoryEnum.Damage];
        if (durationUpgrades.indexOf(type) != -1)
            categories.push[OfensiveStatCategoryEnum.Duration];
        if (chanceUpgrades.indexOf(type) != -1)
            categories.push[OfensiveStatCategoryEnum.Chance];
        if (damageUpgrades.indexOf(type) != -1)
            categories.push[OfensiveStatCategoryEnum.Damage];

        if (type = OfensiveStatsEnum.CleaveAndAoE)
            categories.push[OfensiveStatCategoryEnum.Radius];

        return categories;
    }

    PowerUp(){
        this.PowerLevel++;
    }

    GetData() {
        if (this.selectedStat)
        {
            if (this.selectedStat != "Socket") {
                this[this.selectedStat].Amount = new CalculationsHelper().getEmpoweredValue(this[this.selectedStat].Amount, this.PowerLevel);
                this[this.selectedStat].AmountPercentage = new CalculationsHelper().getEmpoweredValue(this[this.selectedStat].AmountPercentage, this.PowerLevel);
            }
            else this.Socket++;
        }
        return this;
    }
}
