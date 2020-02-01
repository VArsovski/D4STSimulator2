import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { SkillBarVM } from 'src/Models/SkillBarVM';
// import { DomSanitizer } from '@angular/platform-browser';
import { SkillEquipVM } from 'src/Models/SkillEquipVM';
import { ISkillWithImageDTO } from 'src/Models/DTOs/ISkillWithImageDTO';
import { SafeUrl, SafeStyle } from '@angular/platform-browser';
import { SkillWithImageVM } from 'src/Models/SkillWithImageVM';

@Component({
  selector: "app-skillBar",
  templateUrl: "./skillBar.component.html",
  styleUrls: ["./skillBar.component.css"]
})
export class SkillBarComponent implements OnInit, OnChanges {
  async ngOnChanges(changes: SimpleChanges) {
    if (changes["equippedModel"]) {
      var updatedData = changes["equippedModel"].currentValue;
      this.EquipSkill(updatedData);
    }
  }

  @Input() equippedModel: SkillEquipVM;
  @Output() model: SkillBarVM;
  currentSkillImage: SafeUrl;
  currentSkillStyle: SafeStyle;
  @Output() selectEquipEmitter = new EventEmitter<SkillEquipVM>(true);
  srcBorder: string;
  skillClass:string = "sizeBar skillBar purpleGlowHover";
  skillSelectedClass:string = "sizeBar skillBar purpleGlowHoverActive";
  // sanitizer: DomSanitizer;

  constructor() {
    this.model = new SkillBarVM();
    this.equippedModel = new SkillEquipVM();
    this.srcBorder = "../_Resources/img/borders/border-1.png";
  }

  async ngOnInit() {
    this.model.skill1.imageUrl = this.srcBorder;
    this.model.skill2.imageUrl = this.srcBorder;
    this.model.skill3.imageUrl = this.srcBorder;
    this.model.skill4.imageUrl = this.srcBorder;
    this.model.skill5.imageUrl = this.srcBorder;
    this.model.skill6.imageUrl = this.srcBorder;
    this.model.skill7.imageUrl = this.srcBorder;
    this.model.skill8.imageUrl = this.srcBorder;
  }

  async SelectEquip(data: any) {
    // Change current image to empty, and the whole model an empty skill in general
    // this.equippedModel = new SkillEquipVM(new SkillWithImageVM(new SkillVM()), position);
    // this.equippedModel.skillData.imageUrl = this.srcBorder;

    var position = parseInt(data.target.id.split("---")[1]|| "1") - 1;
    if (this.model.positionSelected == -1)
    {
      // No skill selected for change, set to current position
      this.model.positionSelected = position;

      // Save current
      var selectedItem = (this.model["skill" + position] as SkillWithImageVM);
      var dataToSend = new SkillEquipVM(selectedItem, position);
      // Remember old image data in case of cancel
      this.currentSkillImage = dataToSend.skillData.imageUrl;
      this.currentSkillStyle = dataToSend.skillData.imageStyle;

      // Emit data to SkillPicker
      this.selectEquipEmitter.emit(dataToSend);  
    }
    else {
      // Skill already selected, unselect
      this.model.positionSelected = -1;

      (this.model["skill" + position] as ISkillWithImageDTO).imageUrl = this.currentSkillImage;
      (this.model["skill" + position] as ISkillWithImageDTO).imageStyle = this.currentSkillStyle;
    }
  }

  async EquipSkill(data: SkillEquipVM) {
    (this.model["skill" + data.position] as SkillWithImageVM) = data.skillData;
    this.model.positionSelected = -1
  }
}
