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
}
