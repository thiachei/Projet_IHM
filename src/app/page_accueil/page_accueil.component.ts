import {AfterViewChecked, AfterViewInit, Component, Input, OnInit} from "@angular/core";
import {CabinetMedicalService} from "../services/cabinet-medical.service";
import {InfirmierInterface} from "../dataInterfaces/infirmier";
import {PatientInterface} from "../dataInterfaces/patient";
import {TileService} from "../services/tile.service";
import {ConstantsService} from "../services/constants.service";

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

    constructor(private cabinetMedicalService:CabinetMedicalService, private tileService:TileService, private constantsService:ConstantsService){
        //init attributs avec cabinetMedical
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
}