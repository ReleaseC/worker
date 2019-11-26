import { AccountManageUserlistsModule } from './account-manage-userlists.module';

describe('AccountManageUserlistsModule', () => {
  let accountManageUserlistsModule: AccountManageUserlistsModule;

  beforeEach(() => {
    accountManageUserlistsModule = new AccountManageUserlistsModule();
  });

  it('should create an instance', () => {
    expect(accountManageUserlistsModule).toBeTruthy();
  });
});
