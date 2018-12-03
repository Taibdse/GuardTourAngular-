import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../services/common.service';
@Component({
  selector: 'app-select-month',
  templateUrl: './select-month.component.html',
  styleUrls: ['./select-month.component.scss']
})
export class SelectMonthComponent implements OnInit {
  @Input() all: boolean;
  @Input() type: number;
  @Input() formControlSm: boolean;
  @Output() changeEvent = new EventEmitter();
  @Output() clickEvent = new EventEmitter();
  @Output() clickViewEvent = new EventEmitter();
  @Output() clickChartEvent = new EventEmitter();

  arrMonths: any;
  currentVal: number;

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.arrMonths = this.commonService.arrMonths;
    this.currentVal = new Date().getMonth() + 1;
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
