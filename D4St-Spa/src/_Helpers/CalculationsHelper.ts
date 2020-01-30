import { BasicStatsVM } from 'src/Models/BasicStatsVM';
import { SkillEnums } from 'src/_Enums/skillEnums';
import { ISkillPowerDetailDTO } from 'src/Models/DTOs/ISkillPowerDetailDTO';
import { SkillAffixDetail } from 'src/Models/DTOs/SkillAffixDetail';
import { PowerEnums } from 'src/_Enums/powerTypesEnum';
import { ISkillAffixDetail } from 'src/Models/DTOs/ISkillAffixDetail';

export class CalculationsHelper {
  public static calculateChangeDetails(change: BasicStatsVM, orig: BasicStatsVM) {
    var changedData = new BasicStatsVM();
    var cd = changedData;
    // TODO: Make a Generic Compare (if possible)
    cd.BasicData.Level = change.BasicData.Level - (orig.BasicData.Level || 0);
    cd.BasicData.AngelicPower = change.BasicData.AngelicPower - (orig.BasicData.AngelicPower || 0);
    cd.BasicData.DemonicPower = change.BasicData.DemonicPower - (orig.BasicData.DemonicPower || 0);
    cd.BasicData.AncestralPower = change.BasicData.AncestralPower - (orig.BasicData.AncestralPower || 0);
    cd.BasicData.MaxDamage = Math.abs(change.BasicData.MaxDamage - (orig.BasicData.MaxDamage || 0));
    cd.BasicData.MaxDamageBonus = Math.abs(change.BasicData.MaxDamageBonus - (orig.BasicData.MaxDamageBonus || 0));
    cd.BasicData.MinDamage = Math.abs(change.BasicData.MinDamage - (orig.BasicData.MinDamage || 0));
    cd.BasicData.MinDamageBonus = Math.abs(change.BasicData.MinDamageBonus - (orig.BasicData.MinDamageBonus || 0));
    cd.BasicData.UnassignedPower = change.BasicData.UnassignedPower - (orig.BasicData.UnassignedPower || 0);
    cd.BasicData.TotalPower = change.BasicData.TotalPower - (orig.BasicData.TotalPower || 0);

    cd.AngelicPowers.BuffDuration = Math.abs(change.AngelicPowers.BuffDuration - (orig.AngelicPowers.BuffDuration || 0));
    cd.AngelicPowers.LifeAmount = Math.abs(change.AngelicPowers.LifeAmount - (orig.AngelicPowers.LifeAmount || 0));
    cd.AngelicPowers.LifePerHit = Math.abs(change.AngelicPowers.LifePerHit - (orig.AngelicPowers.LifePerHit || 0));
    cd.AngelicPowers.LifeRegenRate = Math.abs(change.AngelicPowers.LifeRegenRate - (orig.AngelicPowers.LifeRegenRate || 0));
    cd.AngelicPowers.LifeReturn = Math.abs(change.AngelicPowers.LifeReturn - (orig.AngelicPowers.LifeReturn || 0));
    cd.AngelicPowers.LifeReturnChance = Math.abs(change.AngelicPowers.LifeReturnChance - (orig.AngelicPowers.LifeReturnChance || 0));
    cd.AngelicPowers.SpellPowerBonus = Math.abs(change.AngelicPowers.SpellPowerBonus - (orig.AngelicPowers.SpellPowerBonus || 0));
    cd.AngelicPowers.SpellPowerChance = Math.abs(change.AngelicPowers.SpellPowerChance - (orig.AngelicPowers.SpellPowerChance || 0));
    cd.AngelicPowers.StaminaRegenRate = Math.abs(change.AngelicPowers.StaminaRegenRate - (orig.AngelicPowers.StaminaRegenRate || 0));

    cd.DemonicPowers.DebuffDuration = Math.abs(change.DemonicPowers.DebuffDuration - (orig.DemonicPowers.DebuffDuration || 0));
    cd.DemonicPowers.ReduceSpellDamage = Math.abs(change.DemonicPowers.ReduceSpellDamage - (orig.DemonicPowers.ReduceSpellDamage || 0));
    cd.DemonicPowers.ReduceSpellpowerChance = Math.abs(change.DemonicPowers.ReduceSpellpowerChance - (orig.DemonicPowers.ReduceSpellpowerChance || 0));
    cd.DemonicPowers.ResourceAmount = Math.abs(change.DemonicPowers.ResourceAmount - (orig.DemonicPowers.ResourceAmount || 0));
    cd.DemonicPowers.ResourceRegen = Math.abs(change.DemonicPowers.ResourceRegen - (orig.DemonicPowers.ResourceRegen || 0));
    cd.DemonicPowers.ResourceReturn = Math.abs(change.DemonicPowers.ResourceReturn - (orig.DemonicPowers.ResourceReturn || 0));
    cd.DemonicPowers.ResourceReturnChance = Math.abs(change.DemonicPowers.ResourceReturnChance - (orig.DemonicPowers.ResourceReturnChance || 0));
    cd.DemonicPowers.StaminaReturn = Math.abs(change.DemonicPowers.StaminaReturn - (orig.DemonicPowers.StaminaReturn || 0));
    // cd.DemonicPowers.StaminaReturnChance = Math.abs(change.DemonicPowers.StaminaReturnChance - (orig.DemonicPowers.StaminaReturnChance || 0));

    cd.AncestralPowers.DamagePerHitMax = Math.abs(change.AncestralPowers.DamagePerHitMax - (orig.AncestralPowers.DamagePerHitMax || 0));
    cd.AncestralPowers.DamagePerHitMin = Math.abs(change.AncestralPowers.DamagePerHitMin - (orig.AncestralPowers.DamagePerHitMin || 0));
    cd.AncestralPowers.ProcPercentage = Math.abs(change.AncestralPowers.ProcPercentage - (orig.AncestralPowers.ProcPercentage || 0));
    cd.AncestralPowers.StaminaAmount = Math.abs(change.AncestralPowers.StaminaAmount - (orig.AncestralPowers.StaminaAmount || 0));
    cd.AncestralPowers.StaminaSunder = Math.abs(change.AncestralPowers.StaminaSunder - (orig.AncestralPowers.StaminaSunder || 0));

    changedData = cd;
    return changedData;
  }

  public static GetSkillAffixDescription(pd: ISkillAffixDetail, md:number[], powerType:number):string {
    // var powerTypes = [1, 2, 3];
    // powerTypes.forEach(powerType => {
    var description: string = "";

    if (pd)
    {
        var hasProcChance = (pd || {ProcChance: 0}).ProcChance != 0;

        if (hasProcChance)
        {
            var startStr = pd.ProcsOnDeath ? "Monster death causes "
            : md.indexOf(SkillEnums.AffixMetadataEnum.HitProc) != -1 ? "Hit"
            : md.indexOf(SkillEnums.AffixMetadataEnum.Summon) != -1 ? "Summon"
            : "Cast" ;

            description = pd.ProcsOnDeath
              ? startStr + pd.SelectedAffix
              : (startStr + " has a " + pd.ProcChance + "% chance ") + " to " + pd.SelectedAffix;
        }
        else {
            description = "Gains " + pd.ProcChance + " chance to " + pd.SelectedAffix;
        }

        if (md.indexOf(SkillEnums.AffixMetadataEnum.Curse) != -1) {
            description += " cast a " + pd.SelectedAffix + " on target";
        }
        if (md.indexOf(SkillEnums.AffixMetadataEnum.CC) != -1) {
            description += pd.SelectedAffix + " target ";
        }
        if (md.indexOf(SkillEnums.AffixMetadataEnum.BuffDebuff) != -1) {
            description += " gain buff which allows you to " + pd.SelectedAffix;
        }
        if (pd.ProcAmount != 0) {
          description += " by " + pd.ProcAmount;
        }
        if (pd.Duration != 0) {
            description += " for " + pd.Duration + " seconds";
        }
    }

    return description;
  }
}
