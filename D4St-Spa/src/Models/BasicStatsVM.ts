import { AngelicPowerAffixes } from './AngelicPowerAffixes';
import { DemonicPowerAffixes } from './DemonicPowerAffixes';
import { AncestralPowerAffixes } from './AncestralPowerAffixes';
import { MasteryPowerAffixes } from './CustomPowerAffixes';
import { BasicCharStats } from './BasicCharStats';

export class BasicStatsVM {
    BasicData: BasicCharStats;
    AngelicPowers: AngelicPowerAffixes;
    DemonicPowers: DemonicPowerAffixes;
    AncestralPowers: AncestralPowerAffixes;
    MasteryPowers: MasteryPowerAffixes;

    constructor(classType:number = 0) {
        this.BasicData = new BasicCharStats();
        this.AngelicPowers = new AngelicPowerAffixes();
        this.DemonicPowers = new DemonicPowerAffixes();
        this.AncestralPowers = new AncestralPowerAffixes();
    }
}
