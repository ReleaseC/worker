import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteBullettimeComponent } from './site-bullettime.component';

describe('SiteBullettimeComponent', () => {
  let component: SiteBullettimeComponent;
  let fixture: ComponentFixture<SiteBullettimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteBullettimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteBullettimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
