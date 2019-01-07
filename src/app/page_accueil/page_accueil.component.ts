import {AfterViewChecked, AfterViewInit, Component, Input, OnInit} from "@angular/core";
import {CabinetMedicalService} from "../services/cabinet-medical.service";
import {InfirmierInterface} from "../dataInterfaces/infirmier";
import {PatientInterface} from "../dataInterfaces/patient";
import {TileService} from "../services/tile.service";
import {ConstantsService} from "../services/constants.service";
import {Genre, sexeEnum} from "../dataInterfaces/sexe";

@Component({
    selector: 'page-accueil',
    templateUrl: 'page_accueil.component.html',
    styleUrls: ['page_accueil.component.css']
})

export class Page_accueilComponent implements OnInit{
    inputRecherche: string = "";
    infirmiers:InfirmierInterface[] = [];
    patients: PatientInterface[] = [];
    contenuTableEntier = [];
    contenuTable:any[] = [];
    toggle = 1;
    newPatientTemp: PatientInterface;
    private genreSelected = "";
    private myGenreEnum: Genre[] = sexeEnum;

    constructor(private cabinetMedicalService:CabinetMedicalService, private tileService:TileService, private constantsService:ConstantsService){
        //init attributs avec cabinetMedical
        this.newPatientTemp = <PatientInterface>{nom:"",prenom:"", sexe:this.myGenreEnum['A'],numeroSecuriteSociale:"",adresse:{codePostal:0,etage:"",numero:"",rue:"",ville:"",toString:" Pas d'adresse"},naissance:"", visites: []};

        cabinetMedicalService.getAll().then(data => {
            this.infirmiers = data.infirmiers;
            this.patients = data.patients;
            constantsService.hospitalName = data.nom;
            constantsService.hospitalAddress = data.adresse["toString"];

            let tempInfirmiers = this.infirmiers.map(unInfirmier=> {
                unInfirmier["status"] = 'Infirmier';
                unInfirmier["route"] = ["/infirmier",unInfirmier.id];
                return unInfirmier;
            } );
            let tempPatients = this.patients.map(unPatient=> {
                unPatient["status"] = "Patient";
                unPatient["route"] = ["/patient", unPatient.numeroSecuriteSociale];
                return unPatient;
            } );
            this.contenuTableEntier = tempInfirmiers.concat(<any[]>tempPatients);
            this.contenuTableEntier.sort((a,b) => a.prenom.localeCompare(b.prenom));
            this.contenuTable = this.contenuTableEntier;
        }, error => {
            this.tileService.showTile(document.getElementById("tile"),{content:error, style:"tile-style-3"});
        });
    }

    ngOnInit(): void {
        this.cabinetMedicalService.getAll().then(data => {
            this.infirmiers = data.infirmiers;
            this.patients = data.patients;
            this.constantsService.hospitalName = data.nom;
            this.constantsService.hospitalAddress = data.adresse["toString"];

            let tempInfirmiers = this.infirmiers.map(unInfirmier=> {
                unInfirmier["status"] = 'Infirmier';
                unInfirmier["route"] = ["/infirmier",unInfirmier.id];
                return unInfirmier;
            } );
            let tempPatients = this.patients.map(unPatient=> {
                unPatient["status"] = "Patient";
                unPatient["route"] = ["/patient", unPatient.numeroSecuriteSociale];
                return unPatient;
            } );
            this.contenuTableEntier = tempInfirmiers.concat(<any[]>tempPatients);
            this.contenuTableEntier.sort((a,b) => a.prenom.localeCompare(b.prenom));
            this.contenuTable = this.contenuTableEntier;
        }, error => {
            this.tileService.showTile(document.getElementById("tile"),{content:error, style:"tile-style-3"});
        });
        this.tileService.showTile(document.getElementById("tile"));
    }

    recherchePersonnes(){
        console.log("Je cherche la personne : "+this.inputRecherche);
        this.contenuTable = this.contenuTableEntier.filter(chaquePersonne => ( chaquePersonne.nom.toUpperCase().includes(this.inputRecherche.toUpperCase()) || chaquePersonne.prenom.toUpperCase().includes(this.inputRecherche.toUpperCase()) ) );
    }

    trierPar(colone: string) {
        this.contenuTable.sort((a,b) => this.toggle * a[colone].localeCompare(b[colone]));
        this.toggle *= -1;
    }

    //ici tu peut ajouter les methode dont tu as besoin pour le formulaire
    createPatient() {
        this.newPatientTemp.sexe = this.myGenreEnum[this.genreSelected];

        this.newPatientTemp.adresse.toString = "".concat(
            this.newPatientTemp.adresse.numero," ",
            this.newPatientTemp.adresse.rue,
            this.newPatientTemp.adresse.etage.localeCompare("NC")!==0?" (étage "+this.newPatientTemp.adresse.etage+"), ":", ",
            this.newPatientTemp.adresse.codePostal.toString()," ",
            this.newPatientTemp.adresse.ville);

        this.cabinetMedicalService.setPatient(this.newPatientTemp).then(success => {
            if (success) {
                this.newPatientTemp = <PatientInterface>{nom:"",prenom:"", sexe:this.myGenreEnum['A'],numeroSecuriteSociale:"",adresse:{codePostal:0,etage:"",numero:"",rue:"",ville:"",toString:" Pas d'adresse"},naissance:"", visites: []};
                this.tileService.showTile(  document.getElementById("tile"),{content:"Patient créé avec succes",style:"tile-style-1"});
                this.ngOnInit();
            } else {//error
                this.tileService.showTile(  document.getElementById("tile"),{content:"Echec de la création",style:"tile-style-3"});
            }
        });
        this.cabinetMedicalService.setPatient(<PatientInterface>this.newPatientTemp);
    }
}