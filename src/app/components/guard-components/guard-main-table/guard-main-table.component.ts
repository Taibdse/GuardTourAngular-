import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { GuardService } from '../../../services/guard.service';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/share-data/data.service';
@Component({
  selector: 'app-guard-main-table',
  templateUrl: './guard-main-table.component.html',
  styleUrls: ['./guard-main-table.component.scss']
})

export class GuardMainTableComponent implements OnInit {
  @ViewChild('txtSearchGuardName') txtSearchGuardName;
  @ViewChild('selectGroupList') selectGroupList;
  @ViewChild('modalSendSMS') modalSendSMS;
  @ViewChild('alertSuccess') alertSuccess;
  @ViewChild('alertError') alertError;
  @ViewChild('alertWarning') alertWarning;

  arrGuardList: any = [];
  arrFilteredGuardList: any = [];
  checkedAll: boolean = false;
  onlineNum: number;
  sosNum: number;
  sentMessage: string;
  strSMSGuardNames: string;
  arrSMSGuards: any;
  

  constructor(private guardService: GuardService, private commonService: CommonService, private dataService: DataService) { }

  ngOnInit() {
    this.showGuards();
  }

  isSOS(g){
    return g.bOnline.toLowerCase() == 'sos';
  }

  isOnline(g){
    return g.bOnline.toLowerCase() == 'online';
  }

  async showGuards(){
    let data = await this.guardService.getGuardsData();
    if(!data) return;
    this.arrGuardList = data.map(g => {
      g.checked = false;
      return g;
    });
    this.arrFilteredGuardList = this.arrGuardList.slice();
    this.sosNum = this.arrGuardList.filter(g => this.isSOS(g)).length;
    this.onlineNum = this.arrGuardList.filter(g => this.isOnline(g)).length;
  } 

  checkGuard($event, guard){
    if(this.isOnline(guard) || this.isSOS(guard)){
      let lat = Number(guard.dGuardLongCurrent);
      let lng = Number(guard.dGuardLatCurrent);
      this.dataService.changeCenterMap([lat, lng]);
    }
    if(!$event.checked) this.checkedAll = false;
  }

  checkAll($event){
    this.arrFilteredGuardList.forEach(g => g.checked = $event.checked);
  }

  filterByName(arr){
    let name = this.txtSearchGuardName.nativeElement.value;
    if(!name) return arr.slice();
    if(name.trim() == '') return arr.slice();
    return arr.filter(g => {
      name = this.commonService.removeUnicode(name).toLowerCase();
      let guardName = this.commonService.removeUnicode(g.sGuardName).toLowerCase();
      return guardName.indexOf(name) > -1;
    })
  }

  filterByGroup(arr){
    let groupId = this.selectGroupList.currentVal;
    if(groupId == '0') return arr.slice();
    return arr.filter(g => g.iGuardGroupID == groupId);
  }

  filterGuardsList(){
    let list = this.filterByName(this.arrGuardList);
    this.arrFilteredGuardList = this.filterByGroup(list);
    if(this.checkedAll) this.arrFilteredGuardList.forEach(g => g.checked);
  }

  showModalSendSMS(){
    this.arrSMSGuards = this.arrFilteredGuardList.filter(g => {
      return (this.isOnline(g) || this.isSOS(g)) && g.checked;
    })
    if(this.arrSMSGuards.length == 0) return this.alertError.modalError.show();
    this.showSMSGuardNamesStr(this.arrSMSGuards);
    this.sentMessage = '';
    this.modalSendSMS.show();
  }

  showSMSGuardNamesStr(arr){
    let str = '';
    arr.forEach(g => {
      str += g.sGuardName + ', ';
    })
    str = str.substring(0, str.length - 2);
    this.strSMSGuardNames = str;
  }

  async sendMessage(){
    let sMessageContent = this.sentMessage;
    let arrID = [];
    this.arrSMSGuards.forEach(g => arrID.push(g.iGuardId));
    let sentData =  { sMessageContent, iGuardID: arrID };
    let res = await this.guardService.sendSMSToGuards(sentData);
    this.alertSuccess.modalSuccess.show();
    this.modalSendSMS.hide();
  }

  showModalConfirm(){
    this.arrSMSGuards = this.arrFilteredGuardList.filter(g => {
      return (this.isOnline(g) || this.isSOS(g)) && g.checked;
    })
    if(this.arrSMSGuards.length == 0) return this.alertError.modalError.show();
    this.alertWarning.modalWarning.show();
  }

  async checkTime(){
    this.alertWarning.modalWarning.hide();
    let arrID = [];
    this.arrSMSGuards.forEach(g => arrID.push(g.iGuardId));
    let sentData = { iGuardID: arrID };
    let res = await this.guardService.checkTime(sentData);
    this.alertSuccess.modalSuccess.show();
  }

}
