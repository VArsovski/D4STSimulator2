import { IItemAffixStats } from './IItemAffixStats';
import { AffixCategoryEnum, SecondaryStatTypesEnum, DamageTypesEnum, ResistanceTypesEnum, BasicStatsEnum, TrapAndSummonStatsEnum } from 'src/_Enums/itemAffixEnums';
import { ItemSimpleStats, ItemBasicResistanceStatsDetail } from './ItemSimpleStats';
import { Helpers } from 'src/_Helpers/helpers';
import { CCEffectTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';

export class ItemSecondaryBasicStats implements IItemAffixStats {
    Level: number;
    PowerLevel: number;
    Amount: number;
    CategoryStats: AffixCategoryEnum;
    SelectedStat: SecondaryStatTypesEnum;
    Resistance:ItemBasicResistanceStatsDetail;
    RedirectDamage:ItemSimpleStats;
    IncreaseStatSunder:ItemSimpleStats;
    EmpowerTrapsAndSummons:ItemSimpleStats;
    DamageTakenReduced: ItemSimpleStats;
    CCReduction:ItemSimpleStats;

    private damageType:DamageTypesEnum;
    private ccType:CCEffectTypesEnum;
    private elementType:ResistanceTypesEnum;
    private statType: BasicStatsEnum;
    private summonTrapStatType: TrapAndSummonStatsEnum;
    private statsCalculated:boolean;

    constructor(category:AffixCategoryEnum, level:number, powerLevel:number, selectedStat:SecondaryStatTypesEnum
        , resistance: ItemBasicResistanceStatsDetail
        , redirectDamage:ItemSimpleStats
        , increaseStatSunder:ItemSimpleStats
        , empowerTrapsAndSummons:ItemSimpleStats
        , damageTakenReduced: ItemSimpleStats
        , ccReduction:ItemSimpleStats
        ) {
            this.CategoryStats = category;
            this.Level = level;
            this.PowerLevel = powerLevel;
            this.SelectedStat = selectedStat,

            // Resistance = 1,              // EmpowerTrapsAndSummons = 4,
            // RedirectDamage = 2,          // DamageTakenReduced = 5,
            // IncreaseStatSunder = 3,      // CCReduction = 6
            this.Resistance = resistance,
            this.RedirectDamage = redirectDamage,
            this.IncreaseStatSunder = increaseStatSunder;
            this.EmpowerTrapsAndSummons = empowerTrapsAndSummons,
            this.DamageTakenReduced = damageTakenReduced
            this.CCReduction = ccReduction,

            this.damageType = Helpers.getRandom(1, 5);
            this.ccType = Helpers.getRandom(1, 6);
            this.elementType = Helpers.getRandom(1, 5);
            this.statType = Helpers.getRandom(2, 3);
            this.summonTrapStatType = Helpers.getRandom(1, 3);

            if (!this.statsCalculated) {
                // Make numbers increased for Traps&Summons stat type increase
                if (this.SelectedStat == SecondaryStatTypesEnum.EmpowerTrapsAndSummons)
                    this.PowerLevel += 3;

                var selectedStatStr = Helpers.getPropertyByValue(SecondaryStatTypesEnum, this.SelectedStat);
                this[selectedStatStr].Amount = new CalculationsHelper().getEmpoweredValue(this[selectedStatStr].Amount || 0, this.PowerLevel);
                if (selectedStatStr != "Resistance")
                    this[selectedStatStr].AmountPercentage = new CalculationsHelper().getEmpoweredValue(this[selectedStatStr].AmountPercentage || 0, this.PowerLevel);
                this.statsCalculated = true;
            }
    }

    GetDescription(): string {
        // Resistance = 1,             // EmpowerTrapsAndSummons = 4,
        // CCReduction = 2,            // RedirectDamage = 5,
        // DamageTakenReduced = 3,     // IncreaseStatSunder = 6
        var selectedStat = Helpers.getPropertyByValue(SecondaryStatTypesEnum, this.SelectedStat);
        if (!this[selectedStat]) {
            this.SelectedStat = this.GetSelectedStat();
            selectedStat = Helpers.getPropertyByValue(SecondaryStatTypesEnum, this.SelectedStat);
            console.log(selectedStat);
            console.log(this);
        }

        var isPrimaryType = [SecondaryStatTypesEnum.Resistance, SecondaryStatTypesEnum.IncreaseStatSunder].includes(this.SelectedStat);
        var isPercentage = this[selectedStat].AmountPercentage;

        var quantifier = isPercentage ? this[selectedStat].AmountPercentage + "%" : this[selectedStat].Amount;
        var descrPrimary = isPrimaryType ? this[selectedStat].GetDescription() : "";
        var dpsDescr = this.SelectedStat == SecondaryStatTypesEnum.DamageTakenReduced
            ? "DamageTaken of type " + Helpers.getPropertyByValue(DamageTypesEnum, this.damageType) + " reduced by " + quantifier : "";
        var redirectDescr = this.SelectedStat == SecondaryStatTypesEnum.RedirectDamage
            ? quantifier + " of DamageTaken of type " + Helpers.getPropertyByValue(ResistanceTypesEnum, this.elementType) + " goes to " + Helpers.getPropertyByValue(BasicStatsEnum, this.statType) : "";
        var ccDescr = this.SelectedStat == SecondaryStatTypesEnum.CCReduction
            ? "Effects of type " + Helpers.getPropertyByValue(CCEffectTypesEnum, this.ccType) + " reduced by " + quantifier : "";
        var empowerDescr = this.SelectedStat == SecondaryStatTypesEnum.EmpowerTrapsAndSummons
            ? "Increase " + Helpers.getPropertyByValue(TrapAndSummonStatsEnum, this.summonTrapStatType) + " of TrapsAndSummons by " + quantifier: "";

        return descrPrimary + dpsDescr + redirectDescr + ccDescr + empowerDescr;
    }

    GetSelectedStat():number {
        var selectedStat:number = 0;
        var currentStats:string[] = ["", "Resistance", "CCReduction", "DamageTakenReduced", "EmpowerTrapsAndSummons", "RedirectDamage", "IncreaseStatSunder"];

        for (let i = 0; i < currentStats.length; i++)
            if (this[currentStats[i]]) { selectedStat = i; break; }

        return selectedStat;
    }
}
