import {Injectable} from "@angular/core";

export interface tile{
    style:string;
    content:string;
}

@Injectable()
export class TileService{
    myTile: tile;
    constructor(){
        this.myTile = {style: "tile-style-1", content:""} ;
    }

    setTile(myTile:tile){
        this.myTile = myTile;
    }

    showTile(elt:HTMLElement, tileToShow?:tile){
        if(tileToShow){
            this.myTile = tileToShow;
        }
        if(this.myTile.content){
            elt.textContent = this.myTile.content;
            elt.classList.add();
            elt.className = this.myTile.style;
            setTimeout(function (elt,myTile) {
                elt.classList.add("fade-out", myTile.style);
            },1, elt, this.myTile);
        }
    }

}
