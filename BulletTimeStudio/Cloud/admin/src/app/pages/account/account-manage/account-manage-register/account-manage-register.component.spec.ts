import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManageRegisterComponent } from './account-manage-register.component';

describe('AccountManageRegisterComponent', () => {
  let component: AccountManageRegisterComponent;
  let fixture: ComponentFixture<AccountManageRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountManageRegisterComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountManageRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
