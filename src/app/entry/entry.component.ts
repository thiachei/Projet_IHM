import {Component} from '@angular/core';
import {ConstantsService} from "../services/constants.service";

@Component({
    //moduleId:     module.id,
    selector:    'entry-component',
    templateUrl: 'entry.component.html'
})
export default class EntryComponent {
    constantsService;
    constructor(constantsService:ConstantsService){
        this.constantsService = constantsService;
    }
}
