import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {InfirmierInterface} from "../dataInterfaces/infirmier";
import {Adresse} from "../dataInterfaces/adresse";
import {CabinetMedicalService} from "../services/cabinet-medical.service";
import {AffectationService} from "../services/affectation.service";
import {TileService} from "../services/tile.service";
import {PatientInterface} from "../dataInterfaces/patient";

@Component({
    //moduleId: module.id,
    selector: 'page-infirmier',
    templateUrl: 'page_infirmier.component.html',
    styleUrls: ['page_infirmier.component.css']
})

export class Page_infirmierComponent implements OnInit{
    private id: string;
    cetInfirmier:InfirmierInterface;
    patientsArray;
    idPatient: "";
    patientsArrayToShow: PatientInterface[];

    constructor(private cabinetMedicalService:CabinetMedicalService, private route: ActivatedRoute, private affectationService:AffectationService, private tileService:TileService){
        this.patientsArray = [];
        this.patientsArrayToShow = [];
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
                    this.cetInfirmier = data.infirmier;
                    this.patientsArray = data.patients;
                    this.patientsArrayToShow = data.patients.filter(unPatient => {
                        return !this.cetInfirmier.patientsAffectes.includes(unPatient.numeroSecuriteSociale);
                    });
                },
                error => {
                    console.log("error",error);
                }
            );
        });
    }

    async affecterPatient() {
        if(this.patientsArrayToShow.find( unPatient => unPatient.numeroSecuriteSociale.localeCompare(this.idPatient)===0)){
            if (await this.affectationService.affecter(this.id,this.idPatient)){
                this.tileService.showTile(document.getElementById("tile"), {content:"Patient affecté avec succes", style:"tile-style-1"});
            }else {
                this.tileService.showTile(document.getElementById("tile"), {content:"Patient non affecté ", style:"tile-style-3"});
            }
            this.idPatient = "";
        }else {
            this.tileService.showTile(document.getElementById("tile"), {content:"Numéro de Sécurité Social non connu", style:"tile-style-2"});
        }
        this.ngOnInit();
    }

    async desaffecterPatient(patientId: string) {

        if(await this.affectationService.desaffecter(patientId)){
            this.tileService.showTile(document.getElementById("tile"), {content:"Patient désaffecté avec succes", style:"tile-style-1"});
        }else {
            this.tileService.showTile(document.getElementById("tile"), {content:"Patient non désaffecté ", style:"tile-style-3"});
        }
        this.ngOnInit();
    }
}