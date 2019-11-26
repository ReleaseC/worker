import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementMatchComponent } from './management-match.component';

describe('ManagementMatchComponent', () => {
  let component: ManagementMatchComponent;
  let fixture: ComponentFixture<ManagementMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementMatchComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
