import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceReportDeviceComponent } from './attendance-report-device.component';

describe('AttendanceReportDeviceComponent', () => {
  let component: AttendanceReportDeviceComponent;
  let fixture: ComponentFixture<AttendanceReportDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceReportDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceReportDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
