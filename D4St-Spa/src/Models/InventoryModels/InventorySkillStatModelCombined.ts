import { SkillVM } from '../SkillVM';

export class InventorySkillStatModelCombined {
    SkillData: InventorySkillStatModel;
    TriggerData: InventorySkillTriggerModel;
    constructor() {
        this.SkillData = new InventorySkillStatModel();
        this.TriggerData = new InventorySkillTriggerModel();
    }
}

export class InventorySkillStatModel {
    Skills: SkillVM[];

    constructor() {
        this.Skills = [];
    }
}

export class InventorySkillTriggerModel {

}
