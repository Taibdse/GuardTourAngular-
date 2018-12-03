import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { IncidentService } from '../../services/incident.service';
import { TimeService } from '../../services/time.service';
import { GoogleMapService } from '../../services/google-map.service';

@Component({
  selector: 'app-history-incidents',
  templateUrl: './history-incidents.component.html',
  styleUrls: ['./history-incidents.component.scss']
})
export class HistoryIncidentsComponent implements OnInit {
  @ViewChild('modalIncidentMap') modalIncidentMap;
  @ViewChild('modalAllIncidentsMap') modalAllIncidentsMap;
  @ViewChild('modalImage') modalImage;
  @ViewChild('mapIncident') mapIncident;
  @ViewChild('mapAllIncidents') mapAllIncidents;
  @ViewChild('alertSuccess') alertSuccess;
  @ViewChild('alertError') alertError;
  @ViewChild('alertWarning') alertWarning;
  @ViewChild('selectIncident') selectIncident;

  arrIncidents: any;
  appDomain: string;
  mapCenter: any;

  alertErrorContent:string;
  alertSuccessContent:string;
  alertWarningContent:string;
  currentModalImage: string;

  // date picker
  currentFromDate: string;
  currentToDate: string;
  dateTimePickerSettings = {
		bigBanner: false,
		timePicker: false,
		format: 'dd-MM-yyyy',
		defaultOpen: false
  }
  currentPage: number = 1;

  constructor(private commonService: CommonService, 
    private incidentService: IncidentService, 
    private timeService: TimeService, 
    private googleMapService: GoogleMapService) { 
    this.appDomain = this.commonService.APP_DOMAIN;
    this.mapCenter = this.commonService.CENTER_POS_MAP_VIEW;
  }

  ngOnInit() {
    this.setDefaultTime();
    this.showIncidentsData();
  }

  setDefaultTime(){
    let today = this.timeService.getCurrentDate();
    let tomorrow = this.timeService.getTomorrow();
    this.currentFromDate = `${today.year}-${today.month + 1}-${today.day}`;
    this.currentToDate = `${tomorrow.year}-${tomorrow.month + 1}-${tomorrow.day}`;
  }

  convertToSentDataFormatDate(d: Date){
    let year = d.getFullYear();
    let month = d.getMonth();
    let day = d.getDate();
    return `${year}-${month + 1}-${day}`;
  }

  async showIncidentsData() {
    let fromTime = new Date(this.currentFromDate);
    let toTime = new Date(this.currentToDate);
    let fromDate = this.convertToSentDataFormatDate(fromTime);
    let toDate = this.convertToSentDataFormatDate(toTime);
    let IncidentID = this.selectIncident.currentVal;
    if(!IncidentID) IncidentID = 0;
    if(fromTime.getTime() >= toTime.getTime()) return this.informResult(false, 'Start date must be sooner than end date!!', 5000);
    let sentData = { fromDate, toDate, IncidentID };
    console.log(sentData);
    this.arrIncidents = await this.incidentService.getIncidentsData(sentData);
    console.log(this.arrIncidents);
    if(!this.arrIncidents) return this.informResult(false, 'No data available!!', 4000);
  }

  showModalMapAllIncidents(){

  }

  showImg(ImageUrl){
    return `${this.appDomain}${ImageUrl}`;
  }

  showIncidentImage(incident){
    this.currentModalImage = this.showImg(incident.ImageUrl);
    this.modalImage.show();
  }

  buildIncidentMap(incident){
    let latCenter = this.mapCenter[0];
    let lngCenter = this.mapCenter[1];
    let mapProp = this.googleMapService.createMapProp(16, latCenter, lngCenter);
    let { nativeElement } = this.mapIncident;
    let mymap = new google.maps.Map(nativeElement, mapProp);
    if(incident){
      const { dAlertLat, dAlertLong, ImageUrl, sAlertDescription, dDateTimeIntinial } = incident
      let lat = Number(dAlertLat);
      let lng = Number(dAlertLong);
      let pos = new google.maps.LatLng(lat, lng);
      let img = `${this.appDomain}${ImageUrl}`;
      let mes = `${dDateTimeIntinial}<br>${sAlertDescription}<br><img src="${img}" class="img-fluid">`
      
      let icon = './assets/img/error.png';
      let marker = this.googleMapService.createMarker(pos, icon);
      marker.setMap(mymap);
      let infoWindow = this.googleMapService.createInfoWindow(mes, null, null);
      infoWindow.open(mymap, marker);
    }
  }
  
  buildAllIncidentMap(incidents){
    let latCenter = this.mapCenter[0];
    let lngCenter = this.mapCenter[1];
    let mapProp = this.googleMapService.createMapProp(16, latCenter, lngCenter);
    let { nativeElement } = this.mapAllIncidents;
    let mymap = new google.maps.Map(nativeElement, mapProp);
    let icon = './assets/img/error.png';
  
    if(incidents && incidents.length > 0){
      incidents.forEach(incident => {
        const { dAlertLat, dAlertLong, ImageUrl, sAlertDescription, dDateTimeIntinial} = incident;
        let lat = Number(dAlertLat);
        let lng = Number(dAlertLong)
        let pos = new google.maps.LatLng(lat, lng);
        let img = `${this.appDomain}${ImageUrl}`;
        let mes = `${dDateTimeIntinial}<br>${sAlertDescription}<br><img src="${img}" class="img-fluid">`;
        
        let marker = this.googleMapService.createMarker(pos, icon);
        marker.setMap(mymap);
        let infoWindow = this.googleMapService.createInfoWindow(mes, null, null);
        infoWindow.open(mymap, marker);
      })
    }
  }

  showAllIncidentMap(){
    this.buildAllIncidentMap(this.arrIncidents);
    this.modalAllIncidentsMap.show();
  }
  
  showMapIncident(incident){
    this.buildIncidentMap(incident);
    this.modalIncidentMap.show();
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
