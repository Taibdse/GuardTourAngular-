import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService {
  appDomain: string;
  constructor(private httpClient: HttpClient, 
    private commonService: CommonService) {
    this.appDomain = this.commonService.APP_DOMAIN;
  }

  async updateGuard(sentData) {
    let url = `${this.appDomain}api/UpdateGuard.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async insertGuard(sentData) {
    return this.updateGuard(sentData);
  }

  async inActiveGuard(sentData) {
    return this.updateGuard(sentData);
  }

  async getGuardGPSCurrent(sentData) {
    let { iGuardID } = sentData;
    let url = `${this.appDomain}api/GetGuardGPSCurrent.php?iGuardID=${iGuardID}`;
    // let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.get(url).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getGuardsData(){
    let url = `${this.appDomain}api/GetGuard.php`;
    let body = '';
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async sendSMSToGuards(sentData){
    let url = `${this.appDomain}api/InsertMessage.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return data;
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async checkTime(sentData) {
    let url = `${this.appDomain}api/CheckTime.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return data;
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }
  
  async getPersonalGuardsInfo(sentData){
    let url = `${this.appDomain}api/GetGuardInformation.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getLiveAttandance() {
    let url = `${this.appDomain}api/GetLiveAttandance.php`;
    let body = null;
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getPointChecking(sentData) {
    let { iGuardID, sCheckingCode } = sentData;
    let url = `${this.appDomain}api/GetPointChecking.php?iGuardID=${iGuardID}?sCheckingCode=${sCheckingCode}`;
    // let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.get(url).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getGuardTrackingbyTour(sentData) {
    let url = `${this.appDomain}api/GuardTrackingbyTour.php`;
    let body = JSON.stringify(sentData);;
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getEventHistoryDataGuard(sentData) {
    let url = `${this.appDomain}api/GetEventHistoryGuard.php`;
    let body = JSON.stringify(sentData);;
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getReportWorkingvsIdlingTimeGuardData(sentData) {
    let url = `${this.appDomain}api/Report/ReportWorkingvsIdlingTimeGuard.php`;
    let body = JSON.stringify(sentData);;
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

}
