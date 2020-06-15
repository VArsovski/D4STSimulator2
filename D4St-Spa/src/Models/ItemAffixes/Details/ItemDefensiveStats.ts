import { DefensiveStatCategoryEnum, DefensiveStatsEnum, DamageTypesEnum, ResistanceTypesEnum, AffixCategoryEnum, CastTypesEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { CCEffectTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { IItemAffixStats, SimpleItemAffixStatsMetadata, SimpleAffixStats } from './IItemAffixStats';
import { IEquippableAffixStat } from 'src/Models/IEquippableStatDetails/IEquippableAffixStat';
import { IItemAffix } from '../IItemAffix';

export class ItemDefenseStats implements IEquippableAffixStat {
    Amount:number;
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
    private statsCalculated:boolean;
    private SocketPowerPercentage:number;
    SelectedStat: string;
    CategoryStats: AffixCategoryEnum;
    EquippableStatData: IItemAffixStats;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;
    getZeroStats: (src: any) => any;
    Type: DefensiveStatsEnum;
    DamageType: any;

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

    constructor(category: AffixCategoryEnum, level:number, powerLevel:number, amount:number, amountPercentage:number, chance:number, duration:number, type:DefensiveStatsEnum, damageType:DamageTypesEnum, affectedCategories?:DefensiveStatCategoryEnum[]) {
        this.CategoryStats = category;
        this.Amount = -1; // Just make sure it's not 0, (again) for outside check
        this.Socket = new ItemDefensiveStatsDetail(category, 0, 0, 0, 0, DefensiveStatsEnum.Socket, []);
        this.PowerLevel = powerLevel;
        this.Level = level;
        this.Type = type;
        this.DamageType = damageType;
        var appropriateCategories = affectedCategories ? affectedCategories : this.GenerateAppropriateCategoriesByType(type);

        // Instead of adressing this relatively weaker stat from outside we address it here..
        if (type == DefensiveStatsEnum.DamageStaggered && amount && !amountPercentage)
            amount = Math.round(amount * 2.5);

        this.EquippableStatData = new SimpleAffixStats();
        this.EquippableStatData.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.EquippableStatData.InputMeta.SelectedStat = Helpers.getPropertyByValue(AffixCategoryEnum, this.CategoryStats);

        var selectedStat = Helpers.getPropertyByValue(DefensiveStatsEnum, type);
        this.SelectedStat = selectedStat;
        if (type == DefensiveStatsEnum.Socket)
        {
            this.Socket.Amount = 1;
            this.SelectedStat = "Socket";
        }

        if (!this.statsCalculated) {
            if (this.SelectedStat) {
                var newDefensiveAffixStats = new ItemDefensiveStatsDetail(category, amount, amountPercentage, chance, duration, type, appropriateCategories);
                this[selectedStat] = newDefensiveAffixStats;
        
                if (this.SelectedStat != "Socket") {
                    this[this.SelectedStat].Amount = new CalculationsHelper().getEmpoweredValue(this[this.SelectedStat].Amount, this.PowerLevel);
                    this[this.SelectedStat].AmountPercentage = new CalculationsHelper().getEmpoweredValue(this[this.SelectedStat].AmountPercentage, this.PowerLevel);
                }
                else this.Socket.Amount += this.PowerLevel;
                this.SocketPowerPercentage = Math.round(new CalculationsHelper().getEmpoweredValue(Helpers.getRandom(12, 20) + Helpers.getRandom(-5, 5), this.PowerLevel) + (50 - this.Level)/4);
            }
            this.statsCalculated = true;
        }

        this.EquippableStatData.OutputMeta.SelectedCategoryStat = "OfensiveStatsData";
        this.EquippableStatData.OutputMeta.SelectedStat = this.SelectedStat;
        this.EquippableStatData.OutputMeta.SelectedEquipStat = this[this.SelectedStat].SelectedEquipStat;
        this.getZeroStats = (src) => { (src[(src as ItemDefenseStats).SelectedStat] as ItemDefensiveStatsDetail).Amount = 0; return src; }
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

export class ItemDefensiveStatsDetail implements IEquippableAffixStat {
    Amount:number;
    CategoryStats: AffixCategoryEnum;
    private CCType:CCEffectTypesEnum;
    private DamageType:DamageTypesEnum;
    private CastType:CastTypesEnum;
    private AmountPercentage?:number;
    private Duration?:number;
    private Chance?: number;
    private DefensiveAffixStatCategories:DefensiveStatCategoryEnum[];
    private Type:DefensiveStatsEnum;
    // private selectedStat:string;
    private Socket:number;
    EquippableStatData: IItemAffixStats;
    getZeroStats: (src: any) => any;
    updateEquippedStats: (src: any, affix: IItemAffix) => any;

    GetDescription(): string {
        var str = "";

        var defensiveAffixStatCategoryStr = "";
        this.DefensiveAffixStatCategories.forEach(element => {
            if (str.length == 0)
            defensiveAffixStatCategoryStr += " " + Helpers.getPropertyByValue(DefensiveStatCategoryEnum, element);
            else defensiveAffixStatCategoryStr += " and " + Helpers.getPropertyByValue(DefensiveStatCategoryEnum, element);
        });

        var type = Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type);
        var damageType = this.Type != DefensiveStatsEnum.ThornsDamage ? Helpers.getPropertyByValue(DamageTypesEnum, this.DamageType)
        : Helpers.getPropertyByValue(ResistanceTypesEnum, this.DamageType);

        if (!damageType) {
            // console.log("ItemDefensiveStats, data failed:");
            // console.log(this);
        }

        var castType = Helpers.getPropertyByValue(CastTypesEnum, this.CastType);
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
                str += Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " of type " + castType + " reduced by " + this.AmountPercentage + "%";
            if (this.Amount)
            if (!str)
                str += Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type) + " of type " + castType + " reduced by " + this.Amount;
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
                str += this.Chance + "% chance " + " of " +  castType + " attacks to return as " + Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type);
        }

        return str;
    }

    constructor(category: AffixCategoryEnum, amount:number, amountPercentage:number, chance:number, duration:number, type: DefensiveStatsEnum, defensiveStatCategories: DefensiveStatCategoryEnum[]) {
        this.CategoryStats = category;
        this.Socket = 0;
        this.Amount = amount;
        this.AmountPercentage = amountPercentage;
        this.Chance = chance;
        this.Duration = duration;
        this.Type = type;
        this.DefensiveAffixStatCategories = defensiveStatCategories;

        var damageType = Helpers.getRandom(1 ,8);
        var castType = Helpers.getRandom(1 ,5);
        var ccType = Helpers.getRandom(1 ,5);

        this.DamageType = damageType;
        this.CastType = castType;
        this.CCType = ccType;

        this.EquippableStatData = new SimpleAffixStats();
        this.EquippableStatData.InputMeta = new SimpleItemAffixStatsMetadata();
        this.EquippableStatData.OutputMeta = new SimpleItemAffixStatsMetadata();
        this.EquippableStatData.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.EquippableStatData.InputMeta.SelectedStat = Helpers.getPropertyByValue(AffixCategoryEnum, this.CategoryStats);
        this.EquippableStatData.OutputMeta.SelectedCategoryStat = "ItemDefensiveStats";
        this.EquippableStatData.OutputMeta.SelectedStat = Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type);
        this.EquippableStatData.OutputMeta.SelectedEquipStat = this.Type != DefensiveStatsEnum.CCEffects ? Helpers.getPropertyByValue(DefensiveStatsEnum, this.Type)
        : Helpers.getPropertyByValue(CCEffectTypesEnum, this.CCType);
    }
}
