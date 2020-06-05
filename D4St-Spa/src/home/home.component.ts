import { Component, OnInit, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiServiceService } from 'src/_Services/ApiService.service';
import { BasicStatsVM } from 'src/Models/BasicStatsVM';
import { SkillListVM } from 'src/Models/SkillListVM';
import { SkillWithImageVM } from 'src/Models/SkillWithImageVM';
import { SkillEquipVM } from 'src/Models/SkillEquipVM';
import { BasicStatDifferencesVM } from 'src/Models/BasicStatDifferencesVM';
import { SkillVM } from 'src/Models/SkillVM';
import { InventoryVM } from 'src/Models/InventoryModels/InventoryVM';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit, OnChanges {
  async ngOnChanges(changes: SimpleChanges) {
    if (changes["skillsModel"]) {
      var updatedChanges = changes["skillsModel"].currentValue;
      await this.initSkillTiers();
    }
  }

  @Input() initializeChildren: boolean;
  @Input() model: BasicStatsVM;
  @Input() levelUpCalculations: BasicStatDifferencesVM<BasicStatsVM>;
  @Input() powerUpCalculations: BasicStatDifferencesVM<BasicStatsVM>;
  @Input() skillsModel: SkillListVM;
  @Input() allSkills: SkillVM[];
  @Output() skillEquipModel: SkillEquipVM;
  @Output() skillTiers: SkillListVM[];
  @Output() inventoryData:InventoryVM;

  constructor(private apiService: ApiServiceService) {
    this.skillTiers = [];
    this.allSkills = [];
    this.levelUpCalculations = new BasicStatDifferencesVM(new BasicStatsVM());
    this.powerUpCalculations = new BasicStatDifferencesVM(new BasicStatsVM());
    this.skillEquipModel = new SkillEquipVM();
  }

  ngOnInit() { this.inventoryData = new InventoryVM(1, 1, 1); }

  async initSkillTiers() {
    var tiersDistinct: any[] = [];
    this.skillsModel.skills.filter(s => s.classId == this.model.BasicData.ClassType).forEach(x => {
      if (tiersDistinct.indexOf(x.tier) == -1) tiersDistinct.push(x.tier);
    });

    tiersDistinct.forEach(element => {
      var data = new SkillListVM();
      data.tier = element;
      this.skillTiers.push(data);
    });

    this.skillsModel.skills.filter(s => s.classId == this.model.BasicData.ClassType).forEach(element => {
      this.skillTiers[(element.tier || element.data.tier) - 1].skills.push(element);
    });
  }

  // ## region CLICK
  public async LevelUpHandler(model: BasicStatsVM) {
    var acknowledgeEmitFn = async (data: BasicStatsVM) => {
      this.model = data;
      // Reset comparison data
      this.powerUpCalculations = new BasicStatDifferencesVM(data, true, true);
    };

    await acknowledgeEmitFn(model);
  }
  public async PowerUpHandler(model: BasicStatsVM) {
    var acknowledgeEmitFn = async (data: BasicStatsVM) => {
      this.model = data;
      // Reset comparison data
      this.levelUpCalculations = new BasicStatDifferencesVM(data, true, true);
    };

    await acknowledgeEmitFn(model);
  }

  //# endregion

  //# region PREVIEW

  public async LevelUpPreviewHandler(data: BasicStatDifferencesVM<BasicStatsVM>) {
    var acknowledgeEmitFn = async (data: BasicStatDifferencesVM<BasicStatsVM>) => {
      this.powerUpCalculations = new BasicStatDifferencesVM<BasicStatsVM>(data.data, data.show);
    };

    await acknowledgeEmitFn(data);
  }

  public async PowerUpPreviewHandler(data: BasicStatDifferencesVM<BasicStatsVM>) {
    var acknowledgeEmitFn = async (data: BasicStatDifferencesVM<BasicStatsVM>) => {
      this.levelUpCalculations = new BasicStatDifferencesVM(data.data, data.show);
    };

    await acknowledgeEmitFn(data);
  }

  //# endregion

  public async EquipSkillHandler(data: SkillWithImageVM) {
    var acknowledgeEmitFn = async (data: SkillWithImageVM) => {
      // MUST CREATE A NEW VARIABLE AND UPDATE THE MODEL, otherwise doesn't count as changed for some reason
      // this.skillEquipModel.skillData = data;
      var tempEquipModel = new SkillEquipVM(data, this.skillEquipModel.position);
      if (tempEquipModel.position < 8) {
        tempEquipModel.position += 1;
      }
      else tempEquipModel.position = 1;
      this.skillEquipModel = tempEquipModel;
    };

    await acknowledgeEmitFn(data);
  }

  public async SkillSelectHandler(data: SkillEquipVM) {
    this.skillEquipModel.position = data.position;
  }

  public async SetInventoryDataHandler(data: InventoryVM) {
    this.inventoryData = data;
  }
}
