import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
import { BasicStatsVM } from 'src/Models/BasicStatsVM';
import { ApiServiceService } from 'src/_Services/ApiService.service';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';

@Component({
  selector: "app-powers",
  templateUrl: "./powers.component.html",
  styleUrls: ["./powers.component.css"]
})
export class PowersComponent implements OnInit, OnChanges {
  async ngOnChanges(changes: SimpleChanges) {
    if (changes["previewModel"]) {
      console.log("Powers preview changed");
      this.previewChanges = CalculationsHelper.calculateChangeDetails(this.previewModel, this.model);
      // Must do this otherwise can't compare again
      var selectedChange = this.previewChanges.BasicData.AngelicPower != 0 ? 1
                        : this.previewChanges.BasicData.DemonicPower != 0 ? 2
                        : this.previewChanges.BasicData.DemonicPower != 0 ? 3
                        : 0;

      this.previewModel = this.getSelectedPreviewModel(selectedChange);
      // this.previewModel.markAsPristine();
    }
    if (changes["previewChanges"]) {
      this.previewChanges = new BasicStatsVM();
    }
    if (changes["initialized"]) {
      if (changes["initialized"].currentValue) await this.PowerUp(0, 0);
    }
  }
  @Input() initialized: boolean = false;
  @Input() model: BasicStatsVM;
  @Input() previewChanges: BasicStatsVM;
  // These 3 are used for Hover Info
  poweredUpModelAng: BasicStatsVM;
  poweredUpModelDem: BasicStatsVM;
  poweredUpModelAnc: BasicStatsVM;
  @Input() previewModel: BasicStatsVM;
  @Output() powerUpEmitter = new EventEmitter<BasicStatsVM>(true);
  @Output() powerUpPreviewEmitter = new EventEmitter<BasicStatsVM>(true);
  @Output() powerUpPreviewCancelEmitter = new EventEmitter<BasicStatsVM>(true);

  constructor(private apiService: ApiServiceService) {}

  async ngOnInit() {
    // Initialize values for poweredUpModels (use for HoverChanges action later on)
    // await this.PowerUp(0, 0);
    this.initialized = false;
  }

  async PowerUp(power: number, levels: number) {
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

        this.powerUpEmitter.emit(this.model);
      }
    }
  }

  async PowerUpPreview(power: number) {
    var data = this.getSelectedPreviewModel(power);
    this.previewChanges = CalculationsHelper.calculateChangeDetails(data, this.model);
    this.powerUpPreviewEmitter.emit(data);
  }

  async PowerUpPreviewCancel() {
    this.previewChanges = new BasicStatsVM();
    this.powerUpPreviewCancelEmitter.emit(new BasicStatsVM());
  }

  private getSelectedPreviewModel(power: number):BasicStatsVM {
    return (power == 1 ? this.poweredUpModelAng : power == 2 ? this.poweredUpModelDem : this.poweredUpModelAnc) || this.model;
  }
}
