import { ManagementSettingModule } from './management-setting.module';

describe('ManagementSettingModule', () => {
  let managementSettingModule: ManagementSettingModule;

  beforeEach(() => {
    managementSettingModule = new ManagementSettingModule();
  });

  it('should create an instance', () => {
    expect(managementSettingModule).toBeTruthy();
  });
});
