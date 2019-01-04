import {sexeEnum} from "./sexe";
import {Adresse} from "./adresse";
import {Visite} from "./visite";

export interface PatientInterface {
 prenom: string;
 nom: string;
 sexe: sexeEnum;
 numeroSecuriteSociale: string;
 naissance: string;
 adresse: Adresse;
 visites: Visite[];
}