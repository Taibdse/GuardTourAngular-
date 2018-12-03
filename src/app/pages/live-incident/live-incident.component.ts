import { Component, OnInit, ViewChild } from '@angular/core';
import { IncidentService } from '../../services/incident.service';
import { CommonService } from '../../services/common.service';
import { GoogleMapService } from '../../services/google-map.service';

@Component({
  selector: 'app-live-incident',
  templateUrl: './live-incident.component.html',
  styleUrls: ['./live-incident.component.scss']
})
export class LiveIncidentComponent implements OnInit {
  @ViewChild('selectIncident') selectIncident;
  @ViewChild('modalImage') modalImage;
  @ViewChild('alertSuccess') alertSuccess;
  @ViewChild('alertError') alertError;
  @ViewChild('mapIncident') mapIncident;
  @ViewChild('modalMap') modalMap;

  arrLiveIncidentList: any;
  currentImgUrl: string;
  alertSuccessContent: string = '';
  alertErrorContent: string = '';
  mapCenter: any;
  appDomain: string;
  currentPage: number = 1;
  
  constructor(private incidentService: IncidentService, 
    private commonService: CommonService, 
    private googleMapService: GoogleMapService) { 
      this.mapCenter = this.commonService.CENTER_POS_MAP_VIEW;
      this.appDomain = this.commonService.APP_DOMAIN;
    }

  ngOnInit() {
    this.showIncidentsData();
  }

  async showIncidentsData(){
    let IncidentID = this.selectIncident.currentVal;
    if(!IncidentID) IncidentID = 0;
    let sentData = { IncidentID }; 
    this.arrLiveIncidentList = await this.incidentService.getLiveIncident(sentData);
  }
 
  async showLiveIncidentList(){
    let IncidentID = this.selectIncident.currentVal;
    if(IncidentID == null || IncidentID == undefined) return;
    let sentData = { IncidentID };
    this.arrLiveIncidentList = await this.incidentService.getLiveIncident(sentData);
    if(!this.arrLiveIncidentList) {
      this.alertErrorContent = 'No data available!!!'
      this.alertError.modalError.show();
    }
  }

  getImageIncidentUrl(ImageUrl){
    return `${this.appDomain}${ImageUrl}`;
  }

  showIncidentImage(imgUrl){
    this.currentImgUrl = this.getImageIncidentUrl(imgUrl);
    if(this.currentImgUrl == '' || !this.currentImgUrl) return;
    this.modalImage.show();
  }

  showMapIncident(incident){
    let latCenter = this.mapCenter[0]
    let lngCenter = this.mapCenter[1];
    let mapProp = this.googleMapService.createMapProp(16, latCenter, lngCenter);
    let { nativeElement } = this.mapIncident;
    let mymap = new google.maps.Map(nativeElement, mapProp);
    if(incident){
      const { dAlertLat, dAlertLong, ImageUrl, sAlertDescription, dDateTimeIntinial } = incident
      let lat = Number(dAlertLat);
      let lng = Number(dAlertLong);
      let pos = new google.maps.LatLng(lat, lng);
      let img = `${this.commonService.APP_DOMAIN}${ImageUrl}`;
      let mes = `${dDateTimeIntinial}<br>${sAlertDescription}<br><img src="${img}" class="map-image-lg">`
      let icon = './assets/img/error.png';
      let marker = this.googleMapService.createMarker(pos, icon);
      marker.setMap(mymap);
      let infoWindow = this.googleMapService.createInfoWindow(mes, null, null);
      infoWindow.open(mymap, marker);
    }
    this.modalMap.show();
  }

  showAllIncidentMap(){
    let { CENTER_POS_MAP_VIEW } = this.commonService;
    let latCenter = CENTER_POS_MAP_VIEW[0];
    let lngCenter = CENTER_POS_MAP_VIEW[1];
    let mapProp = this.googleMapService.createMapProp(16, latCenter, lngCenter);
    let { nativeElement } = this.mapIncident;
    let mymap = new google.maps.Map(nativeElement, mapProp);
    let icon = './assets/img/error.png';
    let arr = this.arrLiveIncidentList;
    if(arr && arr.length > 0){
      arr.forEach(incident => {
        const { dAlertLat, dAlertLong, ImageUrl, sAlertDescription, dDateTimeIntinial } = incident;
        let lat = Number(dAlertLat);
        let lng = Number(dAlertLong)
        let pos = new google.maps.LatLng(lat, lng);
        let img = `${this.commonService.APP_DOMAIN}${ImageUrl}`;
        let mes = `${dDateTimeIntinial}<br>${sAlertDescription}<br><img src="${img}" class="map-image">`;
        let marker = this.googleMapService.createMarker(pos, icon);
        marker.setMap(mymap);
        let infoWindow = this.googleMapService.createInfoWindow(mes, null, null);
        infoWindow.open(mymap, marker);
      })
    }
    this.modalMap.show();
  }


}
