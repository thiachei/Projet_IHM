import { Adresse } from './dataInterfaces/adresse';
import { InfirmierInterface } from './dataInterfaces/infirmier';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { CabinetInterface } from './dataInterfaces/cabinet';
import { PatientInterface } from './dataInterfaces/patient';
import { sexeEnum } from './dataInterfaces/sexe';
import {ActesService} from "./actes.service";
import {Acte} from "./dataInterfaces/acte";
import {Visite} from "./dataInterfaces/visite";
import {RequestOptions} from "@angular/http";

@Injectable()

export class CabinetMedicalService {

    private cabinet: CabinetInterface;
    private serverUrl_cabinetInfirmier: string = "http://localhost:8090/data/cabinetInfirmier.xml?responseType=text";
    private serverUrl_addPatient: string = "http://localhost:8090/addPatient";
    private responseObj: { infirmiers: InfirmierInterface[]; patient: PatientInterface};

    constructor(private http: HttpClient, private actesService: ActesService) {
    }

    /*
      async getCabinet(url: string): Promise<any> {
        //get HTTP response as text
        const response = await this.http.get(url, {responseType: 'text'}).toPromise();

        //parse the response with DOMParser
        let parser = new DOMParser();
        let doc = parser.parseFromString(response, "application/xml");

        //if no doc, exit
        if (!doc) return null;

        //default cabinet
        const cabinet: CabinetInterface = {
          infirmiers: [],
          patientsNonAffectes: [],
          adresse: this.getAdressFrom(doc.querySelector("cabinet"))
        };

        const infirmiersXML =  Array.from( doc.querySelectorAll( "infirmiers > infirmier" ) ); //transformer la NodeList en tableau pour le map

        cabinet.infirmiers = infirmiersXML.map( I => ({
          id      : I.getAttribute("id"),
          prenom  : I.querySelector("prénom").textContent,
          nom     : I.querySelector("nom"   ).textContent,
          photo   : I.querySelector("photo" ).textContent,
          adresse : this.getAdressFrom(I),
          patients: []
        }) );



      }
    */

    async getAll():Promise<CabinetInterface>{
        let responseObj: CabinetInterface ={infirmiers: <InfirmierInterface[]>[], patients: <PatientInterface[]>[], adresse: <Adresse>{}, nom: ""};
        try {
            let res = await this.http.get(this.serverUrl_cabinetInfirmier, {observe: 'response', responseType: 'text'}).toPromise();
            //console.log("resolving promise");
            if(res.status === 200){
                const parser = new DOMParser();
                const doc = parser.parseFromString(res.body, 'text/xml');
                responseObj.infirmiers = this.parseInfirmiers(doc);
                responseObj.patients = this.parsePatients(doc);
                responseObj.nom = doc.querySelector("nom").textContent;
                responseObj.adresse = this.parseAdresse(doc);
            }else{
                console.error(res);
            }
        } catch(err) {
            console.error('ERROR in getAll', err);
        }
        return await responseObj;
    }

    async getPatient(numSS: string): Promise<{ infirmiers:InfirmierInterface[], patient: PatientInterface}>{
        this.responseObj = { infirmiers:<InfirmierInterface[]>[], patient: <PatientInterface>{}};
        try {
            let res = await this.http.get(this.serverUrl_cabinetInfirmier, {observe: 'response', responseType: 'text'}).toPromise();
            //console.log("resolving promise");
            if(res.status === 200){
                const parser = new DOMParser();
                const doc = parser.parseFromString(res.body, 'text/xml');
                this.responseObj.infirmiers = await this.parseInfirmiers(doc);
                this.responseObj.patient = await this.parsePatientsFull(doc, numSS);
            }else{
                console.error(res);
            }
        } catch(err) {
            console.error('ERROR in getAll', err);
        }
        return await this.responseObj;
    }

    async setPatientAlt(nom,prenom, genre, dateDeNaissance, numeroSS, rue, numeroBatiment, ville,codePostal, etage){
        let myBody = {
            patientForname:prenom,
            patientName:nom,
            patientSex:genre,
            naissance:dateDeNaissance,
            patientStreet:rue,
            patientNumber:numeroSS,
            patientCity:ville,
            patientPostalCode:codePostal,
            patientStreetNumber:numeroBatiment,
            patientFloor:etage
        };
        let response = await this.http.post(this.serverUrl_addPatient, myBody, {observe: 'response', responseType: 'text'}).toPromise();

        if (response.status ===200 ){
            return true;
        }else{
            console.log("response KO");
            console.error(response);
            return false;
        }
    }

    async setPatient(patient:PatientInterface){
        console.log("cece");
        console.log(patient);

        return await this.setPatientAlt(patient.nom, patient.prenom, patient.sexe, patient.naissance, patient.numeroSecuriteSociale,
            patient.adresse.rue, patient.adresse.numero, patient.adresse.ville, patient.adresse.codePostal, patient.adresse.etage);
    }

    private parseInfirmiers(doc:Document):InfirmierInterface[]{
        const infirmiersXML: Element[] =  <Array<Element>> Array.from( doc.querySelectorAll( "infirmiers > infirmier" ) ); //transformer la NodeList en tableau pour le map

        let myInfirmiersArray: InfirmierInterface[] = [];

        infirmiersXML.forEach(function(elt){
            let id: string = elt.getAttribute("id");
            let unInfirmier=  {
                id      : id,
                prenom  : elt.querySelector("prénom").textContent,
                nom     : elt.querySelector("nom"   ).textContent,
                photo   : elt.querySelector("photo" ).textContent,
                adresse : this.parseAdresse(<any>elt),
                patients: []
            };
            this.myInfirmiersArray.push(unInfirmier);//on ajoute les infirmiers normalement pour avoir acces aux fonction usuelles telles que map() forEach() ou encore length
            this.myInfirmiersArray[id] = {//on ajoute les infirmier indexé par leur "id" aussi pour pouvoir y acceder directement avec infirmierTableau[id]
                id      : id,
                prenom  : elt.querySelector("prénom").textContent,
                nom     : elt.querySelector("nom"   ).textContent,
                photo   : elt.querySelector("photo" ).textContent,
                adresse : this.parseAdresse(<any>elt),
                patients: []
            };
        }, {myInfirmiersArray: myInfirmiersArray, parseAdresse: this.parseAdresse});
        return myInfirmiersArray;


    }

    private parsePatients(document:Document):PatientInterface[]{
        const patientXML: Element[] =  <Array<Element>> Array.from( document.querySelectorAll( "patients > patient" ) ); //transformer la NodeList en tableau pour le map
        //console.log(patientXML);
        return patientXML.map( I => ({
            prenom  : I.querySelector("prénom").textContent,
            nom     : I.querySelector("nom").textContent,
            sexe    : sexeEnum[I.querySelector("sexe").textContent],
            numeroSecuriteSociale : I.querySelector("numéro").textContent,
            naissance: I.querySelector("naissance").textContent,
            adresse : this.parseAdresse(<any>I),
            visites : []
        }) );
    }

    async parsePatientsFull(document:Document, numSS: string){
        const patientXML:Element = Array.from( document.querySelectorAll( "patients > patient > numéro" ) ).find(numeroXLM => numeroXLM.textContent.localeCompare(numSS) === 0).parentElement; //transformer la NodeList en tableau pour le map
        //console.log(patientXML);

        let actesArray: Acte[] = await this.actesService.getAll();

        let visitesXML: Element[] =  <Array<Element>> Array.from( patientXML.getElementsByTagName("visite"));

        let visiteArray: Visite[] = visitesXML.map( elt => {
            //let acteIdsArray = Array.from( <NodeListOf<Element>>elt.querySelectorAll("acte")).map(acteXML => (<Element>acteXML).getAttribute("id") );
            return {
                date  : elt.getAttribute("date")? elt.getAttribute("date"):"pas de date",
                intervenant: elt.getAttribute("intervenant")?this.responseObj.infirmiers[elt.getAttribute("intervenant")]:{nom:"Pas d'intervenant", prenom: ""},
                actes : (<Element[]>Array.from(elt.querySelectorAll("acte"))).map(acteXML => actesArray[acteXML.getAttribute("id")] )
            };
        });

        return {
            prenom  : patientXML.querySelector("prénom").textContent,
            nom     : patientXML.querySelector("nom").textContent,
            sexe    : sexeEnum[patientXML.querySelector("sexe").textContent],
            numeroSecuriteSociale : patientXML.querySelector("numéro").textContent,
            naissance: patientXML.querySelector("naissance").textContent,
            adresse : this.parseAdresse(<any>patientXML),
            visites : visiteArray
        };
    }

    private parseAdresse(document:Document):Adresse {
        const nodeXML =  document.querySelector( "adresse" ) ; //transformer la NodeList en tableau pour le map
        if (nodeXML === null){
            return <Adresse>{ville:"NC",rue:"NC",numero:"NC",etage:"NC",codePostal:0, toString:"" };
        }else{
            let tempNode;
            var monAdresse = <Adresse>{
                ville: (tempNode = nodeXML.querySelector("ville"))===null?"NC":tempNode.textContent,
                codePostal: parseInt((tempNode = nodeXML.querySelector("codePostal"))===null?"0":tempNode.textContent),
                rue: (tempNode = nodeXML.querySelector("rue"))===null?"NC":tempNode.textContent,
                numero: (tempNode = nodeXML.querySelector("numéro"))===null?"NC":tempNode.textContent,
                etage: (tempNode = nodeXML.querySelector("étage"))===null?"NC":tempNode.textContent,
                toString: ""
                //numero+rue+ etage.localCompare("NC")!=0?"(etage)"+etage:""+codePostale+ville
            };
            monAdresse.toString = "".concat(
                monAdresse.numero," ",
                monAdresse.rue," ",
                monAdresse.etage.localeCompare("NC")!==0?"(étage "+monAdresse.etage+") ":" ",
                monAdresse.codePostal.toString()," ",
                monAdresse.ville);
            return monAdresse;
        }
    }



}
