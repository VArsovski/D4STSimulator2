import { Component, OnInit, Output, Input, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { ApiServiceService } from 'src/_Services/ApiService.service';
import { BasicStatsVM } from 'src/Models/BasicStatsVM';
import { SkillListVM } from 'src/Models/SkillListVM';
import { SkillWithImageVM } from 'src/Models/SkillWithImageVM';
import { SkillEquipVM } from 'src/Models/SkillEquipVM';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit, OnChanges {
  async ngOnChanges(changes: SimpleChanges) {
    if (changes["skillsModel"]) {
      await this.initSkillTiers();
    }
  }

  @Input() initializeChildren: boolean;
  @Input() model: BasicStatsVM;
  @Input() levelUpCalculations: BasicStatsVM;
  @Input() powerUpCalculations: BasicStatsVM;
  @Input() levelUpCalculationsCancel: BasicStatsVM;
  @Input() powerUpCalculationsCancel: BasicStatsVM;
  @Input() skillsModel: SkillListVM;
  @Output() skillEquipModel: SkillEquipVM;
  @Output() skillTiers: SkillListVM[];

  constructor(private apiService: ApiServiceService) {
    this.skillTiers = [];
    this.levelUpCalculations = new BasicStatsVM();
    this.powerUpCalculations = new BasicStatsVM();
    this.skillEquipModel = new SkillEquipVM();
  }

  ngOnInit() {}

  async initSkillTiers() {
    // var tiers: any[] = [];
    // of<SkillVM[]>(this.skillsModel.skills)
    //   .pipe(map((s: SkillVM[]) => s.map(x => x.tier)))
    //   .subscribe(x => tiers.push(x));
    // var tiersArray = tiers[0];
    // of(tiersArray).pipe(
    //   distinct(),
    // )
    // .subscribe(x => { console.log(x); tiersDistinct.push(x)});

    var tiersDistinct: any[] = [];
    this.skillsModel.skills.forEach(x => {
      if (tiersDistinct.indexOf(x.tier) == -1) tiersDistinct.push(x.tier);
    });

    tiersDistinct.forEach(element => {
      var data = new SkillListVM();
      data.tier = element;
      this.skillTiers.push(data);
    });

    this.skillsModel.skills.forEach(element => {
      this.skillTiers[element.tier - 1].skills.push(element);
    });
  }


  //# region CANCEL

  public async LevelUpPreviewCancelHandler() {
    var acknowledgeEmitFn = async (data: BasicStatsVM) => {
      this.powerUpCalculationsCancel = data;
    };

    await acknowledgeEmitFn(new BasicStatsVM());
  }

  public async PowerUpPreviewCancelHandler() {
    var acknowledgeEmitFn = async (data: BasicStatsVM) => {
      this.levelUpCalculationsCancel = data;
    };

    await acknowledgeEmitFn(new BasicStatsVM());
  }

  //# endregion

  // ## region CLICK
  public async LevelUpHandler(model: BasicStatsVM) {
    var acknowledgeEmitFn = async data => {
      this.model = data;
      // Reset comparison data
      this.levelUpCalculationsCancel = new BasicStatsVM();
    };

    await acknowledgeEmitFn(model);
  }
  public async PowerUpHandler(model: BasicStatsVM) {
    var acknowledgeEmitFn = async data => {
      this.model = data;
      // Reset comparison data
      this.powerUpCalculationsCancel = new BasicStatsVM();
    };

    await acknowledgeEmitFn(model);
  }

  //# endregion

  //# region PREVIEW

  public async LevelUpPreviewHandler(data: BasicStatsVM) {
    var acknowledgeEmitFn = async (data: BasicStatsVM) => {
      this.powerUpCalculations = data;
    };

    await acknowledgeEmitFn(data);
  }

  public async PowerUpPreviewHandler(data: BasicStatsVM) {
    var acknowledgeEmitFn = async (data: BasicStatsVM) => {
      this.levelUpCalculations = data;
    };

    await acknowledgeEmitFn(data);
  }

  //# endregion

  public async EquipSkillHandler(data: SkillWithImageVM) {
    var acknowledgeEmitFn = async (data: SkillWithImageVM) => {
      // MUST CREATE A NEW VARIABLE AND UPDATE TEH MODEL, otherwise doesn't count as changed for some reason
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
}
