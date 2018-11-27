import { Adresse } from './dataInterfaces/adresse';
import { InfirmierInterface } from './dataInterfaces/infirmier';
import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { CabinetInterface } from './dataInterfaces/cabinet';
import { PatientInterface } from './dataInterfaces/patient';
import { sexeEnum } from './dataInterfaces/sexe';

@Injectable()

export class CabinetMedicalService {

  private cabinet: CabinetInterface;
  private serverUrl: string = "http://localhost:8090/data/cabinetInfirmier.xml?responseType=text";

  constructor(private http: HttpClient) {
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
  async getAll(){
      try {
          let res = await this.http.get(this.serverUrl, {observe: 'response', responseType: 'text'}).toPromise();
          //console.log(res);
          if(res.status === 200){
                  let responseObj = { infirmiers:[], patients:[], nom : "", adresse: {} };
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(res.body, 'text/xml');
                  responseObj.infirmiers = this.parseInfirmiers(doc);
                  responseObj.patients = this.parsePatients(doc);
                  responseObj.nom = doc.querySelector("nom").textContent;
                  responseObj.adresse = this.parseAdresse(doc);
                  return responseObj;
          }else{
              console.error(res);
              return [];
          }
      } catch(err) {
          console.error('ERROR in getAll', err);
          return [];
      }

  }

  private parseInfirmiers(doc:Document):InfirmierInterface[]{
      const infirmiersXML:Node[] =  Array.from( doc.querySelectorAll( "infirmiers > infirmier" ) ); //transformer la NodeList en tableau pour le map
      return infirmiersXML.map( I => ({
          id      : I.getAttribute("id"),
          prenom  : I.querySelector("prénom").textContent,
          nom     : I.querySelector("nom"   ).textContent,
          photo   : I.querySelector("photo" ).textContent,
          adresse : this.parseAdresse(I),
          patients: []
      }) );
  }

  private parsePatients(document:Document):PatientInterface[]{
      const patientXML =  Array.from( document.querySelectorAll( "patients > patient" ) ); //transformer la NodeList en tableau pour le map
      //console.log(patientXML);
      return patientXML.map( I => ({
          prenom  : I.querySelector("prénom").textContent,
          nom     : I.querySelector("nom").textContent,
          sexe    : I.querySelector("sexe").textContent,
          numeroSecuriteSociale : I.querySelector("numéro").textContent,
          naissance: I.querySelector("naissance").textContent,
          adresse : this.parseAdresse(I),
          patients: []
      }) );
  }

  private parseAdresse(document:Document):Adresse {
      const nodeXML =  document.querySelector( "adresse" ) ; //transformer la NodeList en tableau pour le map
      if (nodeXML === null){
          return <Adresse>{ville:"NC",rue:"NC",numero:"NC",etage:"NC",codePostal:0 };
      }else{
          let tempNode;
          return <Adresse>{
              ville: (tempNode = nodeXML.querySelector("ville"))===null?"NC":tempNode.textContent,
              codePostal: parseInt((tempNode = nodeXML.querySelector("codePostal"))===null?"0":tempNode.textContent),
              rue: (tempNode = nodeXML.querySelector("rue"))===null?"NC":tempNode.textContent,
              numero: (tempNode = nodeXML.querySelector("numéro"))===null?"NC":tempNode.textContent,
              etage: (tempNode = nodeXML.querySelector("étage"))===null?"NC":tempNode.textContent
          };
      }
  }



}
