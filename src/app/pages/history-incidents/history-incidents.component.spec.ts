import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryIncidentsComponent } from './history-incidents.component';

describe('HistoryIncidentsComponent', () => {
  let component: HistoryIncidentsComponent;
  let fixture: ComponentFixture<HistoryIncidentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryIncidentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
