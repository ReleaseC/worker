import { AccountManageRegisterModule } from './account-manage-register.module';

describe('AccountManageRegisterModule', () => {
  let accountManageRegisterModule: AccountManageRegisterModule;

  beforeEach(() => {
    accountManageRegisterModule = new AccountManageRegisterModule();
  });

  it('should create an instance', () => {
    expect(accountManageRegisterModule).toBeTruthy();
  });
});
