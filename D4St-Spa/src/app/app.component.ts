import { Component, Output, Input, EventEmitter } from '@angular/core';
import { ApiServiceService } from 'src/_Services/ApiService.service';
import { SkillListVM } from 'src/Models/SkillListVM';
import { LevelUpStatsVM } from 'src/Models/LevelUpStatsVM';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  constructor(private apiService: ApiServiceService) {
    this.model = new LevelUpStatsVM();
    this.skillsModel = new SkillListVM();
  }

  title = "D4ST-Spa";
  @Output() model: LevelUpStatsVM;
  @Output() skillsModel: SkillListVM;
  @Output() initializeChildren: boolean;


  async ngOnInit() {
    await this.initCharacter();
  }

  async initCharacter() {
    const result = await this.apiService.getBasicStats(); // as Promise<BasicStatsVM>;
    const initValueFn = async (data: LevelUpStatsVM) => {
        // setTimeout(() => {
        // this.model = data.Current;
        // this.levelUpModel = data.New;
        this.model = data;
        this.getSkills(this.model.Current.BasicData.ClassType);
        this.initializeChildren = true;
      // }, 350);
    };
    await initValueFn(result);
  }

  async getSkills(classType: any) {
    const result = await this.apiService.getSkills(classType); // as Promise<SkillBarVM>;
    const initValueFn = async (data: SkillListVM) => {
      this.skillsModel = data;
    };
    await initValueFn(result);
  }
}
