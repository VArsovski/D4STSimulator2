import { BasicStatsVM } from 'src/Models/BasicStatsVM';
import { SkillAffixDetail } from 'src/Models/DTOs/SkillAffixDetail';
import { ISkillAffixDetail } from 'src/Models/DTOs/ISkillAffixDetail';
import { SkillPowerDetailDTO } from 'src/Models/DTOs/SkillPowerDetailDTO';
import { Helpers } from './helpers';
import { ISkillDetailDTO } from 'src/Models/DTOs/ISkillDetailDTO';
import { BasicCharStats } from 'src/Models/BasicCharStats';
import { AngelicPowerAffixes } from 'src/Models/AngelicPowerAffixes';
import { DemonicPowerAffixes } from 'src/Models/DemonicPowerAffixes';
import { AncestralPowerAffixes } from 'src/Models/AncestralPowerAffixes';
import { SkillDTO } from 'src/Models/DTOs/SkillDTO';
import { SkillDamageDataDTO } from 'src/Models/DTOs/SkillDamageDataDTO';
import { ArmorTypesEnum, ItemWeaponTypesEnum, DamageTypesEnum, ResistanceTypesEnum } from 'src/_Enums/itemAffixEnums';
import { PowerTypesEnum } from 'src/_Enums/powerTypesEnum';
import { TriggerStatsEnum, CCEffectTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { AffixMetadataEnum } from 'src/_Enums/skillEnums';

export class CalculationsHelper {

  public static calculateChangeDetails(change: BasicStatsVM, orig: BasicStatsVM) {
    var changedData = new BasicStatsVM();
    var cd = changedData;
    cd.BasicData = Helpers.getNumericDifferences<BasicCharStats>(change.BasicData, orig.BasicData);
    cd.AngelicPowers = Helpers.getNumericDifferences<AngelicPowerAffixes>(change.AngelicPowers, orig.AngelicPowers);
    cd.DemonicPowers = Helpers.getNumericDifferences<DemonicPowerAffixes>(change.DemonicPowers, orig.DemonicPowers);
    cd.AncestralPowers = Helpers.getNumericDifferences<AncestralPowerAffixes>(change.AncestralPowers, orig.AncestralPowers);

    changedData = cd;
    return changedData;
  }

  public static calculateSkillDetails(change: SkillDTO, orig: SkillDTO) {
    var changedData = new SkillDTO();
    var cd = changedData;

    cd.skillData = new SkillDamageDataDTO();
    cd.skillData.powerData = Helpers.getNumericDifferences<ISkillDetailDTO>(change.skillData.powerUp, orig.skillData.powerData);
    cd.skillData.powerUp = Helpers.getNumericDifferences<ISkillDetailDTO>(change.skillData.powerUp, orig.skillData.powerData);    
    cd.angelicAffix = new SkillPowerDetailDTO();
    cd.angelicAffix.powerData = this.calculateSkillAffixDetails(change.angelicAffix.powerUp, orig.angelicAffix.powerData);
    cd.angelicAffix.powerUp = this.calculateSkillAffixDetails(change.angelicAffix.powerUp, orig.angelicAffix.powerData);
    cd.demonicAffix = new SkillPowerDetailDTO();
    cd.demonicAffix.powerData = this.calculateSkillAffixDetails(change.demonicAffix.powerUp, orig.demonicAffix.powerData);
    cd.demonicAffix.powerUp = this.calculateSkillAffixDetails(change.demonicAffix.powerUp, orig.demonicAffix.powerData);
    cd.ancestralAffix = new SkillPowerDetailDTO();
    cd.ancestralAffix.powerData = this.calculateSkillAffixDetails(change.ancestralAffix.powerUp, orig.ancestralAffix.powerData);
    cd.ancestralAffix.powerUp = this.calculateSkillAffixDetails(change.ancestralAffix.powerUp, orig.ancestralAffix.powerData);

    changedData = cd;
    return changedData;
  }

  public static calculateSkillAffixDetails(change: ISkillAffixDetail, orig: ISkillAffixDetail) {
    var changedData = new SkillAffixDetail();
    var cd = changedData;
    cd = Helpers.getNumericDifferences<ISkillAffixDetail>(change, orig);
    changedData = cd;
    return changedData;
  }  

  public static GetSkillAffixDescription(pd: ISkillAffixDetail, md:number[] = [], powerType:number):string {
    // var powerTypes = [1, 2, 3];
    // powerTypes.forEach(powerType => {
    var description: string = "";

    if (pd)
    {
        var hasProcChance = ((pd || {ProcChance: 0}).ProcChance || 0) != 0;
        var PoD = (pd.ProcsOnDeath || false);

        if (hasProcChance)
        {
            var startStr = PoD ? "Monster death causes "
            : md.indexOf(AffixMetadataEnum.HitProc) != -1 ? "Hit"
            : md.indexOf(AffixMetadataEnum.Summon) != -1 ? "Summon"
            : "Cast" ;

            description = PoD
              ? startStr + pd.SelectedAffix
              : (startStr + " has " + pd.ProcChance + "% chance ") + " to " + pd.SelectedAffix;
        }
        else if (pd.ProcChance) {
            description = "Gains " + pd.ProcChance + " chance to " + pd.SelectedAffix;
        }

        if (pd.SelectedAffix && md.indexOf(AffixMetadataEnum.Curse) != -1) {
            description += " cast a " + pd.SelectedAffix + " on target";
        }
        if (pd.SelectedAffix && md.indexOf(AffixMetadataEnum.CC) != -1) {
            description += pd.SelectedAffix + " target ";
        }
        if (pd.SelectedAffix && md.indexOf(AffixMetadataEnum.BuffDebuff) != -1) {
            description += " gain buff which allows you to " + pd.SelectedAffix;
        }
        if (pd.SelectedAffix && pd.ProcAmount != 0) {
          description += " by " + pd.ProcAmount;
        }
        if (pd.SelectedAffix && pd.Duration != 0) {
            description += " for " + pd.Duration + " seconds";
        }
    }

    return description;
  }

  public getEmpoweredValue(value:number, powerLevel:number):number {
    for (let i = 0; i < powerLevel; i++) {
      var variance = Helpers.getRandom(115, 125)/100;
      if (i < 15) {
        value += Helpers.getRandom(2, 3);
      }
      else {
        value*= variance;
      }
    }
    return Math.round(value);
  }
  
  public getEmpoweredStr(sign:string, powerLevel:number):any {
    var str = "";
    for (let i = 0; i < powerLevel; i++) { str+=sign; }
    return str;
  }

  public getArmorCalculatedData(level: number, powerLevel: number, min:number, max:number): number[] {
    var stats:number[] = [];
    var stat = Helpers.getRandom(5,7);
    var amount = this.getArmorStatForLevel(Helpers.getRandom(min, max), level);
    var minCalc = this.getArmorStatForLevel(min, level);
    var maxCalc = this.getArmorStatForLevel(max, level);
    stats.push(amount);

    var rollLuck = Math.abs(2 - amount/(minCalc+maxCalc)); //max should be ~2
    var compensationFactor = Helpers.getRandom(25, 30)/10 - rollLuck; //max compensation = 3x
    stats.push(Math.round(this.getEmpoweredValue((level/10 + stat)*compensationFactor, powerLevel)));
    return stats;
  }

  public getDamageCalculatedData(level: number, powerLevel: number, min:number, max:number): number[] {
    var stats:number[] = [];
    var stat = Helpers.getRandom(8,10);
    var minCalculated = this.getDamageStatForLevel(min, level);
    var maxCalculated = this.getDamageStatForLevel(max, level);
    stats.push(Math.min(minCalculated, maxCalculated));
    stats.push(Math.max(minCalculated, maxCalculated));

    var rollLuck = Math.round(this.getDamageStatForLevel((min + max)/2, level)/((minCalculated + maxCalculated)/2) * 100)/ 100; //calculated-aveerage/average-of-calculated
    var levelReductionMultiplier = Math.round(((240-level)/240) * 100)/100;
    // var maxAllowed = Math.round(this.getEmpoweredValue(Helpers.getRandom(13, 15), powerLevel) + level/4);

    stats.push(Math.round(this.getEmpoweredValue((levelReductionMultiplier * stat)/rollLuck, powerLevel)/2));
    return stats;
  }

  public getArmorStatForLevel(stat: number, level: number): number {
    //var varianceEmpower = Math.round((Helpers.getRandom(124, 128)/100) * 100)/100;
    var lvlCoeff = level/4;
    var basicStat = stat * (1 + Helpers.getRandom(1, lvlCoeff)/stat);
    return Math.round(lvlCoeff + basicStat * Math.pow(Math.round((Helpers.getRandom(126, 130)/100) * 100)/100, lvlCoeff));
  }
  
  public getDamageStatForLevel(stat: number, level: number): number {
    var varianceEmpower = Math.round((Helpers.getRandom(106, 108)/100) * 100)/100;
    return Math.round(stat * Math.pow(varianceEmpower, level));
  }

  public getBasicPowerForLevel(stat: number, level: number, type:PowerTypesEnum): number {
    var powerLevel = Math.round(Math.max(0, (level-stat)/4)* 10)/10;
    stat = Math.round(this.getEmpoweredValue(stat, powerLevel)* 10)/10;
    var compensationFactor = level > 24 ? (level - 24)/2 : 0;
    stat = Math.round((stat + compensationFactor)*(Helpers.getRandom(60,80)/100)*10)/10;
    if (type == PowerTypesEnum.All) {
      stat = Math.round((stat * Helpers.getRandom(60,80)/100)*10)/10;
    }
    return Math.round(stat);
  }

  public getResistancesForLevel(stat: number, level: number, type:ResistanceTypesEnum): number {
    var powerLevel = Math.round(Math.max(0, (level-stat)/4)* 10)/10;
    stat = Math.round(this.getEmpoweredValue(stat, powerLevel)* 10)/10;
    var compensationFactor = level > 24 ? (level - 24)/2 : 0;
    stat = Math.round((stat + compensationFactor)*(Helpers.getRandom(60,80)/100)*10)/10;
    if (type == ResistanceTypesEnum.All) {
      stat = Math.round(stat * Helpers.getRandom(45,65)/100);
    }
    return Math.round(stat);
  }

  getTriggerChanceForLevel(stat: number, level: number, powerLevel: number) {
    var statCompensation = Math.round((25 - stat)*Helpers.getRandom(30,60)/100);
    stat += (statCompensation + level/8);
    stat = this.getEmpoweredValue(stat, powerLevel);

    return Math.round(stat);
  }

  public getTriggerStatsForLevel(stat: number, level: number, powerLevel:number, type:TriggerStatsEnum): number {
    if (type == TriggerStatsEnum.Spellcast) {
      stat = Helpers.getRandom(1,2);
    }
    else
    {
      var compensationFactor = level > 24 ? (level - 24)/2 : 0;
      stat = Math.round((stat + compensationFactor)*(Helpers.getRandom(60,80)/100)*10)/10;
    }
    stat = Math.round(this.getEmpoweredValue(stat, powerLevel)* 10)/10;

    return stat;
  }

  getSecondaryTriggerStatForLevel(stat: number, level: number, powerLevel: number) {
    var statCompensation = Math.round((40 - stat)*Helpers.getRandom(30,60)/100);
    stat += (statCompensation + level/8);
    stat = this.getEmpoweredValue(stat, powerLevel);

    return Math.round(stat);
  }  

  public getBasicStatForLevel(type:number, stat: number, level: number): number {
    var delimiter = 6;
    if (type % delimiter == 1) {
      // Powers
      stat += Math.round((level || 1) * Helpers.getRandom(30, 50)/100 * 10)/10;
    }
    if (type % delimiter == 2) {
        // HP/Mana
        stat += Math.round((level || 1) * Helpers.getRandom(60, 90)/100 * 10)/10;
    }
    if (type % delimiter == 3) {
        // HP/Mana regen
        var regenFactor = Math.round(level / 8);
        var bonus = Math.max(1, regenFactor * (1 + Helpers.getRandom(-30, +30)/100));
        stat+= bonus;
    }
    if (type % delimiter == 4) {
        // Resistance
        var resusFactor = Math.round((level / 4) * 10)/10;
        var bonus = resusFactor * (Helpers.getRandom(50, 75)/100);
        if (isNaN(bonus)) bonus = 0;
        var selectedRes = Helpers.getRandom(1,6);
        if (selectedRes == 6)
            bonus *= Helpers.getRandom(50, 75)/100;
        stat += bonus;
    }

    return Math.round(stat);
  }

  public GetArmorTypesInfo():string[] {
    var armorTypesList = [ArmorTypesEnum.Heavy, ArmorTypesEnum.Light, ArmorTypesEnum.Mystic];
    var data:string[] = [];

    armorTypesList.forEach(armorType => {
      var selectedCCTypes:CCEffectTypesEnum[] = [];
      if (armorType == ArmorTypesEnum.Heavy) {
        selectedCCTypes.push(CCEffectTypesEnum.ReduceArmor);
        selectedCCTypes.push(CCEffectTypesEnum.Bleed);
        selectedCCTypes.push(CCEffectTypesEnum.Knockback);
        selectedCCTypes.push(CCEffectTypesEnum.Stun);
      }
      if (armorType == ArmorTypesEnum.Light) {
          selectedCCTypes.push(CCEffectTypesEnum.Root);
          selectedCCTypes.push(CCEffectTypesEnum.Wither);
          selectedCCTypes.push(CCEffectTypesEnum.Blind);
          selectedCCTypes.push(CCEffectTypesEnum.Burn);
      }
      if (armorType == ArmorTypesEnum.Mystic) {
          selectedCCTypes.push(CCEffectTypesEnum.Burn);
          selectedCCTypes.push(CCEffectTypesEnum.Curse);
          selectedCCTypes.push(CCEffectTypesEnum.Freeze);
          selectedCCTypes.push(CCEffectTypesEnum.Bleed);
      }

      var typeNames:string[] = [];
      selectedCCTypes.forEach(type => {
        typeNames.push(Helpers.getPropertyByValue(CCEffectTypesEnum, type));
      });

      data.push(Helpers.getPropertyByValue(ArmorTypesEnum , armorType) + " armor reduces : " + typeNames.join(", "));
    });

    return data;
  }

  public GetDamageTypesInfo():string[] {
    var data:string[] = [];
    data.push(Helpers.getPropertyByValue(ItemWeaponTypesEnum, ItemWeaponTypesEnum.Axe)       + " : " + Helpers.getPropertyByValue(DamageTypesEnum, DamageTypesEnum.BleedOrArmorReduction));
    data.push(Helpers.getPropertyByValue(ItemWeaponTypesEnum, ItemWeaponTypesEnum.Bow)       + " : " + Helpers.getPropertyByValue(DamageTypesEnum, DamageTypesEnum.PoisonOrBurn));
    data.push(Helpers.getPropertyByValue(ItemWeaponTypesEnum, ItemWeaponTypesEnum.Hammer)    + " : " + Helpers.getPropertyByValue(DamageTypesEnum, DamageTypesEnum.KnockbackOrStun));
    data.push(Helpers.getPropertyByValue(ItemWeaponTypesEnum, ItemWeaponTypesEnum.Sword)     + " : " + Helpers.getPropertyByValue(DamageTypesEnum, DamageTypesEnum.CleaveOrAoE));
    data.push(Helpers.getPropertyByValue(ItemWeaponTypesEnum, ItemWeaponTypesEnum.Javelin)   + " : " + Helpers.getPropertyByValue(DamageTypesEnum, DamageTypesEnum.ChainOrPierceAttack));
    data.push(Helpers.getPropertyByValue(ItemWeaponTypesEnum, ItemWeaponTypesEnum.Wand)      + " : " + Helpers.getPropertyByValue(DamageTypesEnum, DamageTypesEnum.ProjectileOrSummon));
    data.push(Helpers.getPropertyByValue(ItemWeaponTypesEnum, ItemWeaponTypesEnum.Staff)     + " : " + Helpers.getPropertyByValue(DamageTypesEnum, DamageTypesEnum.FreezeOrRoot));

    return data;
  }
}
