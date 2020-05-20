import { IItemAffixStats, SimpleItemAffixStatsMetadata, IItemAffixStatsMetadata, SimpleAffixStats } from './IItemAffixStats';
import { AffixCategoryEnum, SecondaryStatTypesEnum, DamageTypesEnum, ResistanceTypesEnum, BasicStatsEnum, TrapAndSummonStatsEnum } from 'src/_Enums/itemAffixEnums';
import { ItemSimpleStats, ItemBasicResistanceStatsDetail } from './ItemSimpleStats';
import { Helpers } from 'src/_Helpers/helpers';
import { CCEffectTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { IItemAffix } from '../IItemAffix';
import { IEquippableAffixStat } from 'src/Models/IEquippableStatDetails/IEquippableAffixStat';

export class ItemSecondaryBasicStats implements IEquippableAffixStat {
    Level: number;
    PowerLevel: number;
    Amount: number;
    CategoryStats: AffixCategoryEnum;
    private selectedStat: SecondaryStatTypesEnum;
    Resistance:ItemBasicResistanceStatsDetail;
    RedirectDamage:ItemSimpleStats;
    IncreaseStatSunder:ItemSimpleStats;
    EmpowerTrapsAndSummons:ItemSimpleStats;
    DamageTakenReduced: ItemSimpleStats;
    CCReduction:ItemSimpleStats;
    EquippableStatData: IItemAffixStats;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;
    getZeroStats: (src: any) => any;

    private damageType:DamageTypesEnum;
    private ccType:CCEffectTypesEnum;
    private elementType:ResistanceTypesEnum;
    private statType: BasicStatsEnum;
    private summonTrapStatType: TrapAndSummonStatsEnum;
    private statsCalculated:boolean;

    constructor(category:AffixCategoryEnum, level:number, powerLevel:number
        , selectedStat:SecondaryStatTypesEnum
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
            this.selectedStat = selectedStat,

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
                if (this.selectedStat == SecondaryStatTypesEnum.EmpowerTrapsAndSummons)
                    this.PowerLevel += 3;

                var selectedStatStr = Helpers.getPropertyByValue(SecondaryStatTypesEnum, this.selectedStat);
                this[selectedStatStr].Amount = new CalculationsHelper().getEmpoweredValue(this[selectedStatStr].Amount || 0, this.PowerLevel);
                if (selectedStatStr != "Resistance")
                    this[selectedStatStr].AmountPercentage = new CalculationsHelper().getEmpoweredValue(this[selectedStatStr].AmountPercentage || 0, this.PowerLevel);
                this.statsCalculated = true;
            }

            this.EquippableStatData = new SimpleAffixStats();
            this.EquippableStatData.InputMeta = new SimpleItemAffixStatsMetadata();
            this.EquippableStatData.OutputMeta = new SimpleItemAffixStatsMetadata();
            this.EquippableStatData.InputMeta.SelectedCategoryStat = this.constructor.name;
            this.EquippableStatData.InputMeta.SelectedStat = Helpers.getPropertyByValue(AffixCategoryEnum, this.CategoryStats);
            this.EquippableStatData.OutputMeta.SelectedCategoryStat = "SecondaryBasicStat";
            this.EquippableStatData.OutputMeta.SelectedStat = Helpers.getPropertyByValue(SecondaryStatTypesEnum, this.selectedStat);

            var selectedSubStatObj = this[Helpers.getPropertyByValue(SecondaryStatTypesEnum, this.selectedStat)];
            var selectedSubStatType = this.selectedStat == SecondaryStatTypesEnum.Resistance ? ResistanceTypesEnum
                                    : this.selectedStat == SecondaryStatTypesEnum.RedirectDamage ? DamageTypesEnum
                                    : this.selectedStat == SecondaryStatTypesEnum.IncreaseStatSunder ? ResistanceTypesEnum
                                    : this.selectedStat == SecondaryStatTypesEnum.DamageTakenReduced ? DamageTypesEnum
                                    : this.selectedStat == SecondaryStatTypesEnum.CCReduction ? CCEffectTypesEnum
                                    : Helpers.getPropertyByValue(SecondaryStatTypesEnum, this.selectedStat);

            // TODO: MAKE ITEMSIMPLESTATS RETURN PROPERLY THE SUBVALUES
            if (this.selectedStat == SecondaryStatTypesEnum.EmpowerTrapsAndSummons) { debugger; }
            var selectedSubStat = Helpers.getPropertyByValue(selectedSubStatType, selectedSubStatObj.Type) || selectedSubStatObj.Type;
            this.EquippableStatData.OutputMeta.SelectedEquipStat = selectedSubStat;
    }

    GetDescription(): string {
        // Resistance = 1,             // EmpowerTrapsAndSummons = 4,
        // CCReduction = 2,            // RedirectDamage = 5,
        // DamageTakenReduced = 3,     // IncreaseStatSunder = 6
        if (this.EquippableStatData.OutputMeta.SelectedStat) {
            var selectedStat = Helpers.getPropertyByValue(SecondaryStatTypesEnum, this.selectedStat);
            if (!this[selectedStat]) {
                this.selectedStat = this.GetSelectedStat();
                selectedStat = Helpers.getPropertyByValue(SecondaryStatTypesEnum, this.selectedStat);
                console.log(selectedStat);
                console.log(this);
            }
        }

        if (!this.EquippableStatData.OutputMeta.SelectedStat) {
            debugger;
            return "";
        }

        var isPrimaryType = [SecondaryStatTypesEnum.Resistance, SecondaryStatTypesEnum.IncreaseStatSunder].includes(this.selectedStat);
        var isPercentage = this[selectedStat].AmountPercentage;

        var quantifier = isPercentage ? this[selectedStat].AmountPercentage + "%" : this[selectedStat].Amount;
        var descrPrimary = isPrimaryType ? this[selectedStat].GetDescription() : "";
        var dpsDescr = this.selectedStat == SecondaryStatTypesEnum.DamageTakenReduced
            ? "DamageTaken of type " + Helpers.getPropertyByValue(DamageTypesEnum, this.damageType) + " reduced by " + quantifier : "";
        var redirectDescr = this.selectedStat == SecondaryStatTypesEnum.RedirectDamage
            ? quantifier + " of DamageTaken of type " + Helpers.getPropertyByValue(ResistanceTypesEnum, this.elementType) + " goes to " + Helpers.getPropertyByValue(BasicStatsEnum, this.statType) : "";
        var ccDescr = this.selectedStat == SecondaryStatTypesEnum.CCReduction
            ? "Effects of type " + Helpers.getPropertyByValue(CCEffectTypesEnum, this.ccType) + " reduced by " + quantifier : "";
        var empowerDescr = this.selectedStat == SecondaryStatTypesEnum.EmpowerTrapsAndSummons
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
