import { IDropdownImageItem } from './IDropdownImageItem';
import { SafeUrl, SafeStyle } from '@angular/platform-browser';

export class DropdownImageItem implements IDropdownImageItem {
    id: number;
    name: string;
    detail: string;
    imageUrl: SafeUrl;
    imageStyle: SafeStyle;

    constructor(id:number, name:string, detail:string, imageUrl: SafeUrl, imageStyle:SafeStyle) {
        this.id = id;
        this.name = name;
        this.detail = detail;
        this.imageUrl = imageUrl;
        this.imageStyle = imageStyle;
    }
}
