import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ZoneService } from '../../../services/zone.service';
@Component({
  selector: 'app-select-zone-list',
  templateUrl: './select-zone-list.component.html',
  styleUrls: ['./select-zone-list.component.scss']
})
export class SelectZoneListComponent implements OnInit {
  
  @Input() all: boolean;
  @Input() type: number;
  @Input() formControlSm: boolean;
  @Output() changeEvent = new EventEmitter();
  @Output() clickEvent = new EventEmitter();

  arrZoneList: any;
  currentVal: string;
  constructor(private zoneService: ZoneService) { }

  ngOnInit() {
    this.getZoneList()
  }

  change($event){
    this.changeEvent.emit(this.currentVal);
  }

  click(){
    this.clickEvent.emit(this.currentVal);
  }

  async getZoneList(){
    this.arrZoneList = await this.zoneService.getAllZones();
    console.log(this.arrZoneList);
    this.currentVal = '0';
    if(!this.all) this.currentVal = this.arrZoneList[0].iZoneID;
  }

}
