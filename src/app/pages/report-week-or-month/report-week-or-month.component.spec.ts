import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportWeekOrMonthComponent } from './report-week-or-month.component';

describe('ReportWeekOrMonthComponent', () => {
  let component: ReportWeekOrMonthComponent;
  let fixture: ComponentFixture<ReportWeekOrMonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportWeekOrMonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportWeekOrMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
