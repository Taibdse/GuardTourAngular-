import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DeviceService } from '../../../services/device.service';

@Component({
  selector: 'app-select-device-list',
  templateUrl: './select-device-list.component.html',
  styleUrls: ['./select-device-list.component.scss']
})
export class SelectDeviceListComponent implements OnInit {
  @Input() all: boolean;
  @Input() type: number;
  @Input() formControlSm: boolean;
  @Output() changeEvent = new EventEmitter();
  @Output() clickEvent = new EventEmitter();

  arrDeviceList: any;
  currentVal: string;

  constructor(private deviceService: DeviceService) {
    
  }

  ngOnInit() {
    this.getDeviceList();
  }

  change($event){
    this.changeEvent.emit(this.currentVal);
  }

  click(){
    this.clickEvent.emit(this.currentVal);
  }

  async getDeviceList(){
    this.arrDeviceList = await this.deviceService.getDevicelist();
    console.log(this.arrDeviceList);
    this.currentVal = this.arrDeviceList[0].iDeviceID;
    if(this.all) this.currentVal = '0';
  }

}
