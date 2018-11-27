import {Component} from "@angular/core";
import {CabinetMedicalService} from "../cabinet-medical.service";

@Component({
    //moduleId: module.id,
    selector: 'page-patient',
    templateUrl: 'page_patient.component.html',
    styleUrls: ['page_patient.component.css']
})

export class Page_patientComponent {
    constructor(private cabinetMedicalService:CabinetMedicalService){

    }
}