import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoccerAddSiteComponent } from './soccer-add-site.component';

describe('SoccerAddSiteComponent', () => {
  let component: SoccerAddSiteComponent;
  let fixture: ComponentFixture<SoccerAddSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoccerAddSiteComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoccerAddSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
