import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {CabinetMedicalService} from "../cabinet-medical.service";
import {ActivatedRoute, Router} from "@angular/router";
import {InfirmierInterface} from "../dataInterfaces/infirmier";
import {PatientInterface} from "../dataInterfaces/patient";
import {sexeEnum} from "../dataInterfaces/sexe";
import {TileService} from "../tile.service";
import {ActesService} from "../actes.service";

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
    cePatient ;
    cePatientTemp:PatientInterface;
    toutesPersonnes: Promise;
    edit: boolean;

    constructor(private cabinetMedicalService:CabinetMedicalService, private route: ActivatedRoute, private router: Router, private tileService: TileService, private actesService:ActesService){
        this.numeroSS = "";
        this.edit = false;
        this.cePatient = {nom:"",prenom:"",sexe:sexeEnum.A,numeroSecuriteSociale:"",adresse:{codePostal:0,etage:"",numero:"",rue:"",ville:"",toString:" Pas d'adresse"},naissance:"",visites:[]};
    }

    ngOnInit(){
        this.route.paramMap.subscribe(params => {
            this.numeroSS = params.get("id");
            this.toutesPersonnes = this.cabinetMedicalService.getPatient(this.numeroSS);
            this.toutesPersonnes.then(data => {
                //console.log(data);
                this.infirmiers = data.infirmiers;
                this.cePatient = data.patient;
                this.cePatientTemp = this.cePatient;
                this.cePatient.visites.map(uneVisite => uneVisite.show = false);

                if (this.cePatient === undefined){
                    this.router.navigate(['']).then( resp =>{
                        this.tileService.setTile({style: "tile-style-2",content: "Patient non trouvé"});
                    });
                }

            });
        });
    }

    toggle_actes(visite){

    }

    updatePatient() {
        this.cePatientTemp.nom = "Aire";
        console.log("toto1");
        console.log(this.cePatientTemp);

        this.cabinetMedicalService.setPatient(this.cePatientTemp).then(success => success?this.cePatient = this.cePatientTemp:this.cePatientTemp = this.cePatient);
    }
}