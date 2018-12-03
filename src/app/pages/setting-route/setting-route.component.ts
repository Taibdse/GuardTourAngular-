import { Component, OnInit, ViewChild } from '@angular/core';
import { ValidationService } from '../../services/validation.service';
import { RouteService } from '../../services/route.service';
import { PointService } from '../../services/point.service';
import { GoogleMapService } from '../../services/google-map.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-setting-route',
  templateUrl: './setting-route.component.html',
  styleUrls: ['./setting-route.component.scss']
})
export class SettingRouteComponent implements OnInit {

  @ViewChild('modalInsert') modalInsert;
  @ViewChild('modalUpdate') modalUpdate;

  @ViewChild('alertError') alertError;
  @ViewChild('alertSuccess') alertSuccess;
  @ViewChild('alertWarning') alertWarning;

  @ViewChild('selectGroup') selectGroup;
  @ViewChild('selectZones') selectZones;
  @ViewChild('selectGroupInsert') selectGroupInsert;
  @ViewChild('selectGroupUpdate') selectGroupUpdate;

  @ViewChild('selectDeviceInsert') selectDeviceInsert;
  @ViewChild('selectDeviceUpdate') selectDeviceUpdate;

  @ViewChild('mapCurrentGuardPos') mapCurrentGuardPos;
  @ViewChild('routeMapArea') routeMapArea;
  @ViewChild('routeMapModal') routeMapModal;
  @ViewChild('modalMap') modalMap;
  @ViewChild('matCheckbox') matCheckbox;

  arrPointsOnZone: any;
  arrSelectedPointsOnRoute: any = [];
  arrRoutesOnZone: any;
  currentRoute: any = {}
  arrCreatedRoutesData: any = [];

  alertErrorContent: string;
  alertSuccessContent: string;
  alertWarningContent: string;

  currentPage: number = 1;
  routeMap: any;

  mapCenter: any;
  currentSeletedRoutePolyline: any;
  iconChecked = './assets/img/Checked.png';
  iconRoutePoint = './assets/img/point.png';
  arrSelectedRouteMarkers: any = [];

  checkbox: boolean = true;

  arrColors: any;

  currentDistance: number;

  sortableListStyle = {
    width:'100%', //width of the list defaults to 300,
    height: '50vh', //height of the list defaults to 250,
    dropZoneHeight: '0px' // height of the dropzone indicator defaults to 50
  }

  constructor(private validationService: ValidationService, 
    private googleMapService: GoogleMapService, 
    private commonService: CommonService, 
    private pointService: PointService, 
    private routeService: RouteService) { 
      this.mapCenter = this.commonService.CENTER_POS_MAP_VIEW;
      this.arrColors = this.commonService.arrColors;
    }

  async ngOnInit() {
    await this.showPointsOnZone();
    this.showRoutesOnZone();
    this.showRouteMap();
    // console.log(this.matCheckbox);
  }

  async insertRoute(){
    let iDeviceID = this.selectDeviceInsert.currentVal;
    let iZoneID = this.selectZones.currentVal;
    let { sRouteName, iSpeed, iMinTime, iTimeComplete, iTourExecute, iBreakTime, dDistance, type } = this.currentRoute;
    let { errMsg, valid } = this.validateRouteData(sRouteName, iSpeed, iMinTime, iTimeComplete, iTourExecute, iBreakTime)
    if(!valid) return this.informResult(false, errMsg, 6000); 
    let arr_1 = this.arrSelectedPointsOnRoute.map((p, index) => {
      const { iPointID } = p;
      return { PointID: iPointID, No: index + 1 }
    })
    let arrPoints = arr_1.slice();
    if(type != 'circle') {
      let arr_1_copy = arr_1.map(item => Object.assign({}, item));
      let arr_2 = arrPoints.concat(arr_1_copy.reverse());
      arr_2.splice(arr_1.length, 1);
      arr_2.forEach((item, index) => {
        if(index > arr_1.length - 1) {
          item.No = index + 1
        }
      })
      arrPoints = arr_2;
    }
    let sentData = { iRouteID: 0, sRouteName, iBreakTime, bStatusIN: 1, Point: arrPoints, dDistance, iSpeed, iMinTime, iTimeComplete, iTourExecute, iDeviceID, iZoneID };

    let response = await this.routeService.saveRoute(sentData);
    this.informResult(true, 'Insert Successfully!!', 5000);
    this.handleChangeZone();
  }

  showMinTime(e){
    let val = e.target.value;
    let { dDistance } = this.currentRoute;
    if(!this.validationService.checkPositiveNum(val)) return this.currentRoute.iMinTime = '';
    let speed = Number(val);
    this.currentRoute.iMinTime = Math.floor(dDistance/speed * 60);
  }

  showTourExecute(e){
    let val = e.target.value;
    let { iTimeComplete } = this.currentRoute;
    if(!this.validationService.checkPositiveNum(val) || !this.validationService.checkPositiveNum(iTimeComplete)) {
      return this.currentRoute.iTourExecute = '';
    }
    this.currentRoute.iTourExecute = Math.floor(1440/(Number(val) + Number(iTimeComplete)));
  }

  changeRouteType(e){
    let val = e.target.value;
    this.currentRoute.type = val;
  }

  async updateRoute(){
    const { iRouteID, iDeviceID, iTimeComplete, iMinTime, iSpeed, sRouteName, iTourExecute, iBreakTime } = this.currentRoute;
    let { errMsg, valid } = this.validateRouteData(sRouteName, iSpeed, iMinTime, iTimeComplete, iTourExecute, iBreakTime);
    if(!valid) return this.informResult(false, errMsg, 5000);
    let sentData = { iDeviceID, iBreakTime, iRouteID, iSpeed, iTimeComplete, sRouteName, dDistance: 0, iMinTime, iTourExecute, iZoneID: 0, Point: null, bStatusIN: 2 };
    let response = await this.routeService.updateRouteDetail(sentData);
    this.handleChangeZone();
    this.informResult(true, 'Updated Successfully!!', 5000);
  }

  async showRouteMapOnModal(route){
    const { iRouteID } = route;
    let sentData = { iRouteID };
    let data = await this.routeService.getRouteDetailsData(sentData);
    this.buildRouteMapOnModal(data);
    this.modalMap.show();
  }

  buildRouteMapOnModal(data){
    let latCenter = this.mapCenter[0];
    let lngCenter = this.mapCenter[1];
    let mapProp = this.googleMapService.createMapProp(16, latCenter, lngCenter);
    let { nativeElement } = this.routeMapModal;
    let mymap = new google.maps.Map(nativeElement, mapProp);
    let icon = './assets/img/Checked.png';
    if(data){
      let arrPointsCoordination = [];
      data.forEach((point, index) => {
        const { dPointLat, dPointLong } = point;
        let type = this.getPointType(point);
        let lat = Number(dPointLat);
        let lng = Number(dPointLong);
        let pos = new google.maps.LatLng(lat, lng);
        let mes = `${index + 1} - ${type}`;
        arrPointsCoordination.push([lat, lng])
        let marker = this.googleMapService.createMarker(pos, icon);
        marker.setMap(mymap);
        let infoWindow = this.googleMapService.createInfoWindow(mes, null, null);
        infoWindow.open(mymap, marker);
      })
      let path = arrPointsCoordination.map(point => {
        return new google.maps.LatLng(point[0], point[1]);
      });
      let polyline = this.googleMapService.createPolyline(path);
      polyline.setMap(mymap);
    }
  }

  validateRouteData(name, speed, min, max, tourEx, iBreakTime){
    let errMsg = '';
    let valid = true;
    let { validationService } = this;
    if(!validationService.checkNotEmpty(name)) {
      errMsg += 'Name is required!!\n';
      valid = false;
    }
    if(!validationService.checkPositiveNum(speed)) {
      errMsg += 'Speed must be positive number!!\n';
      valid = false;
    }
    if(!validationService.checkPositiveNum(min)) {
      errMsg += 'Min Time must be positive number!!\n';
      valid = false;
    }
    if(!validationService.checkPositiveNum(max)) {
      errMsg += 'Time Completion must be positive number!!\n';
      valid = false;
    }
    if(!validationService.checkPositiveNum(tourEx)) {
      errMsg += 'TourExecute must be positive number!!\n';
      valid = false;
    }
    if(!validationService.checkPositiveNum(iBreakTime)) {
      errMsg += 'BreakTime must be positive number!!\n';
      valid = false;
    }
    return { errMsg, valid };
  }

  async deleteRoute(){
    this.alertWarning.modalWarning.hide();
    const { iRouteID } = this.currentRoute;
    let sentData = { iRouteID: iRouteID, iBreakTime: 0, bStatusIN: 3, sRouteName: 0, Point: null, iZoneID: 0, iTimeComplete: 0, dDistance: 0, iMinTime: 0, iTourExecute: 0, iDeviceID:0, iSpeed:0};
    let response = await this.routeService.deleteRoute(sentData);
    console.log(response);
    this.informResult(true, 'Locked Successfully!!', 4000);
    this.handleChangeZone();
  }

  handleChangeZone(){
    this.showPointsOnZone();
    this.showRoutesOnZone();
    this.showRouteMap();
  }

  getPointType(point){
    const { iQRCode, iRFID } = point;
    let type = 'GPS';
    if(iQRCode != '') type = 'QRCode';
    if(iRFID != '') type = 'RFID';
    return type;
  }

  async showPointsOnZone(){
    let iZoneID = this.selectZones.currentVal;
    if(!iZoneID) iZoneID = 1;
    let sentData = { iZoneID };
    let data = await this.pointService.getPointsDataOnZone(sentData);
    if(data) this.arrPointsOnZone = data.map(p => {
      p.type = this.getPointType(p);
      p.checked = false;
      return p;
    })
    else this.arrPointsOnZone = [];
    this.arrSelectedPointsOnRoute.length = 0;
  }

  async showRoutesOnZone(){
    let iZoneID = this.selectZones.currentVal;
    if(!iZoneID) iZoneID = 0;
    let sentData = { iZoneID };
    this.arrRoutesOnZone = await this.routeService.getRoutesOnZone(sentData);
  }

  async showRouteMap(){
    let iZoneID = this.selectZones.currentVal;
    if(!iZoneID) iZoneID = 0;
    let sentData = { iZoneID };
    this.arrCreatedRoutesData = await this.routeService.getRouteCreatedData(sentData);
    console.log(this.arrCreatedRoutesData);
    let latCenter = this.mapCenter[0];
    let lngCenter = this.mapCenter[1];
    let mapProp = this.googleMapService.createMapProp(16, latCenter, lngCenter);
    let { nativeElement } = this.routeMapArea;
    this.routeMap = new google.maps.Map(nativeElement, mapProp);
    this.buildCurrentSelectedRoutePolyline();
    this.buildRoutesOnZonePolyline();
  }

  buildCurrentSelectedRoutePolyline(){
    if(!this.arrSelectedPointsOnRoute) return;
    if(this.currentSeletedRoutePolyline)        
      this.currentSeletedRoutePolyline.setMap(null);
    this.currentSeletedRoutePolyline = this.buildPolylineRoute(this.arrSelectedPointsOnRoute, this.iconRoutePoint, 'red', true);
  }

  buildRoutesOnZonePolyline(){
    if(!this.arrCreatedRoutesData) return;
    this.arrCreatedRoutesData.forEach((route, index) => {
      let arrPoints = JSON.parse(route.PointObject);
      let color = this.arrColors[index];
      this.buildPolylineRoute(arrPoints, this.iconChecked, color, false);
    })
  }
  
  buildPolylineRoute(data, icon, strokeColor, isCurrentPolyline){
    if(this.arrSelectedRouteMarkers.length > 0){
      this.arrSelectedRouteMarkers.forEach(marker => {
        marker.setMap(null);
      })
    }
    let arrPointsCoordination = [];
    this.arrSelectedRouteMarkers.length = 0;
    if(!data) return;
    data.forEach((point, index) => {
      const { dPointLat, dPointLong, iNo } = point;
      let type = this.getPointType(point);
      let lat = Number(dPointLat);
      let lng = Number(dPointLong);
      let pos = new google.maps.LatLng(lat, lng);
      let mes = `${iNo} - ${type}`;
      arrPointsCoordination.push([lat, lng])
      let marker = this.googleMapService.createMarker(pos, icon);
      marker.setMap(this.routeMap);
      if(isCurrentPolyline) this.arrSelectedRouteMarkers.push(marker);
      let infoWindow = this.googleMapService.createInfoWindow(mes, null,null);
      marker.addListener('click', () => {
        infoWindow.open(this.routeMap, marker);
      })
    })
    let path = arrPointsCoordination.map(point => {
      return new google.maps.LatLng(point[0], point[1]);
    });
    let polyline = this.googleMapService.createPolyline(path, strokeColor);
    polyline.setMap(this.routeMap);
    return polyline;
  }

  showSelectedPoints(){
    this.arrSelectedPointsOnRoute = this.arrPointsOnZone.filter(p => p.checked);
    this.buildCurrentSelectedRoutePolyline();
  }

  showInsertModal(){
    if(this.arrSelectedPointsOnRoute.length < 3) return this.informResult(false, 'No route selected!!', 5000);
    let distance = this.googleMapService.calDistanceOfRoute(this.arrSelectedPointsOnRoute);
    let dDistance = Number(distance.toFixed(2))
    this.currentRoute = { type: true, dDistance };
    this.modalInsert.show();
  }

  showUpdateModal(route){
    this.currentRoute = Object.assign({}, route);
    let { iDeviceID } = route;
    this.selectDeviceUpdate.currentVal = iDeviceID;
    this.modalUpdate.show();
  }

  showConfirmDelete(route){
    this.currentRoute = Object.assign({}, route);
    this.alertWarningContent = 'Are you sure?';
    this.alertWarning.modalWarning.show();
  }

  informResult(success, content, timeout){
    if(!timeout) timeout = 4000;
    this.alertSuccessContent = content;
    let modal = this.alertSuccess.modalSuccess;
    if(!success){
      this.alertErrorContent = content;
      modal = this.alertError.modalError;
    }
    modal.show();
    setTimeout(() => {
      if(!modal.isShown) return;
      modal.hide();
      modal = null;
    }, timeout);
  }

  listSorted(e){
    // console.log(e);
    this.buildCurrentSelectedRoutePolyline();
    console.log(123);
  }

  removeSelectedPoint(point){
    let { iPointID } = point;
    let p = this.arrPointsOnZone.find(p => p.iPointID == iPointID)
    p.checked = false;
    this.showSelectedPoints();
  }



}
