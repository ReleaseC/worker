import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteSoccerComponent } from './site-soccer.component';

describe('SiteSoccerComponent', () => {
  let component: SiteSoccerComponent;
  let fixture: ComponentFixture<SiteSoccerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteSoccerComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteSoccerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
