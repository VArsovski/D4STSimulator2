import { BasicStatsVM } from './BasicStatsVM';

export class LevelUpStatsVM {
    Current: BasicStatsVM;
    New: BasicStatsVM;
    IsMaxxed: boolean;
    NewAngelic: BasicStatsVM;
    NewDemonic: BasicStatsVM;
    NewAncestral: BasicStatsVM;

    constructor(classType:number = 0) {
    this.Current = new BasicStatsVM(classType);
    this.New = new BasicStatsVM();
    this.NewAngelic = new BasicStatsVM();
    this.NewDemonic = new BasicStatsVM();
    this.NewAncestral = new BasicStatsVM();
    }
}
