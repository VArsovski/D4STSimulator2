import { OfensiveStatCategoryEnum, OfensiveStatsEnum, AffixCategoryEnum } from 'src/_Enums/itemAffixEnums';
import { Helpers } from 'src/_Helpers/helpers';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { IItemAffixStats, SimpleItemAffixStatsMetadata, IItemAffixStatsMetadata, SimpleAffixStats } from './IItemAffixStats';
import { IItemAffix } from '../IItemAffix';
import { OfensiveStatsEquippable } from 'src/Models/IEquippableStatDetails/OfensiveStatsEquippable';
import { IEquippableAffixStat } from 'src/Models/IEquippableStatDetails/IEquippableAffixStat';
import { InventoryDamageModel } from 'src/Models/InventoryModels/InventoryDamageModel';

export class ItemOfensiveStats implements IEquippableAffixStat {
    private CleaveAndAoE?:ItemOfensiveStatsDetail;
    private PoisonAndBurn?:ItemOfensiveStatsDetail;
    private ArmorReductionAndBleed?:ItemOfensiveStatsDetail;
    private KnockbackAndStun?:ItemOfensiveStatsDetail;
    private FreezeAndRoot?:ItemOfensiveStatsDetail;
    private ChainAndPierce?:ItemOfensiveStatsDetail;
    private CastAndProjectileRange?:ItemOfensiveStatsDetail;
    private Socket:ItemOfensiveStatsDetail;
    private Level: number;
    private PowerLevel:number;
    private statsCalculated:boolean;
    private SocketPowerPercentage:number;
    Amount:number; //Just to check whether there is data in here (from outside method)
    CategoryStats: AffixCategoryEnum;
    SelectedStat:string;
    EquippableStatData: IItemAffixStats;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;
    getZeroStats: (src: any) => any;

    GetDescription(): string {
        var descr1 = (this.CleaveAndAoE) ? this.CleaveAndAoE.GetDescription() : "";
        var descr2 = (this.PoisonAndBurn) ? this.PoisonAndBurn.GetDescription() : "";
        var descr3 = (this.ArmorReductionAndBleed) ? this.ArmorReductionAndBleed.GetDescription() : "";
        var descr4 = (this.KnockbackAndStun) ? this.KnockbackAndStun.GetDescription() : "";
        var descr5 = (this.FreezeAndRoot) ? this.FreezeAndRoot.GetDescription() : "";
        var descr6 = (this.ChainAndPierce) ? this.ChainAndPierce.GetDescription() : "";
        var descr7 = (this.CastAndProjectileRange) ? this.CastAndProjectileRange.GetDescription() : "";
        var descr8 = this.Socket.Amount != 0 ? "Ofensive Sockets empowered by " + this.SocketPowerPercentage + "%": "";

        var empoweredStr = new CalculationsHelper().getEmpoweredStr("*", this.PowerLevel);
        var allAffixDescr = ["+ " + descr1, "+ " + descr2, "+ " + descr3, "+ " + descr4, "+ " + descr5, "+ " + descr6, "+ " + descr7, "+ " + descr8];
        var descr = allAffixDescr.filter(f => (f.replace("+ ", "") || []).length != 0);
        descr.forEach(d => { d += empoweredStr; });
        return descr.join('\n\n');

        // return descr1 + descr2 + descr3 + descr4 + descr5 + descr6 + descr7 + descr8 + empoweredStr;
    }

    constructor(category:AffixCategoryEnum, level:number, powerLevel:number, amount:number, amountPercentage:number, type:OfensiveStatsEnum, affectedCategories?:OfensiveStatCategoryEnum[]) {

        this.CategoryStats = category;
        this.Amount = -1; // Just make sure it's not 0, (again) for outside check
        this.Socket = new ItemOfensiveStatsDetail(0, 0, OfensiveStatsEnum.Socket, []);
        this.PowerLevel = powerLevel;
        this.Level = level;

        var appropriateCategories = affectedCategories ? affectedCategories : this.GenerateAppropriateCategoriesByType(type);
        var newOfensiveAffixStats = new ItemOfensiveStatsDetail(amount, amountPercentage, type, appropriateCategories);

        var selectedStat = Helpers.getPropertyByValue(OfensiveStatsEnum, type);
        this[selectedStat] = newOfensiveAffixStats;
        this.SelectedStat = selectedStat;

        if (type == OfensiveStatsEnum.Socket)
        {
            this.Socket.Amount = 1;
            this.SelectedStat = "Socket";
        }

        if (!this.statsCalculated) {
            if (this.SelectedStat) {
                if (this.SelectedStat != "Socket") {
                    this[this.SelectedStat].Amount = new CalculationsHelper().getEmpoweredValue(this[this.SelectedStat].Amount, this.PowerLevel);
                    this[this.SelectedStat].AmountPercentage = new CalculationsHelper().getEmpoweredValue(this[this.SelectedStat].AmountPercentage, this.PowerLevel);
                }
                else this.Socket.Amount+=this.PowerLevel;
                this.SocketPowerPercentage = Math.round(new CalculationsHelper().getEmpoweredValue(Helpers.getRandom(20, 30) + Helpers.getRandom(-5, 5), this.PowerLevel) + (10 - this.Level/4));
            }
            this.statsCalculated = true;
        }

        this.EquippableStatData = new SimpleAffixStats();
        this.EquippableStatData.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.EquippableStatData.InputMeta.SelectedStat = Helpers.getPropertyByValue(AffixCategoryEnum, this.CategoryStats);
        this.EquippableStatData.OutputMeta.SelectedCategoryStat = "CCEffectsData";
        this.EquippableStatData.OutputMeta.SelectedStat = this.SelectedStat;
        this.EquippableStatData.OutputMeta.SelectedEquipStat = this[this.SelectedStat].SelectedEquipStat;
        this.getZeroStats = (src) => { (src[(src as ItemOfensiveStats).SelectedStat] as InventoryDamageModel).Amount = 0; return src }
        this.updateEquippedStats = new OfensiveStatsEquippable("CCEffectsData", this.SelectedStat).updateEquippedStats;
    }

    private GenerateAppropriateCategoriesByType(type:OfensiveStatsEnum) {
        var categories:OfensiveStatCategoryEnum[] = [];

        var damageUpgrades = [OfensiveStatsEnum.CleaveAndAoE
            , OfensiveStatsEnum.PoisonAndBurn
            , OfensiveStatsEnum.ChainAndPierce];

        var durationUpgrades = [OfensiveStatsEnum.PoisonAndBurn
            , OfensiveStatsEnum.ArmorReductionAndBleed
            , OfensiveStatsEnum.FreezeAndRoot];

        var chanceUpgrades = [OfensiveStatsEnum.FreezeAndRoot
            , OfensiveStatsEnum.KnockbackAndStun
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
}

export class ItemOfensiveStatsDetail implements IItemAffixStats {
    Amount:number;
    AmountPercentage?:number;
    private OfensiveAffixStatCategories:OfensiveStatCategoryEnum[];
    private Type:OfensiveStatsEnum;
    CategoryStats: AffixCategoryEnum;
    InputMeta: IItemAffixStatsMetadata;
    OutputMeta: IItemAffixStatsMetadata;
    
    GetDescription(): string {
        var str = "";

        var ofensiveAffixStatCategoryStr = "";
        this.OfensiveAffixStatCategories.forEach(element => {
            if (str.length == 0)
                ofensiveAffixStatCategoryStr += " " + Helpers.getPropertyByValue(OfensiveStatCategoryEnum, element);
            else ofensiveAffixStatCategoryStr += " and " + Helpers.getPropertyByValue(OfensiveStatCategoryEnum, element);
        });

        var quantifier = this.Amount ? this.Amount : this.AmountPercentage + "%";

        var damageTypes:OfensiveStatsEnum[] = [
            OfensiveStatsEnum.ArmorReductionAndBleed,
            OfensiveStatsEnum.PoisonAndBurn,
            OfensiveStatsEnum.KnockbackAndStun,
            OfensiveStatsEnum.CleaveAndAoE,
            OfensiveStatsEnum.ChainAndPierce,
            OfensiveStatsEnum.FreezeAndRoot
        ];
        if (!str && damageTypes.includes(this.Type)) {
            str += "Increase " + Helpers.getPropertyByValue(OfensiveStatsEnum, this.Type) + ofensiveAffixStatCategoryStr + " by " + quantifier;
        }
        if (this.Type == OfensiveStatsEnum.CastAndProjectileRange && !str)
            str += "Increase " + Helpers.getPropertyByValue(OfensiveStatsEnum, this.Type) + " by " + quantifier;

        return str;
    }

    constructor(amount:number, amountPercentage:number, type: OfensiveStatsEnum, ofensiveStatCategories: OfensiveStatCategoryEnum[]) {
        this.Amount = amount;
        this.AmountPercentage = amountPercentage;
        this.Type = type;
        this.OfensiveAffixStatCategories = ofensiveStatCategories;

        this.InputMeta = new SimpleItemAffixStatsMetadata();
        this.OutputMeta = new SimpleItemAffixStatsMetadata();
        this.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.InputMeta.SelectedStat = Helpers.getPropertyByValue(AffixCategoryEnum, this.CategoryStats);
        this.OutputMeta.SelectedEquipStat = Helpers.getPropertyByValue(OfensiveStatsEnum, this.Type);
        this.OutputMeta.SelectedCategoryStat = "OfensiveStatData";
        this.OutputMeta.SelectedStat = Helpers.getPropertyByValue(AffixCategoryEnum, this.CategoryStats);
    }
}
