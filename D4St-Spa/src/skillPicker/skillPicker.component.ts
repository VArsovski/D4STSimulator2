import { Component, OnInit, OnChanges, SimpleChanges, Input, SecurityContext, Output, EventEmitter } from '@angular/core';
import { SkillListVM } from 'src/Models/SkillListVM';
// import { DomSanitizer, SafeStyle } from "@angular/platform-browser";
import { SkillListWithImagesVM } from 'src/Models/SkillListWithImagesVM';
import { SkillVM } from 'src/Models/SkillVM';
import { IDropdownImageItem } from 'src/Models/_Common/IDropdownImageItem';
import { SkillWithImageVM } from 'src/Models/SkillWithImageVM';

@Component({
  selector: "app-skillPicker",
  templateUrl: "./skillPicker.component.html",
  styleUrls: ["./skillPicker.component.css"]
})
export class SkillPickerComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["model"]) {
      var updatedModel = changes["model"].currentValue;
      var imagesModel = new SkillListWithImagesVM(updatedModel);
      imagesModel.skills.forEach(u => { u["detail"] = 'Level ' + u.level; });
      this.skillsPerTier = imagesModel.skills as any;
    }
  }

  @Input() model: SkillListVM;
  @Output() skillsPerTier: IDropdownImageItem[];
  @Output() skillEquippedEmitter = new EventEmitter<SkillWithImageVM>(true);
  caption: string;
  // safeImage: SafeStyle;

  constructor() {
    //private sanitizer: DomSanitizer) {
    this.model = new SkillListVM();
    // this.dropdownModel = new SkillListWithImagesVM(this.model);
    this.caption = "Select a skill";
  }

  ngOnInit() {
    // this.safeImage = this.sanitizer.bypassSecurityTrustStyle(`url(../${this.model.skills[0].imageUrl})`);
  }

  SelectSkill(ss: any) {
    var skillImgVM = new SkillWithImageVM(new SkillVM(ss.id, ss.name, ss.level, ss.tier, ss.skillData, ss.powerData));
    skillImgVM.imageUrl = ss.imageUrl;
    skillImgVM.imageStyle = ss.imageStyle;
    this.model.selectedSkill = skillImgVM;
  }

  public async EquipSkillHandler(data: SkillWithImageVM) {
    // Just transfer the emitted data to Home
    this.skillEquippedEmitter.emit(data);
  }
}
