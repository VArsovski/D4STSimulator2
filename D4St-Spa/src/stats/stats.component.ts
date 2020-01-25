import { Component, Input, EventEmitter, SimpleChanges, OnInit, OnChanges, Output } from '@angular/core';
import { BasicStatsVM } from 'src/Models/BasicStatsVM';
import { ApiServiceService } from '../_Services/ApiService.service';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { BasicStatDifferencesVM } from 'src/Models/BasicStatDifferencesVM';

@Component({
  selector: "app-stats",
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.css"]
})
export class StatsComponent implements OnInit, OnChanges {
  async ngOnChanges(changes: SimpleChanges) {
    if (changes["previewModel"]) {
      var newValue = changes["previewModel"].currentValue;
      var compareModel = newValue.statsData || new BasicStatsVM();
      this.previewChanges = newValue.showData ? CalculationsHelper.calculateChangeDetails(compareModel, this.model) : new BasicStatsVM();
    }
    if (changes["initialized"]) {
      if (changes["initialized"].currentValue)
        await this.LevelUp(0);
    }
    if (changes["model"]) {
      if (changes["model"].currentValue)
      {
        var newData = changes["model"].currentValue;// || {BasicData: new BasicStatsVM()}).BasicData;
        if (!newData)
          newData = new BasicStatsVM();
        var oldData = changes["model"].previousValue;
        if (!oldData)
          oldData = new BasicStatsVM();

          var powerDiff = CalculationsHelper.calculateChangeDetails(newData, oldData);
        if (powerDiff.BasicData.AngelicPower || powerDiff.BasicData.DemonicPower || powerDiff.BasicData.AncestralPower)
        // Powerup happened, update data
        await this.LevelUp(0, false);
      }
    }    
  }
  @Input() model: BasicStatsVM;
  // This is used for Hover Info
  levelUpModel: BasicStatsVM;
  @Input() initialized: boolean;
  @Input() previewModel: BasicStatDifferencesVM;
  previewChanges: BasicStatsVM;
  @Output() levelUpEmitter = new EventEmitter<BasicStatsVM>(true);
  @Output() levelUpPreviewEmitter = new EventEmitter<BasicStatDifferencesVM>(true);
  isMaxxed: boolean;

  constructor(private apiService: ApiServiceService) {
    this.model = new BasicStatsVM();
    this.previewModel = new BasicStatDifferencesVM(new BasicStatsVM());
  }

  async ngOnInit() {
    // await this.LevelUp(0);
    this.initialized = false;
  }

  async LevelUp(levels: number, execute:boolean = true) {
    if (this.initialized) {
      const data = await this.apiService.LevelUp(this.model.BasicData, levels);
      this.model = data.Current;
      this.levelUpModel = data.New;
      this.isMaxxed = data.IsMaxxed;
      if (execute) {
        this.levelUpEmitter.emit(data.Current);
      }
    }
  }

  async LevelUpPreview() {
    this.previewChanges = CalculationsHelper.calculateChangeDetails(this.levelUpModel, this.model);
    this.levelUpPreviewEmitter.emit(new BasicStatDifferencesVM(this.levelUpModel, true));
  }

  async LevelUpPreviewCancel() {
    this.previewChanges = new BasicStatsVM();
    this.levelUpPreviewEmitter.emit(new BasicStatDifferencesVM(this.model, false));
  }
}
