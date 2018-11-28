import {Component, OnInit} from "@angular/core";
import {CabinetMedicalService} from "../cabinet-medical.service";
import {ActivatedRoute, Router} from "@angular/router";
import {InfirmierInterface} from "../dataInterfaces/infirmier";
import {PatientInterface} from "../dataInterfaces/patient";
import {sexeEnum} from "../dataInterfaces/sexe";

@Component({
    //moduleId: module.id,
    selector: 'page-patient',
    templateUrl: 'page_patient.component.html',
    styleUrls: ['page_patient.component.css']
})

export class Page_patientComponent implements OnInit{
    numeroSS:string;
    infirmiers: InfirmierInterface[];
    patients: PatientInterface[];
    cePatient: PatientInterface;
    toutesPersonnes: Promise;

    constructor(private cabinetMedicalService:CabinetMedicalService, private route: ActivatedRoute, private router: Router){
        this.numeroSS = "";
        this.cePatient = <PatientInterface>{nom:"",prenom:"",sexe:sexeEnum.M,numeroSecuriteSociale:"",adresse:{codePostal:0,etage:"",numero:"",rue:"",ville:"",toString:" Pas d'adresse"},naissance:""};
        this.toutesPersonnes = cabinetMedicalService.getAll();
        this.toutesPersonnes.then(data => {
            console.log(data);
            this.infirmiers = data.infirmiers;
            this.patients = data.patients;
        });
    }

    ngOnInit(){
        this.route.paramMap.subscribe(params => {
            if(params.has('id')){
                console.log("params");
                console.log(params.get("id"));
                this.numeroSS = params.get("id");
                Promise.all([this.toutesPersonnes]).then(data=>{
                    this.cePatient = this.patients.find(unPatient => unPatient.numeroSecuriteSociale.localeCompare(this.numeroSS)===0);
                    console.log(this.cePatient);
                });
            }else{
                this.router.navigate(['/']);
            }
        });
    }

}