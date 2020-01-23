import { SafeUrl, SafeStyle } from '@angular/platform-browser';

export interface IDropdownImageItem {
    id: number;
    name: string;
    detail: string;
    imageUrl: SafeUrl;
    imageStyle: SafeStyle;
}
