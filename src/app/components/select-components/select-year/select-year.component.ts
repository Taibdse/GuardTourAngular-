import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-select-year',
  templateUrl: './select-year.component.html',
  styleUrls: ['./select-year.component.scss']
})
export class SelectYearComponent implements OnInit {
  @Input() all: boolean;
  @Input() type: number;
  @Input() formControlSm: boolean;
  @Output() changeEvent = new EventEmitter();
  @Output() clickEvent = new EventEmitter();

  arrYears: any = [];
  currentVal: number;
  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.getYears();
  }

  getYears(){
    let currentYear = new Date().getFullYear();
    for(let i = 2000; i <= currentYear; i++){
      this.arrYears.push(i);
    }
    this.currentVal = currentYear;
  }

  change($event){
    this.changeEvent.emit(this.currentVal);
  }

  click(){
    this.clickEvent.emit(this.currentVal);
  }

}
