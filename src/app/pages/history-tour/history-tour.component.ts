import { Component, OnInit, ViewChild } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { DeviceService } from '../../services/device.service';
import { GuardService } from '../../services/guard.service';
import { CommonService } from '../../services/common.service';
import { TourService } from '../../services/tour.service';
import { TimeService } from '../../services/time.service';
import { GoogleMapService } from '../../services/google-map.service';

@Component({
  selector: 'app-history-tour',
  templateUrl: './history-tour.component.html',
  styleUrls: ['./history-tour.component.scss']
})
export class HistoryTourComponent implements OnInit {
  @ViewChild('modalMap') modalMap;
  @ViewChild('modalTourDetails') modalTourDetails;
  @ViewChild('alertSuccess') alertSuccess;
  @ViewChild('alertError') alertError;
  @ViewChild('alertAcceptReject') alertAcceptReject;
  @ViewChild('selectGuard') selectGuard;
  @ViewChild('selectRoute') selectRoute;
  @ViewChild('selectDevice') selectDevice;
  @ViewChild('tourDetailsMap') tourDetailsMap;

  alertAcceptRejectContent: string;
  alertSuccessContent: string;
  alertErrorContent: string;
  mapCenter: any;
  currentTour: any;
  currentHeader: string;
  lastSearch: any = {};

  arrDetails: any;
  arrTours: any;

  currentFromDate: string;
  currentToDate: string;
  dateTimePickerSettings = {
		bigBanner: true,
		timePicker: true,
		format: 'yyyy-MM-dd HH:mm',
		defaultOpen: false
  }
  currentPage: number = 1;
  
  constructor(private guardService: GuardService, 
    private routeService: RouteService, 
    private deviceService: DeviceService, 
    private commonService: CommonService, 
    private timeService: TimeService, 
    private tourService: TourService, 
    private googleMapService: GoogleMapService) { 
      this.mapCenter = this.commonService.CENTER_POS_MAP_VIEW;
    }

  ngOnInit() {
    
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.showTourListsByDefault();
    }, 1000);
  }

  async showTourListsByDefault(){
    let { year, month, day, hour, min } = this.timeService.getCurrentDateTime();
    this.currentFromDate = `${year}-${month + 1}-${day} 00:00`;
    this.currentToDate = `${year}-${month + 1}-${day} ${hour}:${min}`;
    let GuardID = this.selectGuard.currentVal;
    let { arrGuardList } = this.selectGuard;
    let guard = arrGuardList.find(g => g.iGuardId == GuardID.trim());

    let name = guard.sGuardName;
    let type = 'Guard';
    
    let sentData = { fromDate: this.currentFromDate, toDate: this.currentToDate, GuardID };

    this.currentHeader = `${type} Name: ${name} - (${this.currentFromDate} -> ${this.currentToDate})`;
    this.lastSearch.sentData = sentData;
    this.lastSearch.currentHeader;
    this.arrTours = await this.guardService.getEventHistoryDataGuard(sentData);
  }

  async showTourHistoryData(type){
    let filterObj = type[0].toUpperCase() + type.substring(1);
    let fromTime = new Date(this.currentFromDate);
    let toTime = new Date(this.currentToDate);
    if(fromTime.getTime() >= toTime.getTime()) return this.informResult(false, 'Start date must be sooner than end date', 6000);
    let fromDate = this.timeService.convertTimeToStringFormat(fromTime);
    let toDate = this.timeService.convertTimeToStringFormat(toTime);
    let sentData = { fromDate, toDate };
    let name;
    if(type == 'guard'){
      let id = this.selectGuard.currentVal.trim();
      sentData.GuardID = id;
      let { arrGuardList } = this.selectGuard;
      let guard = arrGuardList.find(g => g.iGuardId == id);
      name = guard.sGuardName;
      this.arrTours = await this.tourService.getEventHistoryDataGuard(sentData);
    }else if(type == 'route'){
      let id = this.selectRoute.currentVal.trim();
      sentData.RouteID = id;
      let { arrRouteList } = this.selectRoute;
      let route = arrRouteList.find(r => r.iRouteID == id);
      name = route.sRouteName;
      this.arrTours = await this.tourService.getEventHistoryRoute(sentData);
    }else if(type == 'device'){
      let id = this.selectDevice.currentVal.trim();
      sentData.DeviceID = id;
      let { arrDeviceList } = this.selectDevice;
      let device = arrDeviceList.find(d => d.iDeviceID == id);
      name = device.sDeviceName;
      this.arrTours = await this.tourService.getEventHistoryDevice(sentData);
    }
    this.currentHeader = `${filterObj} Name: ${name} - (${fromDate} -> ${toDate})`;
    this.lastSearch.sentData = sentData;
    this.lastSearch.currentHeader;
    if(!this.arrTours) return this.informResult(false, 'No data available!!', 4000);
  }

  showProcessedStatus(error){
    if(error == '0') return 'Error';
    if(error == '2') return 'Fixed';
    return 'Success';
  }

  async showTourHistoryDetails(tour){
    let { sCheckingCode } = tour;
    let sentData = { CheckingCode: sCheckingCode };
    this.arrDetails = await this.tourService.getEventHistoryDetails(sentData);
    console.log(this.arrDetails);
    this.modalTourDetails.show();
  }

  buildTourDetailsMap(data, dataTracking){
    let lat = this.mapCenter[0];
    let lng = this.mapCenter[1];
    let mapProp = this.googleMapService.createMapProp(16, lat, lng);
    let { nativeElement } = this.tourDetailsMap;
    let mymap = new google.maps.Map(nativeElement, mapProp);
    if(data){
      let l1 = data.length;
      data.forEach((detail, index) => {
        let lat = Number(detail.dPointLat);
        let lng = Number(detail.dPointLong);
        let pos = new google.maps.LatLng(lat, lng);
        if (lat != 0 || lng != 0){
          if(detail.sStatus == 'Checked'){
            let mes = `${detail.sGuardName} checked at ${detail.dDateTimeHistory}`
            let icon = './assets/img/Checked.png';
            let marker = this.googleMapService.createMarker(pos, icon);
            marker.setMap(mymap);
            let infoWindow = this.googleMapService.createInfoWindow(mes, null, null);
            if(index == 0 || index == l1 - 1) 
              infoWindow.open(mymap, marker);
            google.maps.event.addListener(marker, 'click', function() {
              infoWindow.open(mymap, marker);
            });
          }else{
            let icon = './assets/img/None.png';
            let marker = this.googleMapService.createMarker(pos, icon);
            marker.setMap(mymap);
          }
        }
      })
    }
    if(dataTracking){
      let path = [];
      dataTracking.forEach(item => {
        const { dGuardLatCurrent, dGuardLongCurrent } = item;
        let lat = Number(dGuardLatCurrent);
        let lng = Number(dGuardLongCurrent);
        if (lat != 0 || lng != 0){
          let pos = new google.maps.LatLng(lat, lng);
          path.push(pos);
        }
      })
      let polyline = this.googleMapService.createPolyline(path);
      polyline.setMap(mymap);
    }
  }

  async showTourDetailsMap(tour) {
    let { sCheckingCode } = tour;
    let sentData = { CheckingCode: sCheckingCode };
    let data = await this.tourService.getEventHistoryDetails(sentData);
    let dataTracking = await this.guardService.getGuardTrackingbyTour(sentData);
    console.log(dataTracking);
    console.log(data);
    this.buildTourDetailsMap(data, dataTracking);
    this.modalMap.show();
  }

  async showAcceptConfirm(tour){
    this.currentTour = Object.assign({}, tour);
    const { iError } = tour;
    if(iError != '0') return this.informResult(false ,'Can not accept or reject this !!', 5000);
    this.alertAcceptRejectContent = 'Do you want to accept or reject this?'
    this.alertAcceptReject.modalWarning.show();
  }

  async showTourHistoryDataLastSearch(){
    let { sentData, currentHeader } = this.lastSearch;
    if(currentHeader.indexOf('Guard') > -1) 
      this.arrTours = await this.tourService.getEventHistoryDataGuard(sentData);
    if(currentHeader.indexOf('Route') > -1)
      this.arrTours = await this.tourService.getEventHistoryRoute(sentData);
    if(currentHeader.indexOf('Device') > -1)
      this.arrTours = await this.tourService.getEventHistoryDevice(sentData);
  }

  async reject(){
    const { sCheckingCode } = this.currentTour;
    let sentData = { CheckingCode: sCheckingCode, Process: 0 };
    let response = await this.tourService.processTourError(sentData);
    console.log(response);
    this.showTourHistoryDataLastSearch();
  }

  async accept(){
    const { sCheckingCode } = this.currentTour;
    let sentData = { CheckingCode: sCheckingCode, Process: 1 };
    let response = await this.tourService.processTourError(sentData);
    console.log(response);
    this.showTourHistoryDataLastSearch();
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
