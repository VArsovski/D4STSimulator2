import { IClassDefinition } from './IClassDefinition';
import { LifeDTO } from './LifeDTO';
import { ResourceDTO } from './ResourceDTO';
import { StaminaDTO } from './StaminaDTO';
import { IDamageHitAffix } from './IDamageHitAffix';
import { IHitProcAffix } from './IHitProcAffix';
import { IMainStatAffix } from './IMainStatAffix';

export class BasicStatsDTO {
    ClassDefinition: IClassDefinition;
    Life: LifeDTO;
    Resource: ResourceDTO;
    Stamina: StaminaDTO;
    DamagePerHit: IDamageHitAffix;

    LifeReturn: IHitProcAffix;
    ResourceReturn: IHitProcAffix;
    StaminaReturn: IHitProcAffix;
    StaminaSunder: IHitProcAffix;
    SpellPowerBonus: IHitProcAffix;
    SpellPowerReduction: IHitProcAffix;

    CCDuration: IMainStatAffix;
    DebuffDuration: IMainStatAffix;

    Multicast: IHitProcAffix;
    Critical: IHitProcAffix;
}
