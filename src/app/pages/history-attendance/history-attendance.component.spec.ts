import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryAttendanceComponent } from './history-attendance.component';

describe('HistoryAttendanceComponent', () => {
  let component: HistoryAttendanceComponent;
  let fixture: ComponentFixture<HistoryAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
