import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  appDomain: string;
  constructor(private commonService: CommonService, 
    private httpClient: HttpClient) { 
    this.appDomain = this.commonService.APP_DOMAIN;
  }

  async insertZone(sentData) {
    let url = `${this.appDomain}api/UpdateZone.php`;
    let body = JSON.stringify(sentData);
    try {
      let res = await this.httpClient.post(url, body).toPromise();
      return res;
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async updateZone(sentData) {
    let url = `${this.appDomain}api/UpdateZone.php`;
    let body = JSON.stringify(sentData);
    try {
      let res = await this.httpClient.post(url, body).toPromise();
      return res;
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async inActiveZone(sentData) {
    let url = `${this.appDomain}api/UpdateZone.php`;
    let body = JSON.stringify(sentData);
    try {
      let res = await this.httpClient.post(url, body).toPromise();
      return res;
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getAllZones() {
    let url = `${this.appDomain}api/GetZone.php`;
    let body = null;
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  
  async getPointsDataOnZone(sentData) {
    let url = `${this.appDomain}api/GetPointData.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getRoutesOnZone(sentData) {
    let url = `${this.appDomain}api/GetRouteData.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }
}
