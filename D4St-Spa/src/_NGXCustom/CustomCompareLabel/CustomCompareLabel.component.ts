import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-CustomCompareLabel',
  templateUrl: './CustomCompareLabel.component.html',
  styleUrls: ['./CustomCompareLabel.component.css']
})
export class CustomCompareLabelComponent<T> implements OnInit {

  constructor() { }

  @Input() data: T;
  @Input() newData: T;
  previewChanges: T;
  differences: Array<T>;
  messages: string[];

  @Output() displayEventEmitter = new EventEmitter<T>(true);
  @Output() cancelEventEmitter = new EventEmitter<T>(true);
  @Output() applyEventEmitter = new EventEmitter<T>(true);
  @Input() comparisonFunction: (dest: any, src:any) => any;

  ngOnInit() { this.messages = new Array<string>(); }

  public async DisplayChanges(htmlTemplate:string = null, placeholderL:string = null, placeholderR:string = null) {
    var differences = this.comparisonFunction(this.newData, this.data);
    differences.forEach((diff: string) => {
      var diffParsed = JSON.parse(diff);
      Object.keys(diffParsed).forEach(key => {
        var diffStr = (htmlTemplate != null && placeholderL != null && placeholderR != null)
            ? htmlTemplate.replace(placeholderL + key + placeholderR, diff[key]) : diff[key];
        this.messages.push(diffStr);
      });
    });
    this.displayEventEmitter.emit(differences);
  }

  public async ClearChanges<T>() {
    this.messages = new Array<string>();
    this.displayEventEmitter.emit();
  }
  public async CancelChanges() {
    this.differences = new Array<T>();
    this.messages = new Array<string>();
    this.displayEventEmitter.emit(this.comparisonFunction(this.newData, this.data));
  }
  public async ApplyChanges() {
    var data = this.data;
    this.data = this.newData;
    this.displayEventEmitter.emit(this.comparisonFunction(this.newData, data));
  }
}
