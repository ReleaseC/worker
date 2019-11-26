import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BullettimeManageSiteComponent } from './bullettime-manage-site.component';

describe('BullettimeManageSiteComponent', () => {
  let component: BullettimeManageSiteComponent;
  let fixture: ComponentFixture<BullettimeManageSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BullettimeManageSiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BullettimeManageSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
