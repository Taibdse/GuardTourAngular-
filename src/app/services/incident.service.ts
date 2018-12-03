import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  appDomain: string;
  constructor(private commonService: CommonService, 
    private httpClient: HttpClient) { 
    this.appDomain = this.commonService.APP_DOMAIN;
  }

  async getLiveIncident(sentData) {
    let url = `${this.appDomain}api/GetLiveIncident.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getIncidentsData(sentData) {
    let url = `${this.appDomain}api/GetIncidentData.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getIncidentContent() {
    let url = `${this.appDomain}api/GetIncidentContent.php`;
    let body = null;
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async insertIncident(sentData) {
    let url = `${this.appDomain}api/UpdateIncident.php`;
    let body = JSON.stringify(sentData);
    try {
      let response = await this.httpClient.post(url, body).toPromise();
      return response;
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async deleteIncident(sentData){
    let url = `${this.appDomain}api/UpdateIncident.php`;
    let body = JSON.stringify(sentData);
    try {
      let response = await this.httpClient.post(url, body).toPromise();
      return response;
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async updateIncident(sentData){
    let url = `${this.appDomain}api/UpdateIncident.php`;
    let body = JSON.stringify(sentData);
    try {
      let response = await this.httpClient.post(url, body).toPromise();
      return response;
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async reportIncidentWeekOrMonthChart(sentData) {
    let url = `${this.appDomain}api/Report/ReportIncidentWeekOrMonthChart.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async reportIncidentWeekOrMonth(sentData) {
    let url = `${this.appDomain}api/Report/ReportIncidentWeekOrMonth.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }
  
}
