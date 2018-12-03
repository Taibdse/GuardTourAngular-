import { Component, OnInit, ViewChild } from '@angular/core';
import { ValidationService } from '../../services/validation.service';
import { GuardService } from '../../services/guard.service';
import { GoogleMapService } from '../../services/google-map.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-setting-security-guard-profile',
  templateUrl: './setting-security-guard-profile.component.html',
  styleUrls: ['./setting-security-guard-profile.component.scss']
})
export class SettingSecurityGuardProfileComponent implements OnInit {

  @ViewChild('modalInsert') modalInsert;
  @ViewChild('modalUpdate') modalUpdate;
  @ViewChild('alertError') alertError;
  @ViewChild('alertSuccess') alertSuccess;
  @ViewChild('alertWarning') alertWarning;
  @ViewChild('selectGroup') selectGroup;
  @ViewChild('selectGroupInsert') selectGroupInsert;
  @ViewChild('selectGroupUpdate') selectGroupUpdate;
  @ViewChild('modalSendSMS') modalSendSMS;
  @ViewChild('modalResetPass') modalResetPass;
  @ViewChild('modalGuardMapCurrentPos') modalGuardMapCurrentPos;
  @ViewChild('mapCurrentGuardPos') mapCurrentGuardPos;

  arrGuardList: any;
  alertErrorContent: string;
  alertSuccessContent: string;
  alertWarningContent: string;
  currentGuard: any = {}

  currentPage: number = 1;

  constructor(private validationService: ValidationService, 
    private guardService: GuardService, 
    private googleMapService: GoogleMapService, 
    private commonService: CommonService) { }

  ngOnInit() {
    this.showGuards();
  }

  async showGuards(){
    let iGroupIDIN = this.selectGroup.currentVal;
    if(!iGroupIDIN) iGroupIDIN = 0;
    let sentData = { iGroupIDIN };
    this.arrGuardList = await this.guardService.getPersonalGuardsInfo(sentData);
    if(!this.arrGuardList) this.informResult(false, 'No data available!!', 4000);
  }

  async deleteGuard(){
    let { iGuardID } = this.currentGuard;
    let sentData = {sGuardNameIN: 0, sGuardPhone: 0, sGuardUsername: 0, sGuardPassword: 0, iGuardIDIN: iGuardID,  iGroupIDIN:0, bStatusIN: 3};
    let res = await this.guardService.inActiveGuard(sentData);
    this.alertWarning.modalWarning.hide();
    this.informResult(true, 'Delete successfully!!!', 4000);
    this.showGuards();
  }

  async updateGuard(){
    let { sGuardName, sGuardPhone, sGuardUserName, iGuardID } = this.currentGuard;
    let iGroupIDIN = this.selectGroupUpdate.currentVal;
    let { valid, errMsg } = this.checkValidation(sGuardName, sGuardUserName, sGuardPhone, 'password');
    if(!valid) return this.informResult(false, errMsg, 4000);  
    let sentData = { sGuardNameIN: sGuardName, sGuardPhone, sGuardUsername: sGuardUserName, sGuardPassword: 0, iGuardIDIN: iGuardID, bStatusIN: 2, iGroupIDIN };
    let res = await this.guardService.updateGuard(sentData);
    this.modalUpdate.hide();
    this.informResult(true, 'Update successfully!!', 4000);
    this.showGuards();
  }

  async insertGuard(){
    let { sGuardName, sGuardPhone, sGuardUserName, sGuardPassword } = this.currentGuard;
    let iGroupIDIN = this.selectGroupInsert.currentVal;
    let { valid, errMsg } = this.checkValidation(sGuardName, sGuardUserName, sGuardPhone, sGuardPassword);
    if(!valid) return this.informResult(false, errMsg, 4000); 
    let sentData = { sGuardNameIN: sGuardName, sGuardPhone, sGuardUsername: sGuardUserName, sGuardPassword, iGuardIDIN: 0, bStatusIN: 1, iGroupIDIN };
    let res = await this.guardService.insertGuard(sentData);
    this.modalInsert.hide();
    this.informResult(true, 'Insert successfully!!!', 4000);
    this.showGuards();
  }

  async sendSMS(){
    const { iGuardID, sMessageContent } = this.currentGuard;
    let sentData = { iGuardID: [iGuardID], sMessageContent };
    let res = await this.guardService.sendSMSToGuards(sentData);
    this.modalSendSMS.hide();
    this.informResult(true, 'Send SMS successfully!!!', 4000);
  }

  async resetPassword(){
    let { pass, repass } = this.currentGuard;
    let { valid, errMsg } = this.validateResetPassword(pass, repass);
    if(!valid) return this.informResult(false, errMsg, 4000); 
    // let sentData = {};
    // let response = await this.guardService.resetGuardPassword(sentData);
    // console.log(response);
    this.informResult(true, 'Reset Password successfully!!!', 4000);
  }

  checkValidation(name, username, phone, password){
    let valid = true;
    let errMsg = '';
    if(name == null || name.trim() == ''){
      valid = false;
      errMsg += 'Name must be filled in, '
    } 
    if(username == null || username.trim() == ''){
      valid = false;
      errMsg += 'Username must be filled in, '
    } 
    if(!/^[0-9]+$/.test(phone)){
      valid = false;
      errMsg += 'Phone must be number, '
    } 
    if(password == null || password.trim().length < 4){
      valid = false;
      errMsg += 'Password must be longer than 4\n'
    } 
    return { valid, errMsg };
  }

  validateResetPassword(pass, repass){
    let errMsg = '';
    let valid = true;
    if(!this.checkPass(pass)){
      valid = false;
      errMsg += 'Password is required and more than 6 characters, '
    }
    if(!this.checkPass(repass)){
      valid = false;
      errMsg += 'Repassword is required and more than 6 characters, '
    }
    if(pass != repass) {
      valid = false;
      errMsg += 'Repassword and password must be the same'
    }
    return { valid, errMsg };
  }

  checkPass(pass){
    if(!this.validationService.checkNotEmpty(pass)) return false;
    if(pass.trim().length < 6 ) return false;
    return true;
  }

  async buildCurrentPosGuardMap(iGuardID, sCheckingCode){
    let sentGuardData = { iGuardID };
    let guardGPSCurrent = await this.guardService.getGuardGPSCurrent(sentGuardData);
    console.log(guardGPSCurrent);
    const { dGuardLatCurrent, dGuardLongCurrent, sMessage, bOnline } = guardGPSCurrent[0];
    let latGuard = Number(dGuardLatCurrent);
    let lngGuard = Number(dGuardLongCurrent);
    let mapProp = this.googleMapService.createMapProp(18, latGuard, lngGuard)
    let { nativeElement } = this.mapCurrentGuardPos;
    let mymap = new google.maps.Map(nativeElement, mapProp);
    
    let urlGuard = './assets/img/Guard.png';
    
    let mainPos = new google.maps.LatLng(latGuard, lngGuard);
    let guardMarker = this.googleMapService.createMarker(mainPos, urlGuard);
  
    guardMarker.setMap(mymap);
    let infoWindowGuard = this.googleMapService.createInfoWindow(sMessage, null, null);
    infoWindowGuard.open(mymap, guardMarker);
    if(!sCheckingCode) return;
    const pointChekingSentData = { iGuardID, sCheckingCode };
    let checkingPointData = await this.guardService.getPointChecking(pointChekingSentData);
    if(!checkingPointData) return;
    checkingPointData.forEach(checkedPoint => {
      let { Lat, Long, Status, Message, ImageUrl } = checkedPoint;
      let url = '';
      switch(Status){
        case 1: 
          url = './assets/img/Checked.png'; 
          break;
        case 2: 
          url = './assets/img/None.png'; 
          break;
        case 3: 
          url = './assets/img/Waiting.png'; 
          break;
        case 4: 
          url = './assets/img/error.png'; 
          break;
      }
      let pos = new google.maps.LatLng(Lat, Long);
      let marker = this.googleMapService.createMarker(pos, url);
      marker.setMap(mymap);
      let mes = Message;
      if(Status == 4){
        let { APP_DOMAIN } = this.commonService
        mes = `${Message}<br><img src="${APP_DOMAIN}${ImageUrl}" class="img-fluid">`
        let infoWindow = this.googleMapService.createInfoWindow(mes, null, null);
        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.open(mymap, marker);
        });
      }else{
        let infoWindow = this.googleMapService.createInfoWindow(mes, null, null);
        infoWindow.open(mymap, marker);
      }
    })
  }

  showModalGuardCurrentPos(guard){
    let { iGuardID } = guard;
    this.buildCurrentPosGuardMap(iGuardID, null);
    this.modalGuardMapCurrentPos.show();
  }

  showInsertModal(){
    this.currentGuard = {};
    this.modalInsert.show();
  }

  showUpdateModal(guard){
    this.currentGuard = Object.assign({}, guard);
    let { iGuardGroupID } = guard;
    this.selectGroupUpdate.currentVal = iGuardGroupID;
    this.modalUpdate.show();
  }

  showConfirmDelete(guard){
    this.currentGuard = Object.assign({}, guard);
    this.alertWarningContent = 'Are you sure?';
    this.alertWarning.modalWarning.show();
  }

  showSMSModal(guard){
    this.currentGuard = Object.assign({}, guard);
    this.modalSendSMS.show();
  }

  showModalResetPass(guard){
    this.currentGuard = Object.assign({}, guard);
    this.modalResetPass.show();
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
