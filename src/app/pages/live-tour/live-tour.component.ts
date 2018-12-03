import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { TourService } from '../../services/tour.service';
import { GuardService } from '../../services/guard.service';
import { CommonService } from '../../services/common.service';
import { GoogleMapService } from '../../services/google-map.service';
@Component({
  selector: 'app-live-tour',
  templateUrl: './live-tour.component.html',
  styleUrls: ['./live-tour.component.scss']
})
export class LiveTourComponent implements OnInit {

  arrTourList: any;
  arrTourDetailsList: any;
  alertErrorContent: string;
  alertSuccessContent: string;
  arrTourDetails: any;
  currentPage: number = 1;
  
  constructor(private tourService: TourService, 
    private commonService: CommonService, 
    private googleMapService: GoogleMapService, 
    private guardService: GuardService ) { }

  @ViewChild('selectGuardList') selectGuardList;
  @ViewChild('selectRouteList') selectRouteList;
  @ViewChild('selectDeviceList') selectDeviceList;
  @ViewChild('modalTourDetails') modalTourDetails;
  @ViewChild('modalMap') modalMap;
  @ViewChild('mapTour') mapTour;
  @ViewChild('alertError') alertError;
  @ViewChild('alertSuccess') alertSuccess;

  ngOnInit() {
    console.log(this.selectGuardList);
    this.showTourListByDefault();
  }

  async showTourListByDefault(){
    let sentData = { iKindSearch: 0, iID: 0};
    this.arrTourList = await this.tourService.getLiveTour(sentData);
  }

  showMes(detail){
    let { sStatus, sGuardName, dDateTimeHistory } = detail;
    let mes = '';
    if(sStatus == 'Checked') mes = `${sGuardName} checked at ${dDateTimeHistory}`;
    return mes;
  }

  async showEventHistoryDetails(checkingCode){
    let sentData = { CheckingCode: checkingCode };
    this.arrTourDetailsList = await this.tourService.getEventHistoryDetails(sentData);
    if(this.arrTourDetailsList) return this.modalTourDetails.show();
    this.informResult(false, 'No data available!!!', 4000);
  }

  async showLiveTourData($event, type){
    let sentData = { iKindSearch: 0, iID: $event};
    if(type.toLowerCase() == 'guard') sentData.iKindSearch = 1;
    else if(type.toLowerCase() == 'route') sentData.iKindSearch = 2;
    else if(type.toLowerCase() == 'device') sentData.iKindSearch = 3;
    this.arrTourList = await this.tourService.getLiveTour(sentData);
    if(!this.arrTourList) this.informResult(false, 'No data available!!!', 4000);
  }

  async showEventDetailsMap(checkingCode) {
    let data = await this.tourService.getEventHistoryDetails(checkingCode);
    let sentData = { CheckingCode: checkingCode };
    let dataTracking = await this.guardService.getGuardTrackingbyTour(sentData);
    this.buildEventDetailsMap(data, dataTracking);
    this.modalMap.show();
  }

  buildEventDetailsMap(data, dataTracking){
    let { CENTER_POS_MAP_VIEW } = this.commonService;
    let lat = CENTER_POS_MAP_VIEW[0];
    let lng = CENTER_POS_MAP_VIEW[1];
    let mapProp = this.googleMapService.createMapProp(16, lat, lng);
    let { nativeElement } = this.mapTour;
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
