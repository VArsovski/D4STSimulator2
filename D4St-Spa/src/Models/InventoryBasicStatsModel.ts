import { ItemBasicStatsDetail } from './ItemAffixes/Details/ItemBasicStats';
import { ItemBasicPowersDetail } from './ItemAffixes/Details/ItemSimpleStats';
import { BasicStatsEnum } from 'src/_Enums/itemAffixEnums';
import { PowerTypesEnum } from 'src/_Enums/powerTypesEnum';

export class InventoryBasicStatsModel {
    HP:ItemBasicStatsDetail;
    Resource:ItemBasicStatsDetail;
    Stamina:ItemBasicStatsDetail;
    HPRegen:ItemBasicStatsDetail;
    ResourceRegen:ItemBasicStatsDetail;
    StaminaRegen:ItemBasicStatsDetail;
    AngelicPower:ItemBasicPowersDetail;
    DemonicPower:ItemBasicPowersDetail;
    AncestralPower:ItemBasicPowersDetail;

    constructor() {
        this.HP = new ItemBasicStatsDetail(1,0,0, BasicStatsEnum.HP);
        this.Resource = new ItemBasicStatsDetail(1,0,0, BasicStatsEnum.Resource);
        this.Stamina = new ItemBasicStatsDetail(1,0,0, BasicStatsEnum.Stamina);
        this.HPRegen = new ItemBasicStatsDetail(1,0,0, BasicStatsEnum.HP);
        this.ResourceRegen = new ItemBasicStatsDetail(1,0,0, BasicStatsEnum.Resource);
        this.StaminaRegen = new ItemBasicStatsDetail(1,0,0, BasicStatsEnum.Stamina);
        this.AngelicPower = new ItemBasicPowersDetail(1,0,0, PowerTypesEnum.Angelic);
        this.DemonicPower = new ItemBasicPowersDetail(1,0,0, PowerTypesEnum.Demonic);
        this.AncestralPower = new ItemBasicPowersDetail(1,0,0, PowerTypesEnum.Ancestral);
    }
}
