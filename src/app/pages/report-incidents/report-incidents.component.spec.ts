import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportIncidentsComponent } from './report-incidents.component';

describe('ReportIncidentsComponent', () => {
  let component: ReportIncidentsComponent;
  let fixture: ComponentFixture<ReportIncidentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportIncidentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
