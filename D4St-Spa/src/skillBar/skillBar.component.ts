import { Component, OnInit, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import { SkillBarVM } from 'src/Models/SkillBarVM';
// import { DomSanitizer } from '@angular/platform-browser';
import { SkillEquipVM } from 'src/Models/SkillEquipVM';
import { ISkillWithImageDTO } from 'src/Models/DTOs/ISkillWithImageDTO';

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
  srcBorder: string;
  // sanitizer: DomSanitizer;
  messages: string[];

  constructor() {
    this.model = new SkillBarVM();
    this.equippedModel = new SkillEquipVM();
    this.messages = new Array<string>();
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

  EquipSkill(data: SkillEquipVM) {
    (this.model["skill" + data.position] as ISkillWithImageDTO) = data.skillData;
  }
}
