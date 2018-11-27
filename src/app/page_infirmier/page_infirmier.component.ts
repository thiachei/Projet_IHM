import {Component} from "@angular/core";
import {CabinetMedicalService} from "../cabinet-medical.service";

@Component({
    //moduleId: module.id,
    selector: 'page-infirmier',
    templateUrl: 'page_infirmier.component.html',
    styleUrls: ['page_infirmier.component.css']
})

export class Page_infirmierComponent {
    constructor(private cabinetMedicalService:CabinetMedicalService){

    }
}