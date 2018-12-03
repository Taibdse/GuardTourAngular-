import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class GuardGroupService {
  appDomain: string;

  constructor(private httpClient: HttpClient, 
    private commonService: CommonService) {
    this.appDomain = this.commonService.APP_DOMAIN;
  }

  async getGroup() {
    let url = `${this.appDomain}api/getGroup.php`
    let body = null;
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async getGroupData() {
    let url = `${this.appDomain}api/GetGroupData.php`
    let body = null;
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async updateGroup(sentData) {
    let url = `${this.appDomain}api/UpdateGroup.php`
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async deleteGroup(sentData) {
    return this.updateGroup(sentData);
  }

  async insertGroup(sentData) {
    return this.updateGroup(sentData);
  }
  
  async getReportWorkingvsIdlingTimeGuardGroup(sentData) {
    let url = `${this.appDomain}api/Report/ReportWorkingvsIdlingTimeGuardGroup.php`
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      console.log(data);
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

}
