import { ManagementUpdateModule } from './management-update.module';

describe('ManagementUpdateModule', () => {
  let managementUpdateModule: ManagementUpdateModule;

  beforeEach(() => {
    managementUpdateModule = new ManagementUpdateModule();
  });

  it('should create an instance', () => {
    expect(managementUpdateModule).toBeTruthy();
  });
});
