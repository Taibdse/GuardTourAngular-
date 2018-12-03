import { Component, OnInit, ViewChild } from '@angular/core';
import { IncidentService } from '../../services/incident.service';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-setting-incident',
  templateUrl: './setting-incident.component.html',
  styleUrls: ['./setting-incident.component.scss']
})
export class SettingIncidentComponent implements OnInit {
  @ViewChild('modalUpdateIncident') modalUpdateIncident;
  @ViewChild('modalInsertIncident') modalInsertIncident;
  @ViewChild('alertError') alertError;
  @ViewChild('alertSuccess') alertSuccess;
  @ViewChild('alertWarning') alertWarning;

  arrIncidents: any;
  alertErrorContent: string;
  alertSuccessContent: string;
  alertWarningContent: string;
  currentUpdateInicdent: any = {};
  currentDeleteIncident: any = {};
  txtInsertIncidentContent: string;

  currentPage: number = 1;

  constructor(private incidentService: IncidentService, 
    private validationService: ValidationService) {
    
  }

  ngOnInit() {
    this.showIncidents();
  }

  async showIncidents(){
    this.arrIncidents = await this.incidentService.getIncidentContent();
    if(!this.arrIncidents) {
      this.alertErrorContent = 'No data available!!!';
      this.alertError.modalError.show();
    }
  }

  showModalUpdateIncident(incident){
    this.currentUpdateInicdent = Object.assign({}, incident);
    this.modalUpdateIncident.show();
  }

  showModalInsertIncident(){
    this.txtInsertIncidentContent = '';
    this.modalInsertIncident.show();
  }

  async insertIncident(){
    if(this.txtInsertIncidentContent.trim() == '') return;
    let sAlertContent = this.txtInsertIncidentContent;
    let sentData = { sAlertContent, iAlertContentID: 0, bStatusIN: 1 };
    let res = await this.incidentService.insertIncident(sentData);
    this.alertSuccessContent = 'Insert Successfully!!';
    this.alertSuccess.modalSuccess.show();
    this.txtInsertIncidentContent = '';
    this.modalInsertIncident.hide();
    this.showIncidents();
  }

  updateIncident(){
    let sAlertContent = this.currentUpdateInicdent.sAlertContent
    let iAlertContentID = this.currentUpdateInicdent.iAlertContentID;
    if(sAlertContent.trim() == '') return;
    let sentData = { sAlertContent, iAlertContentID, bStatusIN: 2 };
    let res = this.incidentService.updateIncident(sentData);
    this.alertSuccessContent = 'Update Successfully!!';
    this.alertSuccess.modalSuccess.show();
    this.currentUpdateInicdent = {};
    this.modalUpdateIncident.hide();
    this.showIncidents();
  }

  showConfirmDeleteIncident(incident){
    this.alertWarningContent = 'Are you sure?';
    this.alertWarning.modalWarning.show();
    this.currentDeleteIncident = Object.assign({}, incident);
  }

  async deleteIncident(){
    let { iAlertContentID } = this.currentDeleteIncident;
    let sentData = { iAlertContentID, sAlertContent: 0, bStatusIN: 3 };
    let res = await this.incidentService.deleteIncident(sentData);
    this.alertSuccessContent = 'Deleted Successfully!!';
    this.alertSuccess.modalSuccess.show();
    this.alertWarning.modalWarning.hide();
    this.showIncidents();
  }

}
