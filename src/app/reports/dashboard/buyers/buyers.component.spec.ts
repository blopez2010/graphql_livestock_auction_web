/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BuyersComponent } from './buyers.component';

describe('BuyersComponent', () => {
  let component: BuyersComponent;
  let fixture: ComponentFixture<BuyersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
