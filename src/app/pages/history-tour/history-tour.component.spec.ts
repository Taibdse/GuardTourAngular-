import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryTourComponent } from './history-tour.component';

describe('HistoryTourComponent', () => {
  let component: HistoryTourComponent;
  let fixture: ComponentFixture<HistoryTourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryTourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
