import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ActeTypes} from "../dataInterfaces/acteTypes";
import {Acte} from "../dataInterfaces/acte";

@Injectable()
export class ActesService {

    private serverActesUrl: string = "http://localhost:8090/data/actes.xml";
    typesArray: ActeTypes[];
    actesArray: Acte[];

    constructor(private http: HttpClient){
    }

    async getAll() {
        try {
            let res = await this.http.get(this.serverActesUrl, {observe: 'response', responseType: 'text'}).toPromise();
            //console.log("resolving promise");
            if(res.status === 200){
                const parser = new DOMParser();
                const doc = parser.parseFromString(res.body, 'text/xml');
                //console.log(doc);
                this.typesArray = this.parseTypes(doc);
                this.actesArray = this.parseActes(doc);
                return this.actesArray;
            }else{
                console.error(res);
                return null;
            }
        } catch(err) {
            console.error('ERROR in getAll', err);
            return null;
        }
    }

    async getActesForPatient(acteIdsArray){
        try {
            let res = await this.http.get(this.serverActesUrl, {observe: 'response', responseType: 'text'}).toPromise();
            //console.log("resolving promise");
            if(res.status === 200){
                const parser = new DOMParser();
                const doc = parser.parseFromString(res.body, 'text/xml');
                //console.log(doc);
                this.typesArray = this.parseTypes(doc);
                this.actesArray = this.parseActes(doc);
                return this.actesArray;
            }else{
                console.error(res);
                return [];
            }
        } catch(err) {
            console.error('ERROR in getActesFor', err);
            return [];
        }
        //return this.actesArray.filter( unActe => acteIdsArray.includes(unActe.id));
    }

    async getActesForInfirmier(acteIdsArray){
    }

    private parseTypes(doc: Document):ActeTypes[] {
        const typesXML:Element[] =  <Element[]>Array.from(doc.querySelectorAll("types > type") );
        let typesArray: ActeTypes[] = [];
        typesXML.forEach(function (elt){
            let id = elt.getAttribute("id");
            typesArray[id] = {id: id, text: elt.textContent.toString() };
            }, typesArray);

        return typesArray;
    }

    private parseActes(doc: Document,):Acte[] {
        const actesXML:Element[] =  <Element[]>Array.from(doc.querySelectorAll("actes > acte") );
        let myActesArray: Acte[] = [];

        actesXML.forEach(function(elt){
            let id: string = elt.getAttribute("id");
            this.myActesArray[id] = {
                id      : id,
                type    : this.typesArray[elt.getAttribute("type")],
                key     : elt.getAttribute("clé"),
                coef    : elt.getAttribute("coef"),
                text    : elt.textContent
            }
        }, {myActesArray: myActesArray, typesArray: this.typesArray});
        //console.log(myActesArray);
        return myActesArray;
    }
}