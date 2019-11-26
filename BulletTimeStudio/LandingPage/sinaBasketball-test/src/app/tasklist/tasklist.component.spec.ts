
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasklistComponent } from './tasklist.component';

describe('TasklistComponent', () => {
  let component: TasklistComponent;
  let fixture: ComponentFixture<TasklistComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TasklistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
