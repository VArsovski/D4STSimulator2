import { BasicStatsVM } from './BasicStatsVM';

export class BasicStatDifferencesVM {
    statsData: BasicStatsVM;
    showData: boolean;
    updateData: boolean;

    constructor(stats: BasicStatsVM, show: boolean = false, update: boolean = false) {
        this.statsData = stats || new BasicStatsVM();
        this.showData = show || false;
        this.updateData = update || false;
    }
}
