import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  appDomain: string;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/text'
    })
  };
  
  constructor(private commonService: CommonService, 
    private httpClient: HttpClient) { 
    this.appDomain = this.commonService.APP_DOMAIN;
  }

  async getAssetsData(sentData) {
    let url = `${this.appDomain}api/getassetsdata.php`;
    let body = JSON.stringify(sentData);
    try {
      let data = await this.httpClient.post(url, body).toPromise();
      return this.commonService.handleData(data);
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async updateAsset(sentData){
    let url = `${this.appDomain}api/Updateasset.php`;
    let body = JSON.stringify(sentData);
    try {
      let res = await this.httpClient.post(url, body).toPromise();
      return res;
    } catch (error) {
      return this.commonService.handleError(error);
    }
  }

  async deleteAsset(sentData){
    return this.updateAsset(sentData);
  }

  async insertAsset(sentData){
    return this.updateAsset(sentData);
  }
}
