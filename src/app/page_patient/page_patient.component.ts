import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {CabinetMedicalService} from "../cabinet-medical.service";
import {ActivatedRoute, Router} from "@angular/router";
import {InfirmierInterface} from "../dataInterfaces/infirmier";
import {PatientInterface} from "../dataInterfaces/patient";
import {sexeEnum} from "../dataInterfaces/sexe";
import {TileService} from "../tile.service";
import {ActesService} from "../actes.service";
import {CabinetInterface} from "../dataInterfaces/cabinet";

@Component({
    selector: 'page-patient',
    templateUrl: 'page_patient.component.html',
    styleUrls: ['page_patient.component.css']
})

export class Page_patientComponent implements OnInit{
    numeroSS:string;
    infirmiers: InfirmierInterface[];
    patients: PatientInterface[];
    cePatient ;
    cePatientTemp;
    toutesPersonnes: Promise<{ infirmiers: InfirmierInterface[]; patient: PatientInterface}>;
    edit: boolean;
    myGenreEnum;
    genreSelected: string;

    constructor(private cabinetMedicalService:CabinetMedicalService, private route: ActivatedRoute, private router: Router, private tileService: TileService, private actesService:ActesService){
        this.numeroSS = "";
        this.myGenreEnum = sexeEnum;
        this.edit = false;
        this.cePatient = {nom:"",prenom:"",sexe:sexeEnum['A'],numeroSecuriteSociale:"",adresse:{codePostal:0,etage:"",numero:"",rue:"",ville:"",toString:" Pas d'adresse"},naissance:"",visites:[]};
    }

    ngOnInit(){
        this.route.paramMap.subscribe(params => {
            this.numeroSS = params.get("id");
            this.cabinetMedicalService.getPatient(this.numeroSS).then(
                (data) => {
                    this.infirmiers = data.infirmiers;
                    this.cePatient = data.patient;

                    this.cePatientTemp = JSON.parse(JSON.stringify(this.cePatient));
                    this.genreSelected= this.cePatientTemp.sexe.id;
                    this.cePatient.visites.map(uneVisite => uneVisite.show = false);
                },
                error =>{

                    this.router.navigate(['']).then( resp =>{
                        this.tileService.setTile({style: "tile-style-3",content: "Patient non trouvé"});
                    });
                });
        });
    }

    updatePatient() {

        this.edit = false;
        if( this.genreSelected ){
            this.cePatientTemp.sexe = this.myGenreEnum[this.genreSelected];
        }
        this.cePatientTemp.adresse.toString = "".concat(
            this.cePatientTemp.adresse.numero," ",
            this.cePatientTemp.adresse.rue,
            this.cePatientTemp.adresse.etage.localeCompare("NC")!==0?" (étage "+this.cePatientTemp.adresse.etage+"), ":", ",
            this.cePatientTemp.adresse.codePostal.toString()," ",
            this.cePatientTemp.adresse.ville);

        this.cabinetMedicalService.setPatient(this.cePatientTemp).then(success => {
            if (success) {
                this.cePatient = JSON.parse(JSON.stringify(this.cePatientTemp));
                //this.cePatient = this.cePatientTemp;Patient = JSON.parse(JSON.stringify(this.cePatientTemp));
                this.tileService.showTile(  document.getElementById("tile"),{content:"Patient modifié avec succes",style:"tile-style-1"});
            } else {//error
                this.tileService.showTile(  document.getElementById("tile"),{content:"Echec de la modification",style:"tile-style-3"});
                this.cePatientTemp = JSON.parse(JSON.stringify(this.cePatient));
            }
        });
    }

    cancelUpdate() {
        this.edit = false;
        this.cePatientTemp = JSON.parse(JSON.stringify(this.cePatient));
        this.genreSelected = this.cePatientTemp.sexe.id
        this.tileService.showTile(  document.getElementById("tile"),{content:"Patient pas mis à jour",style:"tile-style-2"});
    }
}