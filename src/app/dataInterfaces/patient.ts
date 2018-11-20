import {sexeEnum} from "./sexe";
import {Adresse} from "./adresse";

export interface PatientInterface {
 prénom: string;
 nom: string;
 sexe: sexeEnum;
 numéroSécuritéSociale: string;
 adresse: Adresse;
}

