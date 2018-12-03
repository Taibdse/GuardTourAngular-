import { Component, OnInit, ViewChild } from '@angular/core';
import { ZoneService } from '../../services/zone.service';
import { ValidationService } from '../../services/validation.service';
import { CommonService } from '../../services/common.service';
import { GoogleMapService } from '../../services/google-map.service';

@Component({
  selector: 'app-setting-zone',
  templateUrl: './setting-zone.component.html',
  styleUrls: ['./setting-zone.component.scss']
})
export class SettingZoneComponent implements OnInit {

  arrZoneList: any = [];
  arrInsertedPoints: any = [];
  alertErrorContent: string;
  alertSuccessContent: string;
  alertWarningContent: string;
  currentZone: any = {}
  centerMap: any;
  currentPolygonZoneInsertMap: any;
  mapInsertedZone: any;
  arrCurrentInsertedPointsZone: any = [];

  currentPage: number = 1;

  @ViewChild('modalInsert') modalInsert;
  @ViewChild('modalUpdate') modalUpdate;
  @ViewChild('alertError') alertError;
  @ViewChild('alertSuccess') alertSuccess;
  @ViewChild('alertWarning') alertWarning;
  @ViewChild('selectZone') selectZone;
  @ViewChild('mapInsert') mapInsert;
  
  constructor(private zoneService: ZoneService, 
    private validationService: ValidationService, 
    private commonService: CommonService,
    private googleMapService: GoogleMapService
  ) { 
      this.centerMap = this.commonService.CENTER_POS_MAP_VIEW;
    }

  ngOnInit() {
    this.showZones();
  }

  async showZones(){
    this.arrZoneList = await this.zoneService.getAllZones();
    if(!this.arrZoneList){
      this.alertErrorContent = 'No data available!!';
      this.alertError.modalError.show();
    }
  }

  async deleteZone(){
    let { iZoneID } = this.currentZone;
    let sentData = { iZoneIDIN: iZoneID, bStatusIN: 3, sZoneNameIN: 0, sZoneLatLongIN: 0 }
    let response = await this.zoneService.inActiveZone(sentData);
    this.alertWarning.modalWarning.hide();
    this.informResult(true, 'Insert Successfully!!!', 4000);
    this.showZones();
  }

  async updateZone(){
    let { iZoneID, sZoneName } = this.currentZone;
    if(!this.validationService.checkNotEmpty(sZoneName)) {
      this.alertErrorContent = 'Zone name must be defined!!';
      this.alertError.modalError.show();
    }else{
      let sentData = { iZoneIDIN: iZoneID, sZoneNameIN: sZoneName, bStatusIN: 2, sZoneLatLongIN: 0 };
      let res = await this.zoneService.updateZone(sentData);
      this.modalUpdate.hide();
      this.informResult(true, 'Update successfully!!', 4000);
      this.showZones();
    }
  }

  async insertZone(){
    let { sZoneName } = this.currentZone;

    if(this.arrCurrentInsertedPointsZone.length < 3) return this.informResult(false, 'Zone must have at least 3 points!!', 5000);

    if(!this.validationService.checkNotEmpty(sZoneName)) return this.informResult(false, 'Zone name must be defined!!', 5000);

    let sentData = { iZoneIDIN: 0, sZoneNameIN: sZoneName, bStatusIN: 1, sZoneLatLongIN: this.arrCurrentInsertedPointsZone };
    let response = await this.zoneService.insertZone(sentData);
    this.modalInsert.hide();
    this.informResult(true, 'Insert Successfully!!!', 4000);
    this.showZones();
  }

  showInsertModal(){
    this.currentZone = {};
    this.buildInsertZoneMap();
    this.modalInsert.show();
    this.clearZone();
  }

  showUpdateModal(zone){
    this.currentZone = Object.assign({}, zone);
    this.modalUpdate.show();
  }

  showConfirmDeleteZone(zone){
    this.currentZone = Object.assign({}, zone);
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

  clearZone(){
    this.arrCurrentInsertedPointsZone = [];
    this.buildInsertZoneMap();
  }

  buildInsertZoneMap(){
    let { CENTER_POS_MAP_VIEW } = this.commonService;
    let latCenter = CENTER_POS_MAP_VIEW[0];
    let lngCenter = CENTER_POS_MAP_VIEW[1];
    let mapProp = this.googleMapService.createMapProp(16, latCenter, lngCenter);
    let { nativeElement } = this.mapInsert;
    this.mapInsertedZone = new google.maps.Map(nativeElement, mapProp);
    let icon = './assets/img/Checked.png';
  
    google.maps.event.addListener(this.mapInsertedZone, 'click', event => {
      this.handleClickOnMapZone(event);
    });
  
    if(this.arrCurrentInsertedPointsZone.length > 0){
      this.arrCurrentInsertedPointsZone.forEach(point => {
        let lat = point[0];
        let lng = point[1];
        let pos = new google.maps.LatLng(lat, lng);
        let marker = this.googleMapService.createMarker(pos, icon);
        marker.setMap(this.mapInsertedZone);
      })
      this.drawPolygon(this.mapInsertedZone, this.arrCurrentInsertedPointsZone);
    }
  }

  handleClickOnMapZone(event){
    let lat = event.latLng.lat();
    let lng = event.latLng.lng();
    let pos = new google.maps.LatLng(lat, lng);
    let icon = './assets/img/Checked.png';
    let marker = this.googleMapService.createMarker(pos, icon);
    marker.setMap(this.mapInsertedZone);
    this.arrCurrentInsertedPointsZone.push([lat, lng]);
    //console.log(arrCurrentInsertedPointsZone);
    if(!this.mapInsertedZone) return;
    if(this.currentPolygonZoneInsertMap)
    this.currentPolygonZoneInsertMap.setMap(null);
    this.drawPolygon(this.mapInsertedZone, this.arrCurrentInsertedPointsZone);
  }

  drawPolygon(map, latlngs){
    let path = latlngs.map(point => {
      return new google.maps.LatLng(point[0], point[1]);
    });
    this.currentPolygonZoneInsertMap = this.googleMapService.createPolygon(path);
    this.currentPolygonZoneInsertMap.setMap(map);
  }

}
