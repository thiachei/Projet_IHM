import {ActeTypes} from "./acteTypes";

export interface Acte {
    id: string;
    type: ActeTypes;
    key: string;
    coef: string;
    text: string;

}