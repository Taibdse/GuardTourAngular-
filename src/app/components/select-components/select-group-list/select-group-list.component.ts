import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GuardGroupService } from '../../../services/guard-group.service';
@Component({
  selector: 'app-select-group-list',
  templateUrl: './select-group-list.component.html',
  styleUrls: ['./select-group-list.component.scss']
})

export class SelectGroupListComponent implements OnInit {
  
  @Input() all: boolean;
  @Input() type: number;
  @Input() formControlSm: boolean;
  @Output() changeEvent = new EventEmitter();
  @Output() clickEvent = new EventEmitter();

  arrGroupList: any;
  currentVal: string;

  constructor(private guardGroupService: GuardGroupService) { }

  ngOnInit() {
    this.getGroups();
  }

  change($event){
    this.changeEvent.emit(this.currentVal);
  }

  click(){
    this.clickEvent.emit(this.currentVal);
  }

  async getGroups(){
    this.arrGroupList = await this.guardGroupService.getGroupData();
    console.log(this.arrGroupList);
    this.currentVal = this.arrGroupList[0].iGuardGroupID;
    if(this.all) this.currentVal = '0';
  }

}
