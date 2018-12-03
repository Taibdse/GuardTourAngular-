import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PointService {
  appDomain: string;

  constructor(private httpClient: HttpClient, 
    private commonService: CommonService) {
    console.log(this.commonService.APP_DOMAIN)
    this.appDomain = this.commonService.APP_DOMAIN;
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

  async updatePoint(sentData) {
    let url = `${this.appDomain}api/UpdatePoint.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return data;
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async inActivePoint(sentData) {
    return this.updatePoint(sentData);
  }

  async insertPoint(sentData) {
    return this.updatePoint(sentData);
  }

  //get
  // async getPointChecking(sentData) {
  //   let url = `${this.appDomain}api/GetPointChecking.php`;
  //   let body = JSON.stringify(sentData);
  //   try {
  //     let data = await this.httpClient.get(url, body).toPromise();
  //     return this.commonService.handleData(data);
  //   } catch (error) {
  //     return this.commonService.handleError(error);
  //   }
  // }

  async updatePointQuestion(sentData){
    let url = `${this.appDomain}api/UpdatePointQuestion.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return data;
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

}


