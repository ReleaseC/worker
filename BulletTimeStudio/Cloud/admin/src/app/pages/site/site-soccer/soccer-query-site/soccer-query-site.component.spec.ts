import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoccerQuerySiteComponent } from './soccer-query-site.component';

describe('SoccerQuerySiteComponent', () => {
  let component: SoccerQuerySiteComponent;
  let fixture: ComponentFixture<SoccerQuerySiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoccerQuerySiteComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoccerQuerySiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
