import { ManagementMatchModule } from './management-match.module';

describe('ManagementMatchModule', () => {
  let managementMatchModule: ManagementMatchModule;

  beforeEach(() => {
    managementMatchModule = new ManagementMatchModule();
  });

  it('should create an instance', () => {
    expect(managementMatchModule).toBeTruthy();
  });
});
