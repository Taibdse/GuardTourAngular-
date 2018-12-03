import { Component, OnInit, ViewChild } from '@angular/core';
import { AssetService } from '../../services/asset.service';
import { ValidationService } from '../../services/validation.service';
import { CommonService } from '../../services/common.service';
import { GoogleMapService } from '../../services/google-map.service';

@Component({
  selector: 'app-setting-asset',
  templateUrl: './setting-asset.component.html',
  styleUrls: ['./setting-asset.component.scss'],
  providers: [AssetService]
})
export class SettingAssetComponent implements OnInit {

  @ViewChild('modalInsert') modalInsert;
  @ViewChild('modalUpdate') modalUpdate;
  @ViewChild('alertError') alertError;
  @ViewChild('alertSuccess') alertSuccess;
  @ViewChild('alertWarning') alertWarning;
  @ViewChild('selectZone') selectZone;
  @ViewChild('selectZoneInsert') selectZoneInsert;
  @ViewChild('selectRouteInsert') selectRouteInsert;
  @ViewChild('mapInsert') mapInsert;
  @ViewChild('mapUpdate') mapUpdate;

  arrAssets: any;
  alertErrorContent: string;
  alertSuccessContent: string;
  alertWarningContent: string;
  currentAsset: any = {}
  centerMap: any;
  currentPage: number = 1;
  
  constructor(private assetService: AssetService, 
    private validationService: ValidationService,  
    private commonService: CommonService, 
    private googleMapService: GoogleMapService) {
    this.centerMap = this.commonService.CENTER_POS_MAP_VIEW;
   }

  ngOnInit() {
    this.showAssets();
  }

  async showAssets(){
    let iZoneID = this.selectZone.currentVal;
    if(!iZoneID) iZoneID = 0;
    let sentData = { iZoneID };
    this.arrAssets = await this.assetService.getAssetsData(sentData);
    console.log(this.arrAssets);
    if(!this.arrAssets) this.informResult(false, 'No data available!!', 4000);
  }

  async updateAsset(){
    let { iAssetID, dPropertyLat, dPropertyLong, sAssetCode, sAssetName } = this.currentAsset;

    if(!this.validationService.checkNotEmpty(sAssetName) || !this.validationService.checkNotEmpty(sAssetCode))
    return this.informResult(false, 'Name and Code must be defined!!', 5000);

    let iZoneIDIN = this.selectZoneInsert.currentVal;
    let iRouteIDIN = this.selectRouteInsert.currentVal;
    let sentData = { sPropertyCodeIN: sAssetCode, sPropertyNameIN: sAssetName, iZoneIDIN, iRouteIDIN, dPropertyLatIN: Number(dPropertyLat), dPropertyLongIN: Number(dPropertyLong), iPropertyIDIN: iAssetID, bStatusIN: 2 };
    console.log(JSON.stringify(sentData));
    let response = await this.assetService.updateAsset(sentData);
    console.log(response);
    const { Result, Msg } = response[0];
    if(Result != 1) return this.informResult(true, Msg, 3000);
    this.informResult(true, "Update Successfully", 3000);
    this.showAssets();
  }

  async deleteAsset(){
    let { sAssetCode, sAssetName, iRouteID, iAssetID, iZoneID } = this.currentAsset;
    let sentData = { sPropertyCodeIN: sAssetCode, sPropertyNameIN: sAssetName, iZoneIDIN: iZoneID, iRouteIDIN: iRouteID, dPropertyLatIN: 0, dPropertyLongIN: 0, iPropertyIDIN: iAssetID, bStatusIN: 3 };
    console.log(JSON.stringify(sentData));
    let response = await this.assetService.deleteAsset(sentData);
    console.log(response);
    const { Result, Msg } = response[0];
    if(Result != 1) return this.informResult(true, Msg, 3000);
    this.informResult(true, "Delete Successfully", 3000);
    this.showAssets();
  }

  async insertAsset(){
    let { dPropertyLat, dPropertyLong, sAssetCode, sAssetName } = this.currentAsset;

    if(!this.validationService.checkNotEmpty(dPropertyLat) || !this.validationService.checkNotEmpty(dPropertyLong))
    return this.informResult(false, "You have to choose asset by clicking on map", 5000);

    if(!this.validationService.checkNotEmpty(sAssetName) || !this.validationService.checkNotEmpty(sAssetCode))
    return this.informResult(false, 'Name and Code must be defined!!', 5000);

    let iZoneIDIN = this.selectZoneInsert.currentVal;
    let iRouteIDIN = this.selectRouteInsert.currentVal;
    let sentData = { sPropertyCodeIN: sAssetCode, sPropertyNameIN: sAssetName, iZoneIDIN, iRouteIDIN, dPropertyLatIN: Number(dPropertyLat), dPropertyLongIN: Number(dPropertyLong), iPropertyIDIN: 0, bStatusIN: 1 };
    let response = await this.assetService.insertAsset(sentData);
    const { Result, Msg } = response[0];
    if(Result != 1) return this.informResult(true, Msg, 3000);
    this.informResult(true, "Insert Successfully", 3000);
    this.showAssets();
  }

  checkInsertValid(name, serial){
    let errMsg = '';
    let valid = true;
    if(!this.validationService.checkNotEmpty(name)){
      errMsg += 'Name must be defined!!\r\n';
      valid = false;
    }
    if(!this.validationService.checkNotEmpty(serial)){
      errMsg += 'Serial must be defined!!\r\n';
      valid = false;
    }
    return { errMsg, valid };
  }

  buildAssetsMap(assets, element){
    let { CENTER_POS_MAP_VIEW } = this.commonService;
    let latCenter = CENTER_POS_MAP_VIEW[0];
    let lngCenter = CENTER_POS_MAP_VIEW[1];
    let mapProp = this.googleMapService.createMapProp(16, latCenter, lngCenter);
    let mymap = new google.maps.Map(element, mapProp);
    let icon = './assets/img/asset(2).jpg';
  
    google.maps.event.addListener(mymap, 'click', event => {
      this.handleClickAssetMap(mymap, event);
    });
  
    if(assets && assets.length > 0){
      assets.forEach(asset => {
        const { sAssetName, dPropertyLat, dPropertyLong } = asset;
        let mes = `<div style="font-size: 0.9em">${sAssetName}</div>`;
        let lat = Number(dPropertyLat);
        let lng = Number(dPropertyLong)
        let pos = new google.maps.LatLng(lat, lng);
        let marker = this.googleMapService.createMarker(pos, icon);
        marker.setMap(mymap);
        let infoWindow = this.googleMapService.createInfoWindow(mes, null, null);
        marker.addListener('mouseover', function() {
          infoWindow.open(mymap, marker);
        });
      })
    }
  }
  
  handleClickAssetMap(mymap, event){
    let lat = event.latLng.lat();
    let lng = event.latLng.lng();
    let pos = new google.maps.LatLng(lat, lng);
    let mes = `${lat} - ${lng}`;
    this.currentAsset.dPropertyLat = lat;
    this.currentAsset.dPropertyLong = lng;
    let icon = './assets/img/asset(2).jpg';
    let marker = this.googleMapService.createMarker(pos, icon);
    marker.setMap(mymap);
  }

  showModalInsert(){
    this.currentAsset = {};
    let { nativeElement } = this.mapInsert;
    this.buildAssetsMap(this.arrAssets, nativeElement);
    this.modalInsert.show();
  }

  showModalUpdate(asset){
    let { iZoneID, iRouteID } = asset;
    this.currentAsset = Object.assign({}, asset);
    let { nativeElement } = this.mapUpdate;
    this.buildAssetsMap(this.arrAssets, nativeElement);
    this.selectZoneInsert.currentVal = iZoneID
    this.selectRouteInsert.currentVal = iRouteID;
    this.modalUpdate.show();
  }

  showConfirmDelete(asset){
    this.currentAsset = Object.assign({}, asset);
    this.alertWarningContent = 'Are you sure?';
    this.alertWarning.modalWarning.show();
  }

  informResult(success, content, timeout){
    if(!timeout) timeout = 3000;
    this.alertSuccessContent = content;
    let modal = this.alertSuccess.modalSuccess;
    if(!success){
      this.alertErrorContent = content;
      modal = this.alertError.modalError;
    }
    modal.show();
    setTimeout(() => modal.hide(), timeout);
  }

}
