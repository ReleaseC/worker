import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoccerMatchSiteComponent } from './soccer-match-site.component';

describe('SoccerMatchSiteComponent', () => {
  let component: SoccerMatchSiteComponent;
  let fixture: ComponentFixture<SoccerMatchSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoccerMatchSiteComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoccerMatchSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
