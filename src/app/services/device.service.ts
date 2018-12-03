import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DeviceService {

  appDomain: string;

  constructor(private commonService: CommonService, 
    private httpClient: HttpClient) { 
    this.appDomain = this.commonService.APP_DOMAIN;
  }

  async getDevice() {
    let url = `${this.appDomain}api/GetDevice.php`;
    let body = null;
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getDevicelist() {
    let url = `${this.appDomain}api/getDevicelist.php`;
    let body = null;
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getEventHistoryDevice(sentData) {
    let url = `${this.appDomain}api/GetEventHistoryDevice.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async updateDevice(sentData) {
    let url = `${this.appDomain}api/UpdateDevice.php`;
    let body = JSON.stringify(sentData);
    try {
      let res = await this.httpClient.post(url, body).toPromise();
      return res;
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async insertDevice(sentData) {
    return this.updateDevice(sentData);
  }

  async lockDevice(sentData) {
    return this.updateDevice(sentData);
  }

  async getReportWorkingvsIdlingTimeDeviceData(sentData) {
    let url = `${this.appDomain}api/Report/ReportWorkingvsIdlingTimeDevice.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }
}
