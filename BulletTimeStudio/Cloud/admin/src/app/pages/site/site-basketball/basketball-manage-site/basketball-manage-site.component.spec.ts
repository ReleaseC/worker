import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketballManageSiteComponent } from './basketball-manage-site.component';

describe('BasketballManageSiteComponent', () => {
  let component: BasketballManageSiteComponent;
  let fixture: ComponentFixture<BasketballManageSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasketballManageSiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketballManageSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
