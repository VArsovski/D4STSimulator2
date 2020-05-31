import { Component, Input, SimpleChanges } from '@angular/core';
import { TooltipConfig } from 'ngx-bootstrap';
import { SafeStyle } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';

export function getAlertConfig(): TooltipConfig {
  return Object.assign(new TooltipConfig(), {
    placement: 'right',
    container: 'body',
    delay: 500
  });
}

@Component({
  selector: 'app-CustomCompareTooltip',
  templateUrl: './CustomCompareTooltip.component.html',
  providers: [{ provide: TooltipConfig, useFactory: getAlertConfig }],
  styles: [
    `
      ::ng-deep .tooltip .tooltip-inner {
        max-width: 31rem;
        min-width: 17rem;
        opacity: 0.7;
        font-weight:bold;
        /* text-align:left; */
      }
      :host >>> .tooltip-inner {
        color: #fff;
        cursor:pointer;
      }
      :host >>> .tooltip.top .tooltip-arrow:before,
      :host >>> .tooltip.top .tooltip-arrow {
        border-top-color: #009688;
        cursor:pointer;
        width:30rem;
      }
    `]
})
export class CustomCompareTooltipComponent {
  @Input() text:string;
  @Input() html:string;
  @Input() class:string;
  @Input() classText:string;
  @Input() classLabel:string;
  @Input() contentTitle:string;
  @Input() classButton:string;
  @Input() width:string;
  @Input() height:string;
  @Input() maxwidth:string;
  @Input() contentImg:string;
  @Input() contentLabel:string;
  @Input() style:SafeStyle;

  constructor(private sanitizer: DomSanitizer) { }

  transformStyleToSafe(htmlTextWithStyle) {
    return this.sanitizer.bypassSecurityTrustStyle(htmlTextWithStyle);
  }
  
  ngOnInit(): void {
    // //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // //Add 'implements OnInit' to the class.
    // if (!this.class)
    //   this.class = 'h4';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text']) {
      this.html = `<span>` + changes['text'].currentValue + `</span>`;
    }
    // if (changes['classText']) {
    //   this.html = `<span classs="` + changes['classText'].currentValue + `">` + changes['text'].currentValue + `</span>`;
    // }
    if (changes['style']) {
      this.style = this.transformStyleToSafe(//"style=\"" + 
        changes['style'].currentValue// + "\"");
      );
    }
  }
}
