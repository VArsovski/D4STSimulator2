import { IItemAffixStats, SimpleItemAffixStatsMetadata, SimpleAffixStats } from './IItemAffixStats';
import { AffixCategoryEnum, SecondaryStatTypesEnum, DamageTypesEnum, ResistanceTypesEnum, BasicStatsEnum, CastTypesEnum } from 'src/_Enums/itemAffixEnums';
import { ItemSimpleStats, ItemBasicResistanceStatsDetail } from './ItemSimpleStats';
import { Helpers } from 'src/_Helpers/helpers';
import { CCEffectTypesEnum, SkillCategoryTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { IItemAffix } from '../IItemAffix';
import { IEquippableAffixStat } from 'src/Models/IEquippableStatDetails/IEquippableAffixStat';
import { SecondaryBasicStatsEquippable } from 'src/Models/IEquippableStatDetails/SecondaryBasicStatsEquippable';
import { ResistanceEquippable } from 'src/Models/IEquippableStatDetails/ResistanceEquippable';
import { TrapsEnum } from 'src/_Enums/skillEnums';
import { ItemDamageEmpowerStats } from './ItemDamageEmpowerStats';
import { ItemCCStatsDetail } from './ItemCCStatsDetail';
import { IDescribable } from '../IDescribable';
import { ItemTrapsDetail } from './ItemTrapsDetail';
import { ItemSkillTypeStats } from './ItemSkillTypeStats';
import { CCEffectTypesEquippable } from 'src/Models/IEquippableStatDetails/CCEffectTypesEquippable';
import { DamageEmpowerAffixHelper } from '../AffixHelpers/DamageAffixHelper';
import { DamageStatPrimaryEquippable } from 'src/Models/IEquippableStatDetails/DamageStatEquippable';

export class ItemSecondaryBasicStats implements IEquippableAffixStat, IDescribable {
    Level: number;
    PowerLevel: number;
    Amount: number;
    CategoryStats: AffixCategoryEnum;
    Resistance:ItemBasicResistanceStatsDetail;
    ReduceCCTaken:ItemCCStatsDetail;
    IncreaseStatSunder:ItemSimpleStats;
    EmpowerTrapsAndSummons:ItemTrapsDetail;
    ReduceDamageTaken: ItemDamageEmpowerStats;
    EmpowerSkillType:ItemSkillTypeStats;

    EquippableStatData: IItemAffixStats;
    updateEquippedStats: (src:IItemAffix, affix:IItemAffix) => IItemAffix;
    getZeroStats: (src: any) => any;

    private selectedStat: SecondaryStatTypesEnum;
    private statsCalculated: boolean;

    constructor(category:AffixCategoryEnum, level:number, powerLevel:number
        , selectedStat:SecondaryStatTypesEnum
        , resistance: ItemBasicResistanceStatsDetail
        , reduceCCTaken:ItemCCStatsDetail
        , increaseStatSunder:ItemSimpleStats
        , empowerTrapsAndSummons:ItemTrapsDetail
        , reduceDamageTaken: ItemDamageEmpowerStats
        , empowerSkillType:ItemSkillTypeStats
    )
    {
        this.CategoryStats = category;
        this.Level = level;
        this.PowerLevel = powerLevel;
        this.selectedStat = selectedStat,
        this.Resistance = resistance;
        this.ReduceCCTaken = reduceCCTaken;
        this.IncreaseStatSunder = increaseStatSunder;
        this.EmpowerTrapsAndSummons = empowerTrapsAndSummons;
        this.ReduceDamageTaken = reduceDamageTaken;
        this.EmpowerSkillType = empowerSkillType;

        if (!this.statsCalculated) {
            // Make numbers increased for Traps&Summons stat type increase
            if (this.selectedStat == SecondaryStatTypesEnum.EmpowerTrapsAndSummons)
                this.PowerLevel += 3;

            var selectedStatStr = Helpers.getPropertyByValue(SecondaryStatTypesEnum, this.selectedStat);

            if (!this[selectedStatStr]) {
                debugger;
            }

            this[selectedStatStr].Amount = new CalculationsHelper().getEmpoweredValue(this[selectedStatStr].Amount || 0, this.PowerLevel);
            if (selectedStatStr != "Resistance")
                this[selectedStatStr].AmountPercentage = new CalculationsHelper().getEmpoweredValue(this[selectedStatStr].AmountPercentage || 0, this.PowerLevel);
            this.statsCalculated = true;
        }

        var selectedStatStr = Helpers.getPropertyByValue(SecondaryStatTypesEnum, this.selectedStat);
        this.EquippableStatData = new SimpleAffixStats();
        this.EquippableStatData.InputMeta = new SimpleItemAffixStatsMetadata();
        this.EquippableStatData.OutputMeta = new SimpleItemAffixStatsMetadata();
        this.EquippableStatData.InputMeta.SelectedCategoryStat = this.constructor.name;
        this.EquippableStatData.InputMeta.SelectedStat = Helpers.getPropertyByValue(SecondaryStatTypesEnum, this.selectedStat);

        if (selectedStat == SecondaryStatTypesEnum.ReduceDamageTaken) {
            debugger;
            debugger;
            debugger;
        }

        this.EquippableStatData.OutputMeta.SelectedCategoryStat = this.selectedStat == SecondaryStatTypesEnum.Resistance ? ""
        : this.selectedStat == SecondaryStatTypesEnum.ReduceCCTaken ? "CCEffectsData"
        : this.selectedStat == SecondaryStatTypesEnum.ReduceDamageTaken ? "DamageEmpowerData"
        : "";

        var selectedStatStr = Helpers.getPropertyByValue(SecondaryStatTypesEnum, this.selectedStat);
        this.EquippableStatData.OutputMeta.SelectedStat = selectedStatStr;

        var selectedSubStatObj = this[Helpers.getPropertyByValue(SecondaryStatTypesEnum, this.selectedStat)];
        var selectedSubStatType = this.selectedStat == SecondaryStatTypesEnum.Resistance ? ResistanceTypesEnum
                                : this.selectedStat == SecondaryStatTypesEnum.ReduceCCTaken ? CCEffectTypesEnum
                                : this.selectedStat == SecondaryStatTypesEnum.IncreaseStatSunder ? BasicStatsEnum
                                : this.selectedStat == SecondaryStatTypesEnum.EmpowerTrapsAndSummons ? TrapsEnum
                                : this.selectedStat == SecondaryStatTypesEnum.ReduceDamageTaken ? DamageTypesEnum
                                : this.selectedStat == SecondaryStatTypesEnum.EmpowerSkillType ? CastTypesEnum
                                : Helpers.getPropertyByValue(SecondaryStatTypesEnum, this.selectedStat);

        // TODO: MAKE ITEMSIMPLESTATS RETURN PROPERLY THE SUBVALUES
        if (this.selectedStat == SecondaryStatTypesEnum.EmpowerTrapsAndSummons) {
            // debugger;
        }

        var selectedSubStat = Helpers.getPropertyByValue(selectedSubStatType, selectedSubStatObj.Type) || selectedSubStatObj.Type;
        this.EquippableStatData.OutputMeta.SelectedEquipStat = selectedSubStat;
        this.updateEquippedStats = this.selectedStat == SecondaryStatTypesEnum.Resistance ? new ResistanceEquippable().updateEquippedStats
                                 : this.selectedStat == SecondaryStatTypesEnum.ReduceCCTaken ? new CCEffectTypesEquippable().updateEquippedStats
                                 : this.selectedStat == SecondaryStatTypesEnum.ReduceDamageTaken ? new DamageStatPrimaryEquippable().updateEquippedStats
                                 : new SecondaryBasicStatsEquippable().updateEquippedStats;
        
        if (this.selectedStat == SecondaryStatTypesEnum.ReduceDamageTaken) {
            var temp = this.EquippableStatData.OutputMeta.SelectedEquipStat;
            this.EquippableStatData.OutputMeta.SelectedStat = this.EquippableStatData.OutputMeta.SelectedEquipStat;
            this.EquippableStatData.OutputMeta.SelectedEquipStat = "ReducePercentage";
        }
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
                // console.log(selectedStat);
                // console.log(this);
            }
        }

        if (!this.EquippableStatData.OutputMeta.SelectedStat) {
            // debugger;
            return "";
        }

        var descr = this[selectedStat].GetDescription();
        return descr;
    }

    GetSelectedStat():number {
        var selectedStat:number = 0;
        var currentStats:string[] = ["", "Resistance", "CCReduction", "DamageTakenReduced", "EmpowerTrapsAndSummons", "RedirectDamage", "IncreaseStatSunder"];

        for (let i = 0; i < currentStats.length; i++)
            if (this[currentStats[i]]) { selectedStat = i; break; }

        return selectedStat;
    }
}
