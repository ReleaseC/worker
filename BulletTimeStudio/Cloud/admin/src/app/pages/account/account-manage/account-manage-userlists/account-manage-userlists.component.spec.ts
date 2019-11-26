import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManageUserlistsComponent } from './account-manage-userlists.component';

describe('AccountManageUserlistsComponent', () => {
  let component: AccountManageUserlistsComponent;
  let fixture: ComponentFixture<AccountManageUserlistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountManageUserlistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountManageUserlistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
