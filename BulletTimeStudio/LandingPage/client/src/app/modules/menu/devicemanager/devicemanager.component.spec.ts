import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicemanagerComponent } from './devicemanager.component';

describe('DevicemanagerComponent', () => {
  let component: DevicemanagerComponent;
  let fixture: ComponentFixture<DevicemanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicemanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicemanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
