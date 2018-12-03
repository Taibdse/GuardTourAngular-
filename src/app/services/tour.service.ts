import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  appDomain: string;

  constructor(private httpClient: HttpClient, 
    private commonService: CommonService) {
    console.log(this.commonService.APP_DOMAIN)
    this.appDomain = this.commonService.APP_DOMAIN;
  }

  async getEventsData() {
    let url = `${this.appDomain}api/GetEvent.php`;
    let body = null;
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getLiveTour(sentData) {
    let url = `${this.appDomain}api/GetLiveTour.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getEventHistoryDetails(sentData) {
    let url = `${this.appDomain}api/GetEventHistoryDetail.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getEventHistoryDataGuard(sentData) {
    let url = `${this.appDomain}api/GetEventHistoryGuard.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getEventHistoryRoute(sentData) {
    let url = `${this.appDomain}api/GetEventHistoryRoute.php`;
    let body = JSON.stringify(sentData);
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

  async getTourDetail(sentData) {
    let url = `${this.appDomain}api/GetTourDetail.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async processTourError(sentData) {
    let url = `${this.appDomain}api/ProcessTourError.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

 
}


