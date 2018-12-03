import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceReportGuardComponent } from './attendance-report-guard.component';

describe('AttendanceReportGuardComponent', () => {
  let component: AttendanceReportGuardComponent;
  let fixture: ComponentFixture<AttendanceReportGuardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceReportGuardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceReportGuardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
