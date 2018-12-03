import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IncidentService } from '../../../services/incident.service';
@Component({
  selector: 'app-select-incident-list',
  templateUrl: './select-incident-list.component.html',
  styleUrls: ['./select-incident-list.component.scss']
})
export class SelectIncidentListComponent implements OnInit {

  @Input() all: boolean;
  @Input() type: number;
  @Input() formControlSm: boolean;
  @Output() changeEvent = new EventEmitter();
  @Output() clickEvent = new EventEmitter();

  arrIncidentList: any;
  currentVal: string;

  constructor(private incidentService: IncidentService) { }

  ngOnInit() {
    this.getIncidents();
  }

  change($event){
    this.changeEvent.emit(this.currentVal);
  }

  click(){
    this.clickEvent.emit(this.currentVal);
  }

  async getIncidents(){
    this.arrIncidentList = await this.incidentService.getIncidentContent();
    console.log(this.arrIncidentList);
    this.currentVal = this.arrIncidentList[0].iGuardId;
    if(this.all) this.currentVal = '0';
  }



}
