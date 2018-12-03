import { Component, OnInit, ViewChild } from '@angular/core';
import { GuardService } from '../../services/guard.service';
import { CommonService } from '../../services/common.service';
import { GoogleMapService } from '../../services/google-map.service';
import {  } from '@types/googlemaps';

@Component({
  selector: 'app-live-attendance',
  templateUrl: './live-attendance.component.html',
  styleUrls: ['./live-attendance.component.scss']
})
export class LiveAttendanceComponent implements OnInit {

  arrAttendanceData: any;
  currentImgSrc: string = '';
  alertWarningContent: string;
  alertSuccessContent: string;
  alertErrorContent: string;
  mapCenter: any;
  currentPos: any = {};
  currentMes: string;
  currentPage: number = 1;
  
  @ViewChild('modalImage') modalImage;
  @ViewChild('modalMap') modalMap;
  @ViewChild('alertSuccess') alertSuccess;
  @ViewChild('alertError') alertError;
  @ViewChild('alertWarning') alertWarning;
  @ViewChild('mapAttendance') mapAttendance;

  constructor(private guardService: GuardService,
  private commonService: CommonService,
  private googleMapService: GoogleMapService) { 
    this.mapCenter = this.commonService.CENTER_POS_MAP_VIEW;
  }

  ngOnInit() {
    this.showAttendances();
  }

  async showAttendances(){
    this.arrAttendanceData = await this.guardService.getLiveAttandance();
    if(!this.arrAttendanceData) {
      this.alertErrorContent = 'No data available!!';
      this.alertError.modalError.show();
    }
  }

  showImgSrc(item){
    let { sImageUrl } = item;
    if(!sImageUrl) return 'assets/img/download.jpg';
    return `${this.commonService.APP_DOMAIN}${sImageUrl}`;
  }

  showImageModal(item){
    this.currentImgSrc= this.showImgSrc(item);
    this.modalImage.show();
  }

  showMap(item){
    let latCenter = this.mapCenter[0];
    let lngCenter = this.mapCenter[1];
    let mapProp = this.googleMapService.createMapProp(16, latCenter, lngCenter);
    let mymap = new google.maps.Map(this.mapAttendance.nativeElement, mapProp);

  if(item){
    const { dLatTimeCheck, dLongTimeCheck, sGuardName } = item
    let lat = Number(dLatTimeCheck);
    let lng = Number(dLongTimeCheck);
    let pos = new google.maps.LatLng(lat, lng);
    let img = this.showImgSrc(item);
    let mes = `${sGuardName}<br><img src="${img}" class="image-map">`
    let icon = './assets/img/Guard.png';
    let marker = this.googleMapService.createMarker(pos, icon);
    marker.setMap(mymap);
    let infoWindow = this.googleMapService.createInfoWindow(mes, null, null);
    infoWindow.open(mymap, marker);
    this.modalMap.show();
  }
}


}
