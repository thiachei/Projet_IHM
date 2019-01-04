import {Acte} from "./acte";

export interface Visite {
    date:string;
    intervenant:string;
    actes:Acte[];
}