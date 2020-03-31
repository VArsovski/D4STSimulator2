import { BasicStatsVM } from 'src/Models/BasicStatsVM';
import { SkillEnums } from 'src/_Enums/skillEnums';
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
import { ArmorTypesEnum, CCEffectTypesEnum, ItemWeaponTypesEnum, CCEffectGroupsEnum, DamageTypesEnum } from 'src/_Enums/itemAffixEnums';

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
            : md.indexOf(SkillEnums.AffixMetadataEnum.HitProc) != -1 ? "Hit"
            : md.indexOf(SkillEnums.AffixMetadataEnum.Summon) != -1 ? "Summon"
            : "Cast" ;

            description = PoD
              ? startStr + pd.SelectedAffix
              : (startStr + " has " + pd.ProcChance + "% chance ") + " to " + pd.SelectedAffix;
        }
        else if (pd.ProcChance) {
            description = "Gains " + pd.ProcChance + " chance to " + pd.SelectedAffix;
        }

        if (pd.SelectedAffix && md.indexOf(SkillEnums.AffixMetadataEnum.Curse) != -1) {
            description += " cast a " + pd.SelectedAffix + " on target";
        }
        if (pd.SelectedAffix && md.indexOf(SkillEnums.AffixMetadataEnum.CC) != -1) {
            description += pd.SelectedAffix + " target ";
        }
        if (pd.SelectedAffix && md.indexOf(SkillEnums.AffixMetadataEnum.BuffDebuff) != -1) {
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
      var variance = Helpers.getRandom(115, 130)/100;
      if (i < 15) {
        value += Helpers.getRandom(2, 4);
      }
      else {
        value*= variance;
      }
    }
    return value;
  }
  
  public getEmpoweredStr(sign:string, powerLevel:number):any {
    var str = "";
    for (let i = 0; i < powerLevel; i++) { str+=sign; }
    return str;
  }

  public getBasicStatEmpowerAmount(level: number, powerLevel: number): number {
    return Math.round((this.getEmpoweredValue(Helpers.getRandom(2, 6), powerLevel) + 6 + level/4) * 10) /10    
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

      data.push(Helpers.getPropertyByValue(ArmorTypesEnum , armorType) + " : " + typeNames.join(", "));
    });

    return data;
  }

  public GetDamageTypesInfo():string[] {
    var data:string[] = [];
    data.push(Helpers.getPropertyByValue(ItemWeaponTypesEnum, ItemWeaponTypesEnum.Axe)       + " : " + Helpers.getPropertyByValue(DamageTypesEnum, DamageTypesEnum.BleedOrArmorReduction));
    data.push(Helpers.getPropertyByValue(ItemWeaponTypesEnum, ItemWeaponTypesEnum.Bow)       + " : " + Helpers.getPropertyByValue(DamageTypesEnum, DamageTypesEnum.PoisonOrBurn));
    data.push(Helpers.getPropertyByValue(ItemWeaponTypesEnum, ItemWeaponTypesEnum.Hammer)    + " : " + Helpers.getPropertyByValue(DamageTypesEnum, DamageTypesEnum.KnockbackOrRoot));
    data.push(Helpers.getPropertyByValue(ItemWeaponTypesEnum, ItemWeaponTypesEnum.Sword)     + " : " + Helpers.getPropertyByValue(DamageTypesEnum, DamageTypesEnum.CleaveOrAoE));
    data.push(Helpers.getPropertyByValue(ItemWeaponTypesEnum, ItemWeaponTypesEnum.Javelin)   + " : " + Helpers.getPropertyByValue(DamageTypesEnum, DamageTypesEnum.ChainOrPierceAttack));
    data.push(Helpers.getPropertyByValue(ItemWeaponTypesEnum, ItemWeaponTypesEnum.Wand)      + " : " + Helpers.getPropertyByValue(DamageTypesEnum, DamageTypesEnum.ProjectileOrSummon));
    data.push(Helpers.getPropertyByValue(ItemWeaponTypesEnum, ItemWeaponTypesEnum.Staff)     + " : " + Helpers.getPropertyByValue(DamageTypesEnum, DamageTypesEnum.FreezeOrStun));

    return data;
  }  
}
