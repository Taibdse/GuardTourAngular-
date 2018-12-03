import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  appDomain: string;
  constructor(private commonService: CommonService, 
    private httpClient: HttpClient) { 
    this.appDomain = this.commonService.APP_DOMAIN;
  }
  
  async getRouteCreatedData(sentData) {
    let url = `${this.appDomain}api/GetRouteCreatedData.php`;
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

  async deleteRoute(sentData) {
    let url = `${this.appDomain}api/UpdateRoute.php`;
    let body = JSON.stringify(sentData);
    try {
      let res = await this.httpClient.post(url, body).toPromise();
      return res;
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async updateRouteGuard(sentData) {
    let url = `${this.appDomain}api/UpdateRouteGuard.php`;
    let body = JSON.stringify(sentData);
    try {
      let res = await this.httpClient.post(url, body).toPromise();
      return res;
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async saveRoute(sentData) {
    return this.deleteRoute(sentData);
  }

  async updateRouteDetail(sentData) {
    let url = `${this.appDomain}api/UpdateRoute.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getRouteDetailsData(sentData) {
    let url = `${this.appDomain}api/GetRouteDetailData.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getRoutelist() {
    let url = `${this.appDomain}api/getRoutelist.php`;
    let body = null;
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getEventHistoryRoute(sentData) {
    let url = `${this.appDomain}api/getRoutelist.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async reportRoutebydate(sentData) {
    let url = `${this.appDomain}api//Report/ReportRoutebydate.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

}
