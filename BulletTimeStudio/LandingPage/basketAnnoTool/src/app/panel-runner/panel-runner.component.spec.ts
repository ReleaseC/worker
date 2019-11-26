import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelRunnerComponent } from './panel-runner.component';

describe('PanelComponent', () => {
  let component: PanelRunnerComponent;
  let fixture: ComponentFixture<PanelRunnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelRunnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelRunnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
