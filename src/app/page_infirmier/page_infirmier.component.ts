import {Component, OnInit} from "@angular/core";
import {CabinetMedicalService} from "../cabinet-medical.service";
import {ActivatedRoute} from "@angular/router";
import {InfirmierInterface} from "../dataInterfaces/infirmier";
import {Adresse} from "../dataInterfaces/adresse";

@Component({
    //moduleId: module.id,
    selector: 'page-infirmier',
    templateUrl: 'page_infirmier.component.html',
    styleUrls: ['page_infirmier.component.css']
})

export class Page_infirmierComponent implements OnInit{
    private id: string;
    cetInfirmier:InfirmierInterface;

    constructor(private cabinetMedicalService:CabinetMedicalService, private route: ActivatedRoute){
        console.log("infirmier component");
        this.cetInfirmier = <InfirmierInterface>{
            id: "",
            prenom: "",
            nom: "",
            photo: "",
            patientsAffectes: [],
            adresse: {
                toString: ""
            }
        }
    }

    ngOnInit(){
        this.route.paramMap.subscribe(params => {
            this.id = params.get("id");
            this.cabinetMedicalService.getInfirmier(this.id).then(
                data => {
                    console.log("success");
                    console.log(data);
                    this.cetInfirmier = data.infirmier;
                },
                error => {

                    console.log("error",error);
                });

        });
    }
}