import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceReportGroupComponent } from './attendance-report-group.component';

describe('AttendanceReportGroupComponent', () => {
  let component: AttendanceReportGroupComponent;
  let fixture: ComponentFixture<AttendanceReportGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceReportGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceReportGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
