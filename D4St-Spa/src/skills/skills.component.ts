import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { SkillVM } from 'src/Models/SkillVM';
import { SkillWithImageVM } from 'src/Models/SkillWithImageVM';
import { SkillAffixDetail } from 'src/Models/DTOs/SkillAffixDetail';
import { SafeUrl } from '@angular/platform-browser';
import { CalculationsHelper } from 'src/_Helpers/CalculationsHelper';
import { SkillPowerDetailDTO } from 'src/Models/DTOs/SkillPowerDetailDTO';
import { SkillDTO } from 'src/Models/DTOs/SkillDTO';
import { ApiServiceService } from 'src/_Services/ApiService.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model']) {
      // debugger;
      // TODO: FIX update of PreviewChanges after LvlUp
      var updatedModel = changes['model'].currentValue;
    }
  }

  @Input() model: SkillWithImageVM;

  previewChanges: SkillDTO;
  @Output() equipSkillEmitter = new EventEmitter<SkillWithImageVM>(true);
  current: SkillAffixDetail;
  // lvlUpCurrent: SkillWithImageVM;
  srcBorder: SafeUrl;

  constructor(private apiService:ApiServiceService) {
    this.model = new SkillWithImageVM(null, null, new SkillVM());
    this.current = new SkillAffixDetail();
    this.srcBorder = "../_Resources/img/borders/border-1.png";
    this.previewChanges = new SkillDTO();

    // Prevent "(Undefined)" type of label appear
    this.previewChanges.skillData.powerData.from = 0;
    this.previewChanges.skillData.powerData.to = 0;
    // this.previewModel = new BasicStatDifferencesVM<SkillWithImageVM>(new SkillWithImageVM());
  }

  ngOnInit() {}

  async LevelUpSkill(data: SkillWithImageVM) {
    var skillData = await this.apiService.LevelUpSkill(data.data);
  }
  async LevelUpPreview() {
    this.previewChanges = CalculationsHelper.calculateSkillDetails(this.model.data, this.model.data);
  }
  async LevelUpCancel() {
    this.previewChanges = new SkillDTO();
    // Prevent "(Undefined)" type of label appear
    this.previewChanges.skillData.powerData.from = 0;
    this.previewChanges.skillData.powerData.to = 0;
  }

  async EquipSkill(data: any) {
    // Just transfer to Home
    this.equipSkillEmitter.emit(data);
  }

  async EmpowerAffix(power: number, levels: number) {
    // TODO: EmpowerAffix
    console.log("TODO: EmpowerAffix");
  }

  async PreviewEmpower(power: number) {
    var selectedAffix = power == 1 ? "angelicAffix" : power == 2 ? "demonicAffix" : "ancestralAffix";
    var model = this.model.data[selectedAffix] as SkillPowerDetailDTO;
    this.current = model.powerData;
    this.model.data[selectedAffix].powerData = model.powerUp;
    this.model.data[selectedAffix].powerData.Description = CalculationsHelper.GetSkillAffixDescription(model.powerUp, model.powerUp.AffixMetadata, power);
  }

  async CancelPreview(power: number) {
    var selectedAffix = power == 1 ? "angelicAffix" : power == 2 ? "demonicAffix" : "ancestralAffix";
    this.model.data[selectedAffix].powerData = this.current;
    var model = this.model.data[selectedAffix] as SkillPowerDetailDTO;
  }
}
