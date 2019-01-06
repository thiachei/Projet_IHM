import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class AffectationService {

    private serverAffectationsUrl: string = "http://localhost:8090/affectation";

    constructor(private http: HttpClient){
    }

    async affecter(infirmierId, patientId){
        let response = await this.http.post(this.serverAffectationsUrl,{infirmier:infirmierId, patient:patientId}, {observe: 'response', responseType: 'text'}).toPromise();
        return (response.status === 200 );
    }

    async desaffecter(patientId:string){
            let response = await this.http.post(this.serverAffectationsUrl,{infirmier:"none", patient:patientId}, {observe: 'response', responseType: 'text'}).toPromise();
            return (response.status === 200 );
    }

}
