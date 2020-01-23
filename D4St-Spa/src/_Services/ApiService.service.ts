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

@Injectable({
  providedIn: "root"
})
export class ApiServiceService {
  responseData: BasicStatsDTO;
  VM: BasicStatsVM;
  LevelUpVM: LevelUpStatsVM;
  SkillsVM: SkillListVM;
  baseUrl: string;

  headerDict: any = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
  };

  requestOptions: any = { Headers: new Headers(this.headerDict) };

  constructor(private http: HttpClient) {
    this.baseUrl = "http://localhost:5000/api/";
    this.VM = new BasicStatsVM();
    this.LevelUpVM = new LevelUpStatsVM();
    this.SkillsVM = new SkillListVM();
  }

  getBasicStats = (): Promise<LevelUpStatsVM> => {
    return new Promise((resolve, reject) => {
      var classType = Helpers.getRandom(1, 3);
      this.http
        .get(this.baseUrl + "MainStats/" + classType, this.requestOptions)
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
        .post(this.baseUrl + "MainStats/LevelUp?levels=" + levels, model, this.headerDict)
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
      this.http.post(url, model, this.headerDict)
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
  
  getSkills = (classType: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseUrl + "SkillBar/" + classType, this.requestOptions)
        .pipe(
          map((response: any) => {
            const responseData = response.skills;
            responseData.forEach(element => {
              var skill = new SkillVM();
              skill.id = element.id;
              skill.level = element.skillData.level;
              skill.name = element.name;
              skill.tier = element.skillData.tier;
              skill.skillData.from = element.skillData.from;
              skill.skillData.to = element.skillData.to;
              skill.skillData.cd = element.skillData.cd;
              skill.skillData.cost = element.skillData.cost;
              skill.skillData.charges = element.skillData.charges;
              this.SkillsVM.skills.push(skill);
            });
          })
        )
        .subscribe(() => {
          resolve(this.SkillsVM);
        });
    });
  };

  extractDetailsFromResponse(data: any) {
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
}
