import { Component, OnInit, ViewChild } from '@angular/core';
import { DeviceService } from '../../services/device.service';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-setting-device',
  templateUrl: './setting-device.component.html',
  styleUrls: ['./setting-device.component.scss']
})
export class SettingDeviceComponent implements OnInit {

  @ViewChild('modalInsert') modalInsert;
  @ViewChild('alertError') alertError;
  @ViewChild('alertSuccess') alertSuccess;
  @ViewChild('alertWarning') alertWarning;

  arrDevices: any;
  alertErrorContent: string;
  alertSuccessContent: string;
  alertWarningContent: string;
  currentDevice: any = {}

  currentPage: number = 1;

  constructor(private deviceService: DeviceService, private validationService: ValidationService) { }

  ngOnInit() {
    this.showDevices();
  }

  async showDevices(){
    this.arrDevices = await this.deviceService.getDevice();
  }

  showModalInsertDevice(){
    this.currentDevice = {};
    this.modalInsert.show();
  }

  async insertDevice(){
    let { sDeviceName, sDeviceSerial } = this.currentDevice;
    let { errMsg, valid } = this.checkInsertValid(sDeviceName, sDeviceSerial);
    if(!valid) {
      this.alertErrorContent = errMsg;
      this.alertError.modalError.show();
    }else {
      let sentData = { sDeviceNameIN: sDeviceName, sDeviceSerialIN: sDeviceSerial, iDeviceIDIN: 0, bStatusIN: 1 };
      let res = await this.deviceService.insertDevice(sentData);
      this.modalInsert.hide();
      this.currentDevice = {};
      this.alertSuccessContent = 'Insert Successfully!!';
      this.alertSuccess.modalSuccess.show();
      this.showDevices();
    }
  }

  checkInsertValid(name, serial){
    let errMsg = '';
    let valid = true;
    if(!this.validationService.checkNotEmpty(name)){
      errMsg += 'Name must be defined!!\r\n';
      valid = false;
    }
    if(!this.validationService.checkNotEmpty(serial)){
      errMsg += 'Serial must be defined!!\r\n';
      valid = false;
    }
    return { errMsg, valid };
  }

  showConfirmDelete(device){
    this.currentDevice = Object.assign({}, device);
    this.alertWarningContent = 'Are you sure?';
    this.alertWarning.modalWarning.show();
  }

  async deleteDevice(){
    let { iDeviceID } = this.currentDevice;
    let sentData = { sDeviceNameIN: 0, sDeviceSerialIN: 0, iDeviceIDIN: iDeviceID, bStatusIN: 2 };
    let res = await this.deviceService.lockDevice(sentData);
    this.currentDevice = {};
    this.alertWarning.modalWarning.hide();
    this.alertSuccessContent = 'Delete Successfully!!';
    this.alertSuccess.modalSuccess.show();
    this.showDevices();
  }

}
