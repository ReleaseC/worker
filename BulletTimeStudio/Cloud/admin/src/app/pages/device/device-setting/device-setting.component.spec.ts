import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSettingComponent } from './device-setting.component';

describe('DeviceSettingComponent', () => {
  let component: DeviceSettingComponent;
  let fixture: ComponentFixture<DeviceSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceSettingComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
