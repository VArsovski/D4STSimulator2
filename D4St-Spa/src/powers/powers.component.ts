import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
import { BasicStatsVM } from 'src/Models/BasicStatsVM';
import { ApiServiceService } from 'src/_Services/ApiService.service';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { BasicStatDifferencesVM } from 'src/Models/BasicStatDifferencesVM';

@Component({
  selector: "app-powers",
  templateUrl: "./powers.component.html",
  styleUrls: ["./powers.component.css"]
})
export class PowersComponent implements OnInit, OnChanges {
  async ngOnChanges(changes: SimpleChanges) {
    if (changes["previewModel"]) {
      var newValue = changes["previewModel"].currentValue as BasicStatDifferencesVM<BasicStatsVM>;
      this.previewChanges = newValue.data ? CalculationsHelper.calculateChangeDetails(this.previewModel.data, this.model) : new BasicStatsVM();
    }
    if (changes["initialized"]) {
      if (changes["initialized"].currentValue) await this.PowerUp(0, 0);
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

          if (newData.BasicData.Level != oldData.BasicData.Level)
          // LevelUp, update models fit new data
          await this.PowerUp(0, 0, false);
      }
    }
  }

  @Input() initialized: boolean = false;
  @Input() model: BasicStatsVM;
  previewChanges: BasicStatsVM;
  // These 3 are used for Hover Info
  poweredUpModelAng: BasicStatsVM;
  poweredUpModelDem: BasicStatsVM;
  poweredUpModelAnc: BasicStatsVM;
  @Input() previewModel: BasicStatDifferencesVM<BasicStatsVM>;
  @Output() powerUpEmitter = new EventEmitter<BasicStatsVM>(true);
  @Output() powerUpPreviewEmitter = new EventEmitter<BasicStatDifferencesVM<BasicStatsVM>>(true);

  constructor(private apiService: ApiServiceService) {}

  async ngOnInit() {
    // Initialize values for poweredUpModels (use for HoverChanges action later on)
    // await this.PowerUp(0, 0);
    this.initialized = false;
  }

  async PowerUp(power: number, levels: number, execute:boolean = true) {
    var availablePowers = this.model.BasicData.UnassignedPower;
    if (this.initialized) {
      if (availablePowers != 0) {
        var data = await this.apiService.PowerUp(this.model.BasicData, power, levels);
        // this.oldModel = data.Current; // In case of need for reverse
        this.model = data.New;
        // this.previewModel = this.calculateChangeDetails(this.model, data.Current);

        // These 3 are used for Hover Info
        this.poweredUpModelAng = data.NewAngelic;
        this.poweredUpModelDem = data.NewDemonic;
        this.poweredUpModelAnc = data.NewAncestral;
        this.previewModel = power == 1 ? data.NewAngelic : power == 2 ? data.NewDemonic : power == 3 ? data.NewAncestral : this.model;

        if (execute) {
          this.powerUpEmitter.emit(this.model);
        }
      }
    }
  }

  async PowerUpPreview(power: number) {
    var data = this.getSelectedPreviewModel(power);
    this.previewChanges = CalculationsHelper.calculateChangeDetails(data, this.model);
    var dataToEmit = new BasicStatDifferencesVM(data, true);
    this.powerUpPreviewEmitter.emit(dataToEmit);
  }

  async PowerUpPreviewCancel() {
    var dataToEmit = new BasicStatDifferencesVM(this.model, false);
    this.previewChanges = new BasicStatsVM();
    this.powerUpPreviewEmitter.emit(dataToEmit);
  }

  private getSelectedPreviewModel(power: number):BasicStatsVM {
    return (power == 1 ? this.poweredUpModelAng : power == 2 ? this.poweredUpModelDem : this.poweredUpModelAnc) || this.model;
  }
}
