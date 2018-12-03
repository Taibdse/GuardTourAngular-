import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GuardService } from '../../../services/guard.service';
@Component({
  selector: 'app-select-guard-list',
  templateUrl: './select-guard-list.component.html',
  styleUrls: ['./select-guard-list.component.scss']
})
export class SelectGuardListComponent implements OnInit {

  @Input() all: boolean;
  @Input() type: number;
  @Input() formControlSm: boolean;
  @Output() changeEvent = new EventEmitter();
  @Output() clickEvent = new EventEmitter();

  arrGuardList: any;
  currentVal: string;

  constructor(private guardService: GuardService) { }

  ngOnInit() {
    this.getGuards();
  }

  change($event){
    // let val = $event.target.value;
    this.changeEvent.emit(this.currentVal);
  }

  click(){
    this.clickEvent.emit(this.currentVal);
  }

  async getGuards(){
    this.arrGuardList = await this.guardService.getGuardsData();
    this.currentVal = this.arrGuardList[0].iGuardId;
    if(this.all) this.currentVal = '0';
  }

}
