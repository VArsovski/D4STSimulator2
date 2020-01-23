/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DemoDropdownCustomHtmlComponent } from './DemoDropdownCustomHtml.component';

describe('DemoDropdownCustomHtmlComponent', () => {
  let component: DemoDropdownCustomHtmlComponent;
  let fixture: ComponentFixture<DemoDropdownCustomHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoDropdownCustomHtmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoDropdownCustomHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
