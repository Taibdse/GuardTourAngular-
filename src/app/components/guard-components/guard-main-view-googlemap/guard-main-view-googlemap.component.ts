import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { GuardService } from '../../../services/guard.service';
import { GoogleMapService } from '../../../services/google-map.service';
import { DataService } from '../../../services/share-data/data.service';

@Component({
  selector: 'app-guard-main-view-googlemap',
  templateUrl: './guard-main-view-googlemap.component.html',
  styleUrls: ['./guard-main-view-googlemap.component.scss']
})

export class GuardMainViewGooglemapComponent implements OnInit {

  @ViewChild('mapArea') mapArea;

  mapCenter: any;
  arrGuardList: any;
  map: any;

  constructor(private commonService: CommonService, 
    private guardService: GuardService, 
    private googleMapService: GoogleMapService, 
    private dataService: DataService) {
    this.mapCenter = this.commonService.CENTER_POS_MAP_VIEW;
  }

  ngOnInit() {
    this.dataService.centerMap.subscribe(center => {
      if(this.map){
        console.log(center);
        this.map.setCenter(new google.maps.LatLng(center[0], center[1]))
        this.map.panTo(new google.maps.LatLng(center[0], center[1]));
        this.map.setZoom(18);
      } 
    })
    this.getGuards();
  }

  async getGuards(){
    this.arrGuardList = await this.guardService.getGuardsData();
    this.buildCurrentMapGuard(this.arrGuardList);
  }

  buildCurrentMapGuard(data){
    let lat = this.mapCenter[0];
    let lng = this.mapCenter[1];
    let { nativeElement } = this.mapArea;
    let mapProp = {
      center: new google.maps.LatLng(lat, lng),
      zoom: 15,
      panControl: true,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: true,
      overviewMapControl: true,
      rotateControl: true
    };
    this.map = new google.maps.Map(nativeElement, mapProp);
    if(!data) return;
    data.forEach(guard => {
      let { dGuardLatCurrent, dGuardLongCurrent, sGuardName, bOnline
      } = guard;
      let mes = `${sGuardName}`;
      let lat = Number(dGuardLatCurrent);
      let lng = Number(dGuardLongCurrent);
      let pos =  new google.maps.LatLng(lat,lng);
      if(bOnline.trim().toLowerCase() == 'online'){
        let icon = './assets/img/Guard.png';
        let marker = this.googleMapService.createMarker(pos, icon);
        marker.setMap(this.map);
        let infoWindow = this.googleMapService.createInfoWindow(mes, null, null);
        infoWindow.open(this.map, marker);
      }
      if(bOnline.trim().toLowerCase() == 'sos'){
        let icon = './assets/img/alert.png';
        let marker = this.googleMapService.createMarker(pos, icon);
        marker.setMap(this.map);
        let infoWindow = this.googleMapService.createInfoWindow(mes, null, null);
        infoWindow.open(this.map, marker);
      }
    })
  }
}
