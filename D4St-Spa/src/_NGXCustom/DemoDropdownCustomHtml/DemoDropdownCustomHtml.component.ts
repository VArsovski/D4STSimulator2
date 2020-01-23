import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { IDropdownImageItem } from 'src/Models/_Common/IDropdownImageItem';

@Component({
  selector: "app-DemoDropdownCustomHtml",
  templateUrl: "./DemoDropdownCustomHtml.component.html",
  styleUrls: ["./DemoDropdownCustomHtml.component.css"]
})
export class DemoDropdownCustomHtmlComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
  }

  srcBorder: SafeUrl;
  @Input() items: IDropdownImageItem[];
  @Input() caption: string;
  selectedItem: IDropdownImageItem;

  @Output() itemSelectedEvent = new EventEmitter();
  @Output() itemHoveredEvent = new EventEmitter();
  @Output() itemOutEvent = new EventEmitter();
  @Output() itemSelectedEventAsync = new EventEmitter(true);
  @Output() itemHoveredEventAsync = new EventEmitter(true);
  @Output() itemOutEventAsync = new EventEmitter(true);
  placement: string = "right";

  constructor() {
    this.srcBorder = "../_Resources/img/borders/border-1.png";
  }

  ngOnInit() {}
  public async ItemSelected(data: any) {
    var selectedItem = this.getSelectedItem(data);
    this.selectedItem = selectedItem;
    this.itemSelectedEventAsync.emit(selectedItem);
  }
  public async ItemHovered(data: any) {
    this.itemHoveredEventAsync.emit(this.getSelectedItem(data));
  }
  public async ItemOut(data: any) {
    this.itemOutEventAsync.emit(this.getSelectedItem(data));
  }

  private getSelectedItem(data: any): IDropdownImageItem {
    var id = null;
    var classItem = (data.target.classList || [null])[0];
    if (classItem == "menuItemCustom") {
      id = data.target.children[0].id;
    }
    else id = data.target.id;
    id = id.split('---')[1];
    var selectedItem = (this.items.filter(i => i.id == id) || null)[0];
    return selectedItem;
  }
}
