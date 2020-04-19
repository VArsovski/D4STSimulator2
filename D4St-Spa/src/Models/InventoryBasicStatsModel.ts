import { PowerTypesEnum } from 'src/_Enums/powerTypesEnum';
import { BasicStatInventoryModel } from './InventoryDetailModels/BasicStatInventoryModel';
import { ItemBasicPowersDetail } from './ItemAffixes/Details/ItemSimpleStats';

export class InventoryBasicStatsModel {
    HP:BasicStatInventoryModel;
    Resource:BasicStatInventoryModel;
    Stamina:BasicStatInventoryModel;
    AngelicPower:ItemBasicPowersDetail;
    DemonicPower:ItemBasicPowersDetail;
    AncestralPower:ItemBasicPowersDetail;

    constructor() {
        this.HP = new BasicStatInventoryModel(0, 0, 0, 0);
        this.Resource = new BasicStatInventoryModel(0, 0, 0, 0);
        this.Stamina = new BasicStatInventoryModel(0, 0, 0, 0);
        this.AngelicPower = new ItemBasicPowersDetail(1,0,0, PowerTypesEnum.Angelic);
        this.DemonicPower = new ItemBasicPowersDetail(1,0,0, PowerTypesEnum.Demonic);
        this.AncestralPower = new ItemBasicPowersDetail(1,0,0, PowerTypesEnum.Ancestral);
    }
}
