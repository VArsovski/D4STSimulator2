import { Component, Input, EventEmitter, SimpleChanges, OnInit, OnChanges, Output } from '@angular/core';
import { BasicStatsVM } from 'src/Models/BasicStatsVM';
import { ApiServiceService } from '../_Services/ApiService.service';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';

@Component({
  selector: "app-stats",
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.css"]
})
export class StatsComponent implements OnInit, OnChanges {
  async ngOnChanges(changes: SimpleChanges) {
    if (changes["previewModel"]) {
      this.previewChanges = CalculationsHelper.calculateChangeDetails(this.previewModel, this.model);
      // Must do this otherwise can't compare again
      this.previewModel = this.levelUpModel;
      // this.previewModel.markAsPristine();
    }
    if (changes["previewChanges"]) {
      this.previewChanges = new BasicStatsVM();
    }
    if (changes["initialized"]) {
      if (changes["initialized"].currentValue)
        await this.LevelUp(0);
    }
  }
  @Input() model: BasicStatsVM;
  // This is used for Hover Info
  levelUpModel: BasicStatsVM;
  @Input() initialized: boolean;
  @Input() previewModel: BasicStatsVM;
  @Input() previewChanges: BasicStatsVM;
  @Output() levelUpEmitter = new EventEmitter<BasicStatsVM>(true);
  @Output() levelUpPreviewCancelEmitter = new EventEmitter<BasicStatsVM>(true);
  @Output() levelUpPreviewEmitter = new EventEmitter<BasicStatsVM>(true);
  isMaxxed: boolean;

  constructor(private apiService: ApiServiceService) {
    this.model = new BasicStatsVM();
  }

  async ngOnInit() {
    // await this.LevelUp(0);
    this.initialized = false;
  }

  async LevelUp(levels: number) {
    if (this.initialized) {
      const data = await this.apiService.LevelUp(this.model.BasicData, levels);
      this.model = data.Current;
      this.levelUpModel = data.New;
      this.isMaxxed = data.IsMaxxed;
      this.levelUpEmitter.emit(data.Current);
    }
  }

  async LevelUpPreview() {
    this.previewChanges = CalculationsHelper.calculateChangeDetails(this.levelUpModel, this.model);
    this.levelUpPreviewEmitter.emit(this.levelUpModel);
  }

  async LevelUpPreviewCancel() {
    this.previewChanges = new BasicStatsVM();
    this.levelUpPreviewCancelEmitter.emit(new BasicStatsVM());
  }
}
