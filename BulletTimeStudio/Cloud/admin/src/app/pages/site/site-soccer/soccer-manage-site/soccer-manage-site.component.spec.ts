import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoccerManageSiteComponent } from './soccer-manage-site.component';

describe('SoccerManageSiteComponent', () => {
  let component: SoccerManageSiteComponent;
  let fixture: ComponentFixture<SoccerManageSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoccerManageSiteComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoccerManageSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
