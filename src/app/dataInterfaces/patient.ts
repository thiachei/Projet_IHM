import {Adresse} from "./adresse";
import {Visite} from "./visite";
import {Genre} from "./sexe";



export interface PatientInterface {
    prenom: string;
    nom: string;
    sexe: Genre;
    numeroSecuriteSociale: string;
    naissance: string;
    adresse: Adresse;
    visites: Visite[];
}