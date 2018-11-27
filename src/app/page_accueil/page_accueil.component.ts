import {Component} from "@angular/core";
import {CabinetMedicalService} from "../cabinet-medical.service";
import {InfirmierInterface} from "../dataInterfaces/infirmier";
import {PatientInterface} from "../dataInterfaces/patient";

@Component({
    //moduleId: module.id,
    selector: 'page-accueil',
    templateUrl: 'page_accueil.component.html',
    styleUrls: ['page_accueil.component.css']
})

export class Page_accueilComponent {
    inputRecherche: string = "";
    infirmiers:InfirmierInterface[] = [];
    patients: PatientInterface[] = [];
    contenuTableEntier = [];
    contenuTable:any[] = [];

    constructor(private cabinetMedicalService:CabinetMedicalService){
        //init attributs avec cabinetMedical
        let all = cabinetMedicalService.getAll();
        all.then(data => {
            console.log(data);
            this.infirmiers = data.infirmiers;
            this.patients = data.patients;
            let tempInfirmiers = this.infirmiers.map(unInfirmier=> {
                unInfirmier["status"] = "Infirmier";
                return unInfirmier;
            } );
            let tempPatients = this.patients.map(unPatient=> {
                unPatient["status"] = "Patient";
                return unPatient;
            } );
            this.contenuTableEntier = tempInfirmiers.concat(<any[]>tempPatients);
            this.contenuTableEntier.sort((a,b) => a.prenom.localeCompare(b.prenom));
            this.contenuTable = this.contenuTableEntier;

        });
    }

    recherchePersonnes(){
        console.log("Je cherche la personne : "+this.inputRecherche);
        this.contenuTable = this.contenuTableEntier.filter(chaquePersonne => ( chaquePersonne.nom.toUpperCase().includes(this.inputRecherche.toUpperCase()) || chaquePersonne.prenom.toUpperCase().includes(this.inputRecherche.toUpperCase()) ) );
    }

    goTo(unePersonne: any) {
        console.log("redirect to "+unePersonne.prenom);
    }
}