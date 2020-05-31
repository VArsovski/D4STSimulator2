export class BasicCharStats {
    Level: number;
    TotalPower: number;
    UnassignedPower: number;
    AngelicPower: number;
    DemonicPower: number;
    AncestralPower: number;
    ClassType: number;
    ClassTypeStr: string;
    ClassDescription:string;
    MinDamage: number;
    MaxDamage: number;
    MinDamageBonus: number;
    MaxDamageBonus: number;
    GiftsTotal: number;
    GiftsLeft: number;

    constructor(classType:number = 0) {
        // Initialize character level to 1
        // this.Level = 1;
        if (classType != 0)
            this.ClassType = classType;
    }
}
