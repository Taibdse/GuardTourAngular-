import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ReportService {
  appDomain: string;
  constructor(private httpClient: HttpClient, 
    private commonService: CommonService) { 
      this.appDomain = this.commonService.APP_DOMAIN;
    }

  async getReportPerformanceChart(sentData) {
    let url = `${this.appDomain}api/GetReportPerformanceChart.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getReportPerformance(sentData) {
    let url = `${this.appDomain}api/GetReportPerformance.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getReportData(sentData) {
    let url = `${this.appDomain}api/Report/ReportGuardByDate.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getDataAttandance(sentData) {
    let url = `${this.appDomain}api/GetDataAttandance.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }
}
