import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { TimeService } from '../../../services/time.service';

@Component({
  selector: 'app-select-week',
  templateUrl: './select-week.component.html',
  styleUrls: ['./select-week.component.scss']
})
export class SelectWeekComponent implements OnInit {

  @Input() all: boolean;
  @Input() type: number;
  @Input() formControlSm: boolean;
  @Output() changeEvent = new EventEmitter();
  @Output() clickEvent = new EventEmitter();
  @Output() clickViewEvent = new EventEmitter();
  @Output() clickChartEvent = new EventEmitter();

  arrWeeks: any = [];
  currentVal: number;

  constructor(private commonService: CommonService, 
    private timeService: TimeService) { }

  ngOnInit() {
    console.log('get weeks');
    this.getWeeks();
  }

  getWeeks(){
    for(let i = 1; i <= 52; i++){
      this.arrWeeks.push(i);
    }
    this.currentVal = this.timeService.getWeek(new Date());
    console.log(this.arrWeeks);
  }

  change($event){
    this.changeEvent.emit(this.currentVal);
  }

  click(){
    this.clickEvent.emit(this.currentVal);
  }

  clickView(){
    this.clickViewEvent.emit();
  }

  clickChart(){
    this.clickChartEvent.emit();
  }

}
