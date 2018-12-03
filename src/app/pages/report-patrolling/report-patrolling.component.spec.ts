import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPatrollingComponent } from './report-patrolling.component';

describe('ReportPatrollingComponent', () => {
  let component: ReportPatrollingComponent;
  let fixture: ComponentFixture<ReportPatrollingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPatrollingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPatrollingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
