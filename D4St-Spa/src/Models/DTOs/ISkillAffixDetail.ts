export interface ISkillAffixDetail {
    // TODO: Remove this and add function that extracts the description here
    Description: string;
    PowerType: number;// PowerTypesEnum
    ProcChance : number;
    Duration : number;
    Amount : number;
    SelectedAffix : string;
    ProcsOnDeath : boolean;
    Stackable : boolean;
    IsBuff : boolean;
}
