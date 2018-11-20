import { Adresse } from './dataInterfaces/adresse';
import { InfirmierInterface } from './dataInterfaces/infirmier';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CabinetInterface } from './dataInterfaces/cabinet';
import { PatientInterface } from './dataInterfaces/patient';
import { sexeEnum } from './dataInterfaces/sexe';

@Injectable({
  providedIn: 'root'
})
export class CabinetMedicalService {

  private _cabinet: CabinetInterface;

  private _http: HttpClient;
  public get http(): HttpClient {
    return this._http;
  }

  constructor(http: HttpClient) {
    this._http = http;
  }


  async getData(url: string): Promise<CabinetInterface> {
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
      patientsNonAffectés: [],
      adresse: this.getAdressFrom(doc.querySelector("cabinet"))
    };

    const infirmiersXML =  Array.from( doc.querySelectorAll( "infirmiers > infirmier" ) ); //transformer la NodeList en tableau pour le map

    cabinet.infirmiers = infirmiersXML.map( I => ({
      id      : I.getAttribute("id"),
      prénom  : I.querySelector("prénom").textContent,
      nom     : I.querySelector("nom"   ).textContent,
      photo   : I.querySelector("photo" ).textContent,
      adresse : this.getAdressFrom(I),
      patients: []
    }) );



  }

  public getAdressFrom(recup) {

    return {
      ville: recup.querySelector("adresse > ville"),
      codePostal: recup.querySelector("adresse > codePostal"),
      rue: recup.querySelector("adresse > rue"),
      numéro:  recup.querySelector("adresse > numéro"),
      étage: recup.querySelector("adresse > étage")
    }

  }



}
