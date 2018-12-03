import { Component, OnInit, ViewChild } from '@angular/core';
import { PointService } from '../../services/point.service';
import { ValidationService } from '../../services/validation.service';
import { GoogleMapService } from '../../services/google-map.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-setting-check-point',
  templateUrl: './setting-check-point.component.html',
  styleUrls: ['./setting-check-point.component.scss']
})
export class SettingCheckPointComponent implements OnInit {
  
  @ViewChild('modalInsert') modalInsert;
  @ViewChild('modalUpdate') modalUpdate;
  @ViewChild('alertError') alertError;
  @ViewChild('alertSuccess') alertSuccess;
  @ViewChild('alertWarning') alertWarning;
  @ViewChild('selectGuardInsert') selectGuardInsert;
  @ViewChild('selectGuardUpdate') selectGuardUpdate;
  @ViewChild('selectZones') selectZones;
  @ViewChild('selectZoneInsert') selectZoneInsert;
  @ViewChild('mapInsertPoint') mapInsertPoint;
  @ViewChild('mapUpdatePoint') mapUpdatePoint;
  @ViewChild('radioInsertPointQRCode') radioInsertPointQRCode;
  @ViewChild('radioInsertPointRFID') radioInsertPointRFID;
  @ViewChild('modalUpdatePointQuestion') modalUpdatePointQuestion;
  @ViewChild('selectQuestion1') selectQuestion1;
  @ViewChild('selectQuestion2') selectQuestion2;
  @ViewChild('selectQuestion3') selectQuestion3;

  arrPoints: any;
  alertErrorContent: string;
  alertSuccessContent: string;
  alertWarningContent: string;
  currentPoint: any = {}

  currentPage: number = 1;

  constructor(private validationService: ValidationService, 
    private pointService: PointService, 
    private googleMapService: GoogleMapService, 
    private commonService: CommonService) { }

  ngOnInit() {
    this.showPoints();
  }

  async showPoints(){ 
    let iZoneID = this.selectZones.currentVal;
    if(!iZoneID) iZoneID = 0;
    let sentData = { iZoneID };
    this.arrPoints = await this.pointService.getPointsDataOnZone(sentData);
    if(!this.arrPoints) this.informResult(false, 'No data available!!', 4000);
  }

  async inActivePoint(){
    const { iPointID, iZoneID } = this.currentPoint;
    let sentData = { iPointIDIN: iPointID, bStatusIN: 3, iZoneIDIN: iZoneID, sPointCodeIN: 0, sQRCodeIN: 0, sRFIDCodeIN: 0, sPointNameIN: 0, sPointNoteIN: 0, dGPSLatIN: 0, dGPSLongIN: 0 };
    let response = await this.pointService.inActivePoint(sentData);
    this.alertWarning.modalWarning.hide();
    this.informResult(true, 'Delete successfully!!', 3000);
    this.showPoints();
  }
  
  async updatePoint(){
    let { iPointID, iZoneID, GPS, iQRCode, iRFID, sPointName, sPointNote, sPointCode, dPointLat, dPointLong } = this.currentPoint;
    let { valid, msgErr } = this.checkValidInsertPoint(sPointName, sPointNote);
    if(!valid)  return this.informResult(false, msgErr, null);
    let sentData = { bStatusIN: 2, dGPSLatIN: dPointLat, dGPSLongIN: dPointLong, sQRCodeIN: 0, sRFIDCodeIN: 0, sPointNameIN: sPointName, sPointNoteIN: sPointNote, iPointIDIN: iPointID, iZoneIDIN: iZoneID };
    if(!GPS){
      if(!this.validationService.checkNotEmpty(sPointCode)) 
      return this.informResult(false, 'Point Code must be defined!!', 5000); 
      if(iQRCode != '') sentData.sQRCodeIN = sPointCode;
      else sentData.sRFIDCodeIN = sPointCode;
    } 
    let response = await this.pointService.updatePoint(sentData);
    let { Result, Msg } = response[0];
    if(Result != '1') return this.informResult(false, Msg, null);
    this.informResult(true, 'Update successfully!!', null);
    this.showPoints();
  }
  
  async insertPoint(){
    let iZoneIDIN = this.selectZoneInsert.currentVal;
    let qrCode = this.radioInsertPointQRCode.nativeElement.checked;
    let rfid = this.radioInsertPointRFID.nativeElement.checked;
    let { dPointLat, dPointLong, sPointName, sPointNote, sPointCode } = this.currentPoint;
    if(!dPointLat && !dPointLong) return;
    let { valid, msgErr } = this.checkValidInsertPoint(sPointName, sPointNote)
    if(!valid) return this.informResult(false, msgErr, null);
    let sentData = { dGPSLatIN: Number(dPointLat), dGPSLongIN: Number(dPointLong), iZoneIDIN, bStatusIN: 1, iPointIDIN: 0, sPointNameIN: sPointName, sPointNoteIN: sPointNote, sQRCodeIN: 0, sRFIDCodeIN: 0 };
    if(qrCode) sentData.sQRCodeIN = sPointCode;
    if(rfid) sentData.sRFIDCodeIN = sPointCode;
    let response = await this.pointService.insertPoint(sentData);
    let { Result, Msg } = response[0];
    if(Result != '1') return this.informResult(false, Msg, null);
    this.informResult(true, 'Insert successfully!!', null);
    this.showPoints();
  }

  handleClickPointMap(mymap, event){
    let lat = event.latLng.lat();
    let lng = event.latLng.lng();
    let pos = new google.maps.LatLng(lat, lng);
    let mes = `${lat} - ${lng}`;
    this.currentPoint.dPointLat = lat;  
    this.currentPoint.dPointLong = lng;  
    let icon = './assets/img/Checked.png';
    let marker = this.googleMapService.createMarker(pos, icon);
    marker.setMap(mymap);
  }

  checkPointType(QRCode, RFID){
    if(QRCode != '') return 'QRCode';
    if(RFID != '') return 'RFID';
    return 'GPS';
  }

  buildPointsMap(points, insert){
    let { CENTER_POS_MAP_VIEW } = this.commonService;
    let latCenter = CENTER_POS_MAP_VIEW[0];
    let lngCenter = CENTER_POS_MAP_VIEW[1];
    let mapProp = this.googleMapService.createMapProp(16, latCenter, lngCenter);
    let { nativeElement } = this.mapInsertPoint;
    if(!insert) nativeElement = this.mapUpdatePoint.nativeElement;
    let mymap = new google.maps.Map(nativeElement, mapProp);
    let icon = './assets/img/Checked.png';
  
    google.maps.event.addListener(mymap, 'click', event => {
      this.handleClickPointMap(mymap, event);
    });
  
    //show all points
    if(points && points.length > 0){
      points.forEach(point => {
        const { iPointID, dPointLat, dPointLong, iQRCode, iRFID } = point;
        let type = this.checkPointType(iQRCode, iRFID);
        let mes = `<div style="font-size: 0.9em">ID: ${iPointID} - ${type}</div>`;
        let lat = Number(dPointLat);
        let lng = Number(dPointLong)
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

  checkValidInsertPoint(name, note){
    let valid = true;
    let msgErr = '';
    if(!this.validationService.checkNotEmpty(name)){
      msgErr += 'Point name must be filled\n'
      valid = false;
    }
    if(!this.validationService.checkNotEmpty(note)){
      msgErr += 'Point note must be filled\n'
      valid = false;
    }
    return { valid, msgErr };
  }

  async savePointQuestions(){
    let q1 = this.selectQuestion1.currentVal;
    let q2 = this.selectQuestion2.currentVal;
    let q3 = this.selectQuestion3.currentVal;
    let { iPointID } = this.currentPoint;
    let sentData = { iPointID, iQuestionAlert1: q1, iQuestionAlert2: q2, iQuestionAlert3: q3 };
    let response = await this.pointService.updatePointQuestion(sentData);
    this.informResult(true, 'Update Questions successfully!!', 4000);
    this.showPoints();
  }

  showInsertModal(){
    this.currentPoint = {};
    this.buildPointsMap(this.arrPoints, true);
    this.modalInsert.show();
  }

  showModalPointQuestionUpdate(point){
    this.currentPoint = Object.assign({}, point);
    const { iQuestionAlert1, iQuestionAlert2, iQuestionAlert3 } = point;
    this.selectQuestion1.currentVal = iQuestionAlert1
    this.selectQuestion2.currentVal = iQuestionAlert2
    this.selectQuestion3.currentVal = iQuestionAlert3
    this.modalUpdatePointQuestion.show();
  }

  showUpdateModal(point){
    const { iQRCode, iRFID } = point
    this.currentPoint = Object.assign({}, point);
    this.currentPoint.GPS = false;
    if(iQRCode.trim() == '' && iRFID.trim() == '')
      this.currentPoint.GPS = true;
    this.buildPointsMap(this.arrPoints, false);
    this.modalUpdate.show();
  }

  showConfirmDelete(point){
    this.currentPoint = Object.assign({}, point);
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
