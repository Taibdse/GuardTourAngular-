import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { TimeService } from '../../services/time.service';
import { ReportService } from '../../services/report.service';
import { GoogleMapService } from '../../services/google-map.service';

@Component({
  selector: 'app-history-attendance',
  templateUrl: './history-attendance.component.html',
  styleUrls: ['./history-attendance.component.scss']
})
export class HistoryAttendanceComponent implements OnInit {

  @ViewChild('alertSuccess') alertSuccess;
  @ViewChild('alertError') alertError;
  @ViewChild('alertWarning') alertWarning;
  @ViewChild('modalMap') modalMap;
  @ViewChild('modalImage') modalImage;
  @ViewChild('mapArea') mapArea;

  alertErrorContent:string;
  alertSuccessContent:string;
  alertWarningContent:string;
  currentModalImage: string;

  mapCenter: any;
  appDomain: string;
  arrAttendanceData: any;
  currentImageModal: string;
  // date picker
  
  currentDate: string;
  dateTimePickerSettings = {
		bigBanner: false,
		timePicker: false,
		format: 'dd-MM-yyyy',
		defaultOpen: false
  }

  currentPage: number = 1;

  constructor(private commonService: CommonService, 
    private timeService: TimeService, 
    private reportService: ReportService, 
    private googleMapService: GoogleMapService) { 
      this.mapCenter = this.commonService.CENTER_POS_MAP_VIEW;
      this.appDomain = this.commonService.APP_DOMAIN;
    }

  ngOnInit() {
    this.setDefaultDate();
    this.showAttendanceData();
  }

  setDefaultDate(){
    this.currentDate = new Date().toDateString();
  }

  async showAttendanceData(){
    let date = new Date(this.currentDate);
    let dDateTimeIN = this.timeService.getDateToYMD(date);
    let sentData = { dDateTimeIN };
    this.arrAttendanceData = await this.reportService.getDataAttandance(sentData);
    if(!this.arrAttendanceData) return this.informResult(false, 'No data available!!', 5000);
  }

  showImage(sImageUrl){
    if(!sImageUrl) return './assets/img/download.jpg';
    return `${this.appDomain}${sImageUrl}`;
  }

  showModalImage(item){
    let { sImageUrl } = item;
    this.currentImageModal = this.showImage(sImageUrl);
    this.modalImage.show();
  }

  showMap(item){
    this.buildAttendanceMap(item);
    this.modalMap.show();
  }
  
  buildAttendanceMap(attendance){
    let latCenter = this.mapCenter[0];
    let lngCenter = this.mapCenter[1];
    let mapProp = this.googleMapService.createMapProp(16, latCenter, lngCenter);
    let { nativeElement } = this.mapArea;
    let mymap = new google.maps.Map(nativeElement, mapProp);
    if(attendance){
      const {dLatTimeCheck, dLongTimeCheck, sImageUrl, sGuardName} = attendance
      let lat = Number(dLatTimeCheck);
      let lng = Number(dLongTimeCheck);
      let pos = new google.maps.LatLng(lat, lng);
      let img = this.showImage(sImageUrl);
      let mes = `${sGuardName}<br><img src="${img}" class="img-fluid">`
      
      let icon = './assets/img/error.png';
      let marker = this.googleMapService.createMarker(pos, icon);
      marker.setMap(mymap);
      let infoWindow = this.googleMapService.createInfoWindow(mes, null, null);
      infoWindow.open(mymap, marker);
    }
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
