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
import { ArmorTypesEnum, ItemWeaponTypesEnum, DamageTypesEnum, ResistanceTypesEnum, AffixCategoryEnum, BasicStatTypesEnum, ItemArmorTypesEnum, ItemRarityTypesEnum } from 'src/_Enums/itemAffixEnums';
import { PowerTypesEnum } from 'src/_Enums/powerTypesEnum';
import { TriggerTypesEnum, HitEffectTypesEnum, CCEffectTypesEnum, SpellEffectTypesEnum } from 'src/_Enums/triggerAffixEnums';
import { AffixMetadataEnum } from 'src/_Enums/skillEnums';
import { SkillVM } from 'src/Models/SkillVM';
import { IItemAffix } from 'src/Models/ItemAffixes/IItemAffix';
import { IEffectAffix, SimpleEffectAffix, IEffectAffixHolder } from 'src/Models/ItemAffixes/EffectAffixes/IEffectAffix';
import { HitEffectAffix } from 'src/Models/ItemAffixes/EffectAffixes/HitEffectAffix';
import { SpellEffectAffix } from 'src/Models/ItemAffixes/EffectAffixes/SpellEffectAffix';
import { CCEffectAffix } from 'src/Models/ItemAffixes/EffectAffixes/CCEffectAffix';

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
      var variance = Helpers.getRandom(115, 122)/100;
      if (i < 15) {
        value += Helpers.getRandom(2, 3);
      }
      else {
        value*= variance;
      }
    }
    return Math.round(value);
  }

  public getWeaponEmpoweredValue(value:number, powerLevel:number):number {
    for (let i = 0; i < powerLevel; i++) {
      var variance = Helpers.getRandom(115, 125)/100;
      if (i < 28) {
        value += Helpers.getRandom(1, 3);
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

  public getTriggerStatsForLevel(stat: number, level: number, powerLevel:number, type:TriggerTypesEnum): number {
    var compensationFactor = level > 28 ? (level - 28)/2 : 0;
    stat = Math.round((stat + compensationFactor)*(Helpers.getRandom(60,80)/100)*10)/10;
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
    var selected = type % delimiter;
    if ([BasicStatTypesEnum.PowerStats, BasicStatTypesEnum.StatReturn]) {
      // Powers, StatReturn
      stat += Math.round((level || 1) * Helpers.getRandom(25, 40)/100 * 10)/10;
    }
    if (selected == BasicStatTypesEnum.StatAmount) {
        // + HP/Mana/Stamina
        stat += Math.round((level || 1) * Helpers.getRandom(60, 90)/100 * 10)/10;
    }
    if (selected == BasicStatTypesEnum.StatRegen) {
        // + HP/Mana/Stamina Regen
        var regenFactor = Math.round((level / 8)*10)/10;
        var bonus = Math.max(1, regenFactor * (1 + Helpers.getRandom(-30, +30)/100));
        stat+= bonus;
    }
    if (selected == BasicStatTypesEnum.StatPercentage) {
      // + HP/Mana/Stamina Percentage
      stat += Math.round((level || 1) * Helpers.getRandom(60, 90)/100 * 10)/10;
    }
    if (selected == BasicStatTypesEnum.StatPercentageRegen) {
      // + HP/Mana/Stamina Percentage
      var levelFactor = Math.abs(30 - (level || 1));
      var percentageFactor = Helpers.getRandom(60, 90)/10;
      stat += Math.round(percentageFactor * (5 - levelFactor/10) + Helpers.getRandom(10, 15));
    }
    if (selected == BasicStatTypesEnum.Resistance) {
        // Resistance
        var resusFactor = Math.round((level / 4) * 10)/10;
        var bonus = resusFactor * (Helpers.getRandom(50, 75)/100);
        if (isNaN(bonus)) bonus = 0;
        var selectedRes = Helpers.getRandom(1,6);
        if (selectedRes == ResistanceTypesEnum.All)
            bonus *= Helpers.getRandom(50, 75)/100;
        stat += bonus;
    }

    return Math.round(stat);
  }

  public GetArmorTypesInfoAndForArmorType(armorType?:ArmorTypesEnum):CCEffectTypesEnum[] {
    var armorTypesList = [ArmorTypesEnum.Heavy, ArmorTypesEnum.Light, ArmorTypesEnum.Mystic];
    var selectedCCTypes:CCEffectTypesEnum[] = [];

    armorTypesList.forEach(at => {
      if (at == ArmorTypesEnum.Heavy && (!armorType || armorType == at)) {
        selectedCCTypes.push(CCEffectTypesEnum.ReduceArmorOrBleed);
        selectedCCTypes.push(CCEffectTypesEnum.KnockbackOrLevitate);
      }
      if (at == ArmorTypesEnum.Light && (!armorType || armorType == at)) {
        selectedCCTypes.push(CCEffectTypesEnum.FreezeOrRoot);
        selectedCCTypes.push(CCEffectTypesEnum.StunOrKnockdown);
      }
      if (at == ArmorTypesEnum.Mystic && (!armorType || armorType == at)) {
          selectedCCTypes.push(CCEffectTypesEnum.BlindOrCurse);
          selectedCCTypes.push(CCEffectTypesEnum.WitherOrConflagrate);
      }
    });

    return selectedCCTypes;
  }

  public GetDamageTypesInfo():string[] {
    var info:string[] = [];
    var weaponTypes: ItemWeaponTypesEnum[] = [ItemWeaponTypesEnum.Axe, ItemWeaponTypesEnum.Bow, ItemWeaponTypesEnum.Hammer
      , ItemWeaponTypesEnum.Sword, ItemWeaponTypesEnum.Javelin, ItemWeaponTypesEnum.Wand, ItemWeaponTypesEnum.Staff];
    var damageTypes:DamageTypesEnum[] = [];
    weaponTypes.forEach(w => {
      var data = this.GetAppropriateDamageTypesForWeaponType(w, ItemRarityTypesEnum.Legendary);
      var leg = data[data.length - 1];
      var woLeg = data.splice(data.length - 1, 1);
      var dataStr = woLeg.map(d => Helpers.getPropertyByValue(DamageTypesEnum, d)).join(", ");
      info.push(Helpers.getPropertyByValue(ItemWeaponTypesEnum, w) + " : " + dataStr + " [" + leg + "]");
    })

    return info;
  }

  public LogAffixData(affixData:IItemAffix[], affixCategory:AffixCategoryEnum, skillData:SkillVM[]) {
    console.log("ItemAffixes affixes for type: " + Helpers.getPropertyByValue(AffixCategoryEnum, affixCategory));
    affixData.forEach(a => {
      if (a.AffixCategory == affixCategory) {
        console.log(JSON.stringify(a.Contents));
        console.log(JSON.stringify(a.GetAffixDescription(skillData)));
      }
    });
  }

  public GetAppropriateAffixesForTrigger(type:TriggerTypesEnum): IEffectAffixHolder[] {
    var triggerAffixes:IEffectAffixHolder[] = [];
    var physicalAttackTriggers = [
        HitEffectTypesEnum.LifeReturn,
        HitEffectTypesEnum.ResourceReturn,
        HitEffectTypesEnum.ResourceSunder,
        HitEffectTypesEnum.StaminaReturn,
        HitEffectTypesEnum.StaminaSunder,
        HitEffectTypesEnum.CriticalHit,
        HitEffectTypesEnum.Knockback,
        HitEffectTypesEnum.ReduceArmor,
        HitEffectTypesEnum.CrushingBlow,
        HitEffectTypesEnum.Bleed,
        HitEffectTypesEnum.Cleave,
        HitEffectTypesEnum.ChainOrPierce
    ];

    var ccAttackTriggers = [
      CCEffectTypesEnum.StunOrKnockdown,
      CCEffectTypesEnum.KnockbackOrLevitate,
      CCEffectTypesEnum.WitherOrConflagrate,
      CCEffectTypesEnum.BlindOrCurse,
      CCEffectTypesEnum.FreezeOrRoot,
      CCEffectTypesEnum.ReduceArmorOrBleed
    ];

    var spellAttackTriggers = [
        SpellEffectTypesEnum.CastRange,
        SpellEffectTypesEnum.AoE,
        SpellEffectTypesEnum.DoT,
        SpellEffectTypesEnum.Stackable,
        SpellEffectTypesEnum.Multicast,
        SpellEffectTypesEnum.ResourceSunder,
        SpellEffectTypesEnum.StaminaSunder,
        SpellEffectTypesEnum.CastSpell
    ];

    if (type == TriggerTypesEnum.HitEffectPhysical)
        triggerAffixes = physicalAttackTriggers.map(v => { return new HitEffectAffix(new SimpleEffectAffix(), v)});

    if (type == TriggerTypesEnum.HitEffectCC)
        triggerAffixes = ccAttackTriggers.map(v => { return new CCEffectAffix(new SimpleEffectAffix(), v)});

    if (type == TriggerTypesEnum.SpellEffect)
        triggerAffixes = spellAttackTriggers.map(v => { return new SpellEffectAffix(new SimpleEffectAffix(), v)});

    return triggerAffixes;
}

// // PhysicalAttack = 1,           //TriggerAffixes [1,2], 4 CCEffectTypesEnum[1,2]
// // SpellAttack = 1,              //TA[6], CCET[5,6,8,9,10]
// // PhysicalAoE = 2,              //TriggerAffixes [3, 6], 3 CCEffectTypesEnum[4,7]
// // CCPhysical = 4,               //TA[3], CCET[3,4,7]
// // Spellcast = 5,                //Cast a spell
// public GetAppropriateEffectsForAffix(type:CCEffectAffix): IEffectAffix[] {
//     var triggerAffixes:IEffectAffix[] = [];

//     // Stun = 1,         // Curse = 6,
//     // Knockback = 2,    // Root = 7,  
//     // Burn = 3,         // Freeze = 8, 
//     // Wither = 4,       // Levitate = 9,        // Causes 50% projectile damage suffered 
//     // Blind = 5,        // ReduceArmor = 10
//     var physicalAttackTriggerTypes:IEffectAffix[] = [
//       new HitEffectAffix(
//         CCEffectTypesEnum.Stun,
//         CCEffectTypesEnum.Knockback,
//         CCEffectTypesEnum.Burn,
//         CCEffectTypesEnum.Wither,

//     ];

//     var physicalCCTriggers:CCEffectTypesEnum[] = [
//         CCEffectTypesEnum.Stun,
//         CCEffectTypesEnum.Blind
//     ];

//     var spellAttackTriggers:CCEffectTypesEnum[] = [
//         CCEffectTypesEnum.Burn,
//         CCEffectTypesEnum.Wither,
//         CCEffectTypesEnum.Curse,
//         CCEffectTypesEnum.Root,
//         CCEffectTypesEnum.Freeze
//     ];

//     // PhysicalAoE
//     var physicalAoETriggers:CCEffectTypesEnum[] = [
//         CCEffectTypesEnum.Knockback,
//     ];

//     // if (type == TriggerAffixTypesEnum.PhysicalAttack)
//     //     triggerAffixes = physicalAttackTriggers;

//     // if (type == TriggerAffixTypesEnum.PhysicalCC)
//     //     triggerAffixes = physicalCCTriggers;

//     // if (type == TriggerAffixTypesEnum.SpellDebuff)
//     //     triggerAffixes = spellAttackTriggers;

//     // if (type == TriggerAffixTypesEnum.PhysicalAoE)
//     //     triggerAffixes = physicalAoETriggers;
        
//     return triggerAffixes;
//   }

  public GetAppropriateDamageTypesForWeaponType(weapon:ItemWeaponTypesEnum, rarity:ItemRarityTypesEnum):DamageTypesEnum[] {
    // var physicalWeapons = [ItemWeaponTypesEnum.Axe, ItemWeaponTypesEnum.Hammer, ItemWeaponTypesEnum.Sword, ItemWeaponTypesEnum.Javelin];
    // var bludgeonWeapons = [ItemWeaponTypesEnum.Hammer, ItemWeaponTypesEnum.Staff];
    // var chainPierceWeapons = [ItemWeaponTypesEnum.Bow, ItemWeaponTypesEnum.Javelin, ItemWeaponTypesEnum.Sword];
    // var spellWeapons = [ItemWeaponTypesEnum.Bow, ItemWeaponTypesEnum.Wand, ItemWeaponTypesEnum.Staff];
    
    var damageTypes:DamageTypesEnum[] = [];
    if (weapon == ItemWeaponTypesEnum.Axe) {
      damageTypes = [DamageTypesEnum.PhysicalOrCC, DamageTypesEnum.CleaveOrAoE];
      if (rarity == ItemRarityTypesEnum.Legendary)
        damageTypes.push(DamageTypesEnum.TickOrCurse)
    }

    if (weapon == ItemWeaponTypesEnum.Bow) {
      damageTypes = [DamageTypesEnum.ChainOrProjectile, DamageTypesEnum.TickOrCurse];
      if (rarity == ItemRarityTypesEnum.Legendary)
        damageTypes.push(DamageTypesEnum.TrapOrSummon)
    }

    if (weapon == ItemWeaponTypesEnum.Hammer) {
      damageTypes = [DamageTypesEnum.PhysicalOrCC, DamageTypesEnum.TickOrCurse];
      if (rarity == ItemRarityTypesEnum.Legendary)
        damageTypes.push(DamageTypesEnum.CleaveOrAoE)
    }

    if (weapon == ItemWeaponTypesEnum.Sword) {
      damageTypes = [DamageTypesEnum.PhysicalOrCC, DamageTypesEnum.TickOrCurse, DamageTypesEnum.CleaveOrAoE];
      if (rarity == ItemRarityTypesEnum.Legendary)
        damageTypes.push(DamageTypesEnum.TrapOrSummon);
    }

    if (weapon == ItemWeaponTypesEnum.Javelin) {
      damageTypes = [DamageTypesEnum.ChainOrProjectile, DamageTypesEnum.CleaveOrAoE];
      if (rarity == ItemRarityTypesEnum.Legendary)
        damageTypes.push(DamageTypesEnum.CleaveOrAoE);
    }
    if (weapon == ItemWeaponTypesEnum.Wand) {
      damageTypes = [DamageTypesEnum.ChainOrProjectile, DamageTypesEnum.TickOrCurse];
      if (rarity == ItemRarityTypesEnum.Legendary)
        damageTypes.push(DamageTypesEnum.TrapOrSummon);
    }
    if (weapon == ItemWeaponTypesEnum.Staff) {
      damageTypes = [DamageTypesEnum.CleaveOrAoE, DamageTypesEnum.TickOrCurse];
      if (rarity == ItemRarityTypesEnum.Legendary)
        damageTypes.push(DamageTypesEnum.PhysicalOrCC);
    }

    return damageTypes;
  }

  public GetArmorTypesInfo(armorType?:ArmorTypesEnum):string[] {
    // Stun = 1,        Curse = 6,
    // Knockback = 2,   Root = 7,
    // Burn = 3,        Freeze = 8,
    // Wither = 4,      Levitate = 9,
    // Blind = 5,       ReduceArmor = 10
    var typeNames = this.GetArmorTypesInfoAndForArmorType(armorType).map(cct => Helpers.getPropertyByValue(CCEffectTypesEnum , cct));
    var data:string[] = [];
    data.push(Helpers.getPropertyByValue(ArmorTypesEnum , armorType) + " armor reduces : " + typeNames.join(", ").replace("Or", ", "));
    return data;
  }

  public GetAppropriateDamageTypesForCCEffect(effect:CCEffectTypesEnum):DamageTypesEnum[] {
    var slashOrPierceCCTypes: CCEffectTypesEnum[] = [CCEffectTypesEnum.FreezeOrRoot, CCEffectTypesEnum.ReduceArmorOrBleed, CCEffectTypesEnum.StunOrKnockdown];
    var bludgeonCCTypes: CCEffectTypesEnum[] = [CCEffectTypesEnum.ReduceArmorOrBleed, CCEffectTypesEnum.StunOrKnockdown, CCEffectTypesEnum.KnockbackOrLevitate];
    var chainPierceCCTypes: CCEffectTypesEnum[] = [CCEffectTypesEnum.WitherOrConflagrate, CCEffectTypesEnum.BlindOrCurse, CCEffectTypesEnum.FreezeOrRoot];
    var mysticCCTypes: CCEffectTypesEnum[] = [CCEffectTypesEnum.BlindOrCurse, CCEffectTypesEnum.WitherOrConflagrate, CCEffectTypesEnum.FreezeOrRoot];

    var physicalDamageTypes = [DamageTypesEnum.PhysicalOrCC, DamageTypesEnum.TickOrCurse, DamageTypesEnum.CleaveOrAoE];
    var bludgeonDamageTypes = [DamageTypesEnum.PhysicalOrCC, DamageTypesEnum.TrapOrSummon, DamageTypesEnum.TickOrCurse];
    var chainPierceDamageTypes = [DamageTypesEnum.TrapOrSummon, DamageTypesEnum.CleaveOrAoE, DamageTypesEnum.ChainOrProjectile];
    var spellDamageTypes = [DamageTypesEnum.ChainOrProjectile, DamageTypesEnum.TickOrCurse, DamageTypesEnum.TrapOrSummon];

    var ccTypesArray = [slashOrPierceCCTypes, bludgeonCCTypes, chainPierceCCTypes, mysticCCTypes];
    var damageTypes = [physicalDamageTypes, bludgeonDamageTypes, chainPierceDamageTypes, spellDamageTypes];

    var selectedDamageTypes:DamageTypesEnum[] = [];
    ccTypesArray.forEach((c, i) => {if (c.includes(effect))
      selectedDamageTypes.concat(damageTypes[i]);
    });

    return selectedDamageTypes;
  }

  public GetCalculatedFactor(selectedType: string, amount: number, level: number) {
    var isHeavy = selectedType == Helpers.getPropertyByValue(ArmorTypesEnum, ArmorTypesEnum.Heavy) + "Armor";
    var isLight = selectedType == Helpers.getPropertyByValue(ArmorTypesEnum, ArmorTypesEnum.Light) + "Armor";
    // var isMystic = selectedType == Helpers.getPropertyByValue(ArmorTypesEnum, ArmorTypesEnum.Mystic) + "Armor";

    // Start relative high numbers, then do Diminished returns afterwards
    var factorZero = isHeavy ? 0.64 : isLight ? 0.42 : 0.28;
    var factorMin = isHeavy ? 0.18 : isLight ? 0.14 : 0.08;

    // 16 Armor per level the requirement, as levels go up, the requirement gets a bit higher
    var amountPerLvl = 20;
    var lvlCalcFactor = 4;
    var lvlMaxCoeff = amountPerLvl + Math.round(level/lvlCalcFactor);
    var factorCalc = factorZero;

    // Calculate Average of reductions for each LvlCalcFactor levels
    var maxLvl = 40;
    var currentLvl = 0;
    var step = Math.round((factorZero - factorMin) * lvlMaxCoeff/maxLvl * 100) / 100;
    var factorCalcList:number[] = [];
    while(currentLvl <= level && factorCalc > step) {
      factorCalc -= step;
      // factorCalc *= amountPerLvl * lvlMaxCoeff;
      currentLvl+=lvlCalcFactor;
      factorCalcList.push(Math.round(factorCalc * 100) / 100);
    }
    
    var sum = factorCalcList.reduce((a, b) => a + b, 0);
    var avg = (sum / factorCalcList.length) || 0;
    
    return Math.round(avg * 100)/100;
  }
}
