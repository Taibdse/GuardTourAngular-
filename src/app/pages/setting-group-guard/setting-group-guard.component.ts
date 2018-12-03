import { Component, OnInit, ViewChild } from '@angular/core';
import { GuardGroupService } from '../../services/guard-group.service';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-setting-group-guard',
  templateUrl: './setting-group-guard.component.html',
  styleUrls: ['./setting-group-guard.component.scss']
})
export class SettingGroupGuardComponent implements OnInit {

  @ViewChild('modalInsert') modalInsert;
  @ViewChild('modalUpdate') modalUpdate;
  @ViewChild('alertError') alertError;
  @ViewChild('alertSuccess') alertSuccess;
  @ViewChild('alertWarning') alertWarning;
  @ViewChild('selectGuardInsert') selectGuardInsert;
  @ViewChild('selectGuardUpdate') selectGuardUpdate;

  arrGroupList: any;
  alertErrorContent: string;
  alertSuccessContent: string;
  alertWarningContent: string;
  currentGroup: any = {}

  currentPage: number = 1;

  constructor(private guardGroupService: GuardGroupService, 
    private validationService: ValidationService) { }

  ngOnInit() {
    this.showGroups();
  }

  async showGroups(){
    this.arrGroupList = await this.guardGroupService.getGroupData();
    if(!this.arrGroupList){
      this.alertErrorContent = 'No data available!!';
      this.alertError.modalError.show();
    }
  }

  informSuccess(content){
    this.alertSuccessContent = content;
    this.alertSuccess.modalSuccess.show();
  }

  async deleteGroup(){
    let { iGuardGroupID, iGuardIDLeader, sGroupName } = this.currentGroup;
    let sentData = { iGroupIDIN: iGuardGroupID, iGuardIDIN: iGuardIDLeader, sGroupNameIN: sGroupName, bStatusIN: 3 }
    let res = await this.guardGroupService.deleteGroup(sentData);
    this.alertWarning.modalWarning.hide();
    this.informSuccess('Delete successfully!!!');
    this.showGroups();
  }

  async updateGroup(){
    let { sGroupName, iGuardGroupID } = this.currentGroup;
    let iGuardIDIN = this.selectGuardUpdate.currentVal;
    if(!this.validationService.checkNotEmpty(sGroupName)) {
      this.alertErrorContent = 'Group name must be defined!!';
      this.alertError.modalError.show();
    }else{
      let sentData = { sGroupNameIN: sGroupName, iGuardIDIN, iGroupIDIN: iGuardGroupID, bStatusIN: 2 };
      let res = await this.guardGroupService.updateGroup(sentData);
      this.modalUpdate.hide();
      this.informSuccess('Update successfully!!');
      this.showGroups();
    }
  }

  async insertGroup(){
    let { sGroupName } = this.currentGroup;
    let iGuardIDIN = this.selectGuardInsert.currentVal; 
    if(!this.validationService.checkNotEmpty(sGroupName)){
      this.alertErrorContent = 'Group name must be defined!!';
      this.alertError.modalError.show();
    }else{
      let sentData = { sGroupNameIN: sGroupName, iGuardIDIN, iGroupIDIN: 0, bStatusIN: 1 };
      let res = await this.guardGroupService.insertGroup(sentData);
      this.modalInsert.hide();
      this.informSuccess('Insert successfully!!!');
      this.showGroups();
    }
  }

  showInsertModal(){
    this.currentGroup = {};
    this.modalInsert.show();
  }

  showUpdateModal(group){
    let { iGuardID } = group;
    this.currentGroup = Object.assign({}, group);
    this.selectGuardUpdate.currentVal = iGuardID;
    this.modalUpdate.show();
  }

  showConfirmDelete(group){
    this.currentGroup = Object.assign({}, group);
    this.alertWarningContent = 'Are you sure?';
    this.alertWarning.modalWarning.show();
  }

}
