import {InfirmierInterface} from "./infirmier";
import {PatientInterface} from "./patient";
import {Adresse} from "./adresse";

export interface CabinetInterface {
 infirmiers: InfirmierInterface[];
 patientsNonAffectés: PatientInterface[];
 adresse: Adresse;
}

