import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BasicStatsDTO } from 'src/Models/DTOs/BasicStatsDTO';
import { BasicStatsVM } from 'src/Models/BasicStatsVM';
import { map } from 'rxjs/operators';
import { SkillListVM } from 'src/Models/SkillListVM';
import { SkillVM } from 'src/Models/SkillVM';
import { Helpers } from '../_Helpers/helpers';
import { BasicCharStats } from 'src/Models/BasicCharStats';
import { LevelUpStatsVM } from 'src/Models/LevelUpStatsVM';
import { ISkillAffixDetail } from 'src/Models/DTOs/ISkillAffixDetail';
import { SkillAffixDetail } from 'src/Models/DTOs/SkillAffixDetail';
import { ISkillDTO } from 'src/Models/DTOs/ISkillDTO';
import { SkillDTO } from 'src/Models/DTOs/SkillDTO';
import { SkillWithImageVM } from 'src/Models/SkillWithImageVM';
import { ISkillDamageDataDTO } from 'src/Models/DTOs/ISkillDamageDataDTO';
import { SkillDamageDataDTO } from 'src/Models/DTOs/SkillDamageDataDTO';
import { SkillDetailDTO } from 'src/Models/SkillDetailDTO';
import { ISkillDetailDTO } from 'src/Models/DTOs/ISkillDetailDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: "root"
})
export class ApiServiceService {
  responseData: BasicStatsDTO;
  VM: BasicStatsVM;
  LevelUpVM: LevelUpStatsVM;
  SkillsVM: SkillListVM;
  LevelUpSkillVM: ISkillDTO;
  baseUrl: string;

  headerDict: any = {
    "Content-Type": "application/json",
    "Authorization": "Bearer ASDFQWER$#@!4321",
    // "Access-Control-Allow-Origin": "'http://localhost:4200'"
    // "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    // "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
  };

  // headers?: HttpHeaders | { [header: string]: string | string[]; }
  requestOptions:any;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiUrl;
    this.requestOptions = { headers: this.headerDict };
    this.VM = new BasicStatsVM();
    this.LevelUpVM = new LevelUpStatsVM();
    this.SkillsVM = new SkillListVM();
    this.LevelUpSkillVM = new SkillDTO();
  }

  getBasicStats = (): Promise<LevelUpStatsVM> => {
    return new Promise((resolve, reject) => {
      var classType = Helpers.getRandom(1, 3);
      this.http.get(this.baseUrl + "MainStats/" + classType, this.requestOptions)
        .pipe(
          map((response: any) => {
            this.VM = this.extractDetailsFromResponse(response.current);
            this.LevelUpVM.Current = this.extractDetailsFromResponse(response.current);
            this.LevelUpVM.New = this.extractDetailsFromResponse(response.new);
          })
        )
        .subscribe(
          response => {
            resolve(this.LevelUpVM);
            return resolve;
          },
          error => {
            console.log(error);
            reject(error);
          }
        );
    });
  };

  LevelUp(model: BasicCharStats, levels: number): Promise<LevelUpStatsVM> {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseUrl + "MainStats/LevelUp?levels=" + levels, model, this.requestOptions)
        .pipe(
          map((response: any) => {
            this.LevelUpVM.Current = this.extractDetailsFromResponse(response.current);
            this.LevelUpVM.New = this.extractDetailsFromResponse(response.new);
            this.LevelUpVM.IsMaxxed = response.isMaxxed;
          })
        )
        .subscribe(() => {
          resolve(this.LevelUpVM);
          return resolve;
        });
    });
  }

  PowerUp(model: BasicCharStats, powerType: any, levels: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // if (levels) {
      var url = this.baseUrl + 'MainStats/PowerUp?powerType=' + powerType + '&levels=' + levels;
      //}
      this.http.post(url, model, this.requestOptions)
      .pipe(map((response: any) => {
        this.LevelUpVM.Current = this.extractDetailsFromResponse(response.current);
        this.LevelUpVM.New = this.extractDetailsFromResponse(response.new);
        this.LevelUpVM.NewAngelic = this.extractDetailsFromResponse(response.newAngelic);
        this.LevelUpVM.NewDemonic = this.extractDetailsFromResponse(response.newDemonic);
        this.LevelUpVM.NewAncestral = this.extractDetailsFromResponse(response.newAncestral);
      }))
      .subscribe(() => {
        resolve(this.LevelUpVM);
        return resolve;
      })
    })
  }

  LevelUpSkill(model: ISkillDTO): Promise<ISkillDTO> {
    return new Promise((resolve, reject) => {
      var url = this.baseUrl + "SkillBar/LevelUp";
      this.http.post(url, model, this.requestOptions)
      .pipe(map((response:any) => {
        // debugger;
      }))
      .subscribe(() => {
        resolve(this.LevelUpSkillVM);
        return this.LevelUpSkillVM;
      });
    })
  }
  
  getSkills = (classType?: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      var url = classType ? this.baseUrl + "SkillBar/" + classType : this.baseUrl + "SkillBar/0";
      this.http
        .get(url, this.requestOptions)
        .pipe(
          map((response: any) => {
            const responseData = response.skills;
            responseData.forEach(element => {
              var skill = new SkillVM();
              skill.classId = element.classId;
              skill.className = element.className;
              skill.id = element.id;
              skill.name = element.name;
              skill.data = this.extractSkillDTOFromResponse(element.data);

              // TODO: Fix on API (if possible without Overchanging stuff)
              skill.level = element.level || element.data.skillData.level;
              skill.tier = element.tier || element.data.skillData.tier;

              this.SkillsVM.skills.push(skill);
            });
          })
        )
        .subscribe(() => {
          resolve(this.SkillsVM);
        });
    });
  };

  private extractDetailsFromResponse(data: any) {
    var vm = new BasicStatsVM();
    vm.BasicData.Level = data.classDefinition.level;
    vm.BasicData.TotalPower = data.classDefinition.totalPower;
    vm.BasicData.UnassignedPower = data.classDefinition.unassignedPower;
    vm.BasicData.ClassType = data.classDefinition.classType;
    vm.BasicData.ClassTypeStr = data.classDefinition.classTypeStr;

    vm.BasicData.AngelicPower = data.classDefinition.angelicPower;
    vm.BasicData.DemonicPower = data.classDefinition.demonicPower;
    vm.BasicData.AncestralPower = data.classDefinition.ancestralPower;
    vm.BasicData.MinDamage = data.damagePerHit.minValue;
    vm.BasicData.MaxDamage = data.damagePerHit.maxValue;
    vm.BasicData.MinDamageBonus = data.damagePerHit.bonusMinValue;
    vm.BasicData.MaxDamageBonus = data.damagePerHit.bonusMaxValue;

    vm.AngelicPowers.LifeAmount = data.life.totalAmount;
    vm.AngelicPowers.LifeRegenRate = data.life.totalRegen;
    vm.AngelicPowers.LifeReturnChance = data.lifeReturn.procPercentage;
    vm.AngelicPowers.LifePerHit = data.lifeReturn.procAmount;
    vm.AngelicPowers.SpellPowerChance = data.spellPowerBonus.procPercentage;
    vm.AngelicPowers.SpellPowerBonus = data.spellPowerBonus.procAmount;
    vm.AngelicPowers.BuffDuration = data.spellPowerBonus.duration;
    vm.AngelicPowers.StaminaRegenRate = data.stamina.totalRegen;

    vm.DemonicPowers.ResourceAmount = data.resource.totalAmount;
    vm.DemonicPowers.ResourceRegen = data.resource.totalRegen;
    vm.DemonicPowers.ResourceReturnChance = data.resourceReturn.procPercentage;
    vm.DemonicPowers.ResourceReturn = data.resourceReturn.procAmount;
    vm.DemonicPowers.ReduceSpellpowerChance = data.spellPowerReduction.procPercentage;
    vm.DemonicPowers.ReduceSpellDamage = data.spellPowerReduction.procAmount;
    vm.DemonicPowers.DebuffDuration = data.spellPowerReduction.duration;
    vm.DemonicPowers.StaminaReturnChance = data.staminaReturn.procPercentage;
    vm.DemonicPowers.StaminaReturn = data.staminaReturn.procAmount;

    vm.AncestralPowers.StaminaAmount = data.stamina.totalAmount;
    vm.AncestralPowers.DamagePerHitMin = data.damagePerHit.minValue + data.damagePerHit.bonusMinValue;
    vm.AncestralPowers.DamagePerHitMax = data.damagePerHit.maxValue + data.damagePerHit.bonusMaxValue;
    vm.AncestralPowers.StaminaSunder = data.staminaSunder.procAmount;

    return vm;
  }

  private extractSkillDetailsFromResponse(element: any, power:number): ISkillAffixDetail {
    var data = new SkillAffixDetail(null, power);
    data.Level = element.level;
    data.ProcAmount = element.procAmount;
    data.Duration = element.duration;
    data.IsBuff = element.isBuff;
    data.ProcChance = element.procChance;
    data.ProcsOnDeath = element.procsOnDeath;
    data.SelectedAffix = element.selectedAffix;
    data.Stackable = element.stackable;
    data.Description = element.description;
    return data;
  }

  private extractSkillDTOFromResponse(element: any): ISkillDTO {
    var skill = new SkillDTO();
    skill.id = element.id;
    skill.level = element.skillData.level;
    skill.name = element.name;
    skill.tier = element.skillData.tier;
    skill.skillData.powerData = new SkillDetailDTO(element.skillData.powerData);
    skill.skillData.powerUp = new SkillDetailDTO(element.skillData.powerUp);

    // skill.angelicAffix = new SkillPowerDetailDTO();
    // skill.demonicAffix = new SkillPowerDetailDTO();
    // skill.ancestralAffix = new SkillPowerDetailDTO();
    skill.angelicAffix.powerData = this.extractSkillDetailsFromResponse(element.angelicAffix.powerData, 1);
    skill.angelicAffix.powerUp = this.extractSkillDetailsFromResponse(element.angelicAffix.powerUp, 1);
    skill.demonicAffix.powerData = this.extractSkillDetailsFromResponse(element.demonicAffix.powerData, 2);
    skill.demonicAffix.powerUp = this.extractSkillDetailsFromResponse(element.demonicAffix.powerUp, 2);
    skill.ancestralAffix.powerData = this.extractSkillDetailsFromResponse(element.ancestralAffix.powerData, 3);
    skill.ancestralAffix.powerUp = this.extractSkillDetailsFromResponse(element.ancestralAffix.powerUp, 3);
    skill.generatedByGen = element.generatedByGen;
    skill.affixMetadata = element.affixMetadata;
    return skill;
  }
}
