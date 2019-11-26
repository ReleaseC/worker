import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeshootComponent } from './makeshoot.component';

describe('MakeshootComponent', () => {
  let component: MakeshootComponent;
  let fixture: ComponentFixture<MakeshootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeshootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeshootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
