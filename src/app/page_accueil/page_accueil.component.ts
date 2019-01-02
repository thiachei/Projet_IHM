import {AfterViewChecked, AfterViewInit, Component, Input, OnInit} from "@angular/core";
import {CabinetMedicalService} from "../cabinet-medical.service";
import {InfirmierInterface} from "../dataInterfaces/infirmier";
import {PatientInterface} from "../dataInterfaces/patient";
import {TileService} from "../tile.service";

@Component({
    moduleId: module.id,
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

    constructor(private cabinetMedicalService:CabinetMedicalService, private tileService:TileService){
        //init attributs avec cabinetMedical
        let all = cabinetMedicalService.getAll();
        all.then(data => {
            console.log(data);
            this.infirmiers = data.infirmiers;
            this.patients = data.patients;
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

        });
    }
    ngOnInit(): void {
        this.tileService.showTile(document.getElementById("tile"));
    }

    recherchePersonnes(){
        console.log("Je cherche la personne : "+this.inputRecherche);
        this.contenuTable = this.contenuTableEntier.filter(chaquePersonne => ( chaquePersonne.nom.toUpperCase().includes(this.inputRecherche.toUpperCase()) || chaquePersonne.prenom.toUpperCase().includes(this.inputRecherche.toUpperCase()) ) );
    }

    goTo(unePersonne: any) {
        console.log("redirect to "+unePersonne.prenom);
        //this.router
    }

    trierPar(colone: string) {
        this.contenuTable.sort((a,b) => this.toggle * a[colone].localeCompare(b[colone]));
        this.toggle *= -1;
    }
}