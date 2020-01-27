import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { SkillVM } from 'src/Models/SkillVM';
import { SkillWithImageVM } from 'src/Models/SkillWithImageVM';
import { ISkillWithImageDTO } from 'src/Models/DTOs/ISkillWithImageDTO';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model'])
    {
      var updatedModel = changes['model'].currentValue as ISkillWithImageDTO;
      // Update affix details
      this.model = new SkillWithImageVM(updatedModel);
    }
  }
  @Input() model: SkillWithImageVM;
  @Output() equipSkillEmitter = new EventEmitter<SkillWithImageVM>(true);

  constructor() { this.model = new SkillWithImageVM(new SkillVM()) }

  ngOnInit() {}

  async LevelUpSkill(id: number) { }

  async EquipSkill(data: any) {
    // var equippedSkill = data;
    // Just transfer to Home
    this.equipSkillEmitter.emit(data);
  }

  async EmpowerAffix(power: number, levels: number) {
    // TODO: EmpowerAffix
    console.log("TODO: EmpowerAffix");
  }
}
