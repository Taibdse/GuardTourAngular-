import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectWeekComponent } from './select-week.component';

describe('SelectWeekComponent', () => {
  let component: SelectWeekComponent;
  let fixture: ComponentFixture<SelectWeekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectWeekComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
