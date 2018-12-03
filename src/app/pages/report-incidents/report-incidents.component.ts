import { Component, OnInit, ViewChild } from '@angular/core';
import { IncidentService } from '../../services/incident.service';
import { CommonService } from '../../services/common.service';
import { TimeService } from '../../services/time.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-report-incidents',
  templateUrl: './report-incidents.component.html',
  styleUrls: ['./report-incidents.component.scss']
})
export class ReportIncidentsComponent implements OnInit {

  @ViewChild('selectMonth') selectMonth;
  @ViewChild('selectWeek') selectWeek;
  @ViewChild('alertSuccess') alertSuccess;
  @ViewChild('alertError') alertError;
  @ViewChild('modalChart') modalChart;
  @ViewChild('chartArea') chartArea;

  alertErrorContent: string;
  alertSuccessContent: string;

  arrIncidentsID: any;
  arrIncidents: any;
  arrRows: any;
  currentHeaderReport:string;
  arrMonths: any;
  arrColors: any;
  numOfIncidents: number;

  constructor(private incidentService: IncidentService, 
    private commonService: CommonService, 
    private timeService: TimeService) { 
      this.arrMonths = this.commonService.arrMonths;
      this.arrColors = this.commonService.arrColors;
    }

  ngOnInit() {
    // this.showChartIncidentReport('month');
    this.showDataInCurrentMonth();
  }

  async showIncidentReport(type){
    let sentData = { iWeek: 0, iMonth: 0 };
    if(type.toLowerCase() == 'week') 
      sentData.iWeek = this.selectWeek.currentVal;
    else sentData.iMonth = this.selectMonth.currentVal;
    let data = await this.incidentService.reportIncidentWeekOrMonth(sentData);
    this.arrIncidents = this.getIncidentsArr(data);
    this.arrIncidentsID = this.getIncidentsIDArr(data);
    this.arrRows = this.getRowsViolationsByDate(data);
    if(!data) return this.informResult(false, 'No data available!!', 5000);
  }

  async showDataInCurrentMonth(){
    let d = new Date();
    let currentMonth = d.getMonth() + 1;
    let sentData = { iWeek: 0, iMonth: currentMonth };
    let data = await this.incidentService.reportIncidentWeekOrMonth(sentData);
    this.arrIncidents = this.getIncidentsArr(data);
    this.arrIncidentsID = this.getIncidentsIDArr(data);
    this.arrRows = this.getRowsViolationsByDate(data);
  }

  async showChartIncidentReport(type){
    let sentData = { iWeek: 0, iMonth: 0 };
    if(type == 'week') {
      sentData.iWeek = this.selectWeek.currentVal;
      this.currentHeaderReport = `Report in Week ${sentData.iWeek}`;
    }else{
      sentData.iMonth = this.selectMonth.currentVal;
      this.currentHeaderReport = `Report in ${this.arrMonths[Number(sentData.iMonth) - 1]}`;
    }
    let data = await this.incidentService.reportIncidentWeekOrMonthChart(sentData);
    if(!data) return this.informResult(false, 'No data available!!', 5000);
    this.buildReportIncidentWeekOrMonthChart(data, this.currentHeaderReport);
    this.modalChart.show();
  }

  buildReportIncidentWeekOrMonthChart(currentData, title){
    let chartCanvas = document.createElement('canvas');
    chartCanvas.style.width = '100%';
    chartCanvas.height = 300;
    let { nativeElement } = this.chartArea;
    nativeElement.innerHTML = '';
    nativeElement.appendChild(chartCanvas);
    let ctx = chartCanvas.getContext('2d');
    let labels = this.getChartLabelsIncidentReport(currentData);
    let chartData = this.getChartDataSetIncidentWeekOrMonth(currentData);
    //console.log(currentData);
    //console.log(data);
    let colors = this.getColors(currentData.length);
    var chartTime = new Chart(ctx, {
      type: 'pie',
      data: {
          labels: labels,
          datasets: [{
              label: 'Something of Votes',
              data: chartData,
              backgroundColor: colors,
              // borderColor: [],
              borderWidth: 1
          }]
      },
      options:{
        showAllTooltips: false,
        title: {
          display: true,
          text: title,
          fontSize: 20
        },
        tooltips: {
          yAlign: 'bottom',
        },
        pieceLabel: {
          render: 'percentage',
          fontColor: 'white',
          fontSize: 15,
          precision: 1
        },
        hover: {
          mode: 'average',
          intersect: true
        },
      }
    });
    return chartTime;
  }

  getChartDataSetIncidentWeekOrMonth(data){
    return data.map(item => Number(item.Percent));
  }
  
  getChartLabelsIncidentReport(data){
    return data.map(item => item.sAlertContent);
  }

  getColors(l){
    let arr = [];
    for(let i = 0; i < l; i++){
      arr.push(this.arrColors[i]);
    }
    return arr;
  }
  
   getIncidentsArr(data){
    if(!data) return null;
    if(data.length == 0) return null;
    let incidentsSet = new Set(data.map(incident => incident.sAlertContent));
    return Array.from(incidentsSet);
  }
  
   getIncidentsIDArr(data){
    this.numOfIncidents = 0;
    if(!data) return null;
    if(data.length == 0) return null;
    let incidentsSet = new Set(data.map(incident => incident.iAlertContentID));
    this.numOfIncidents = incidentsSet.size;
    return Array.from(incidentsSet);
  }
  
   getRowsViolationsByDate(data){
    if(!data) return null;
    if(data.length == 0) return null;
    let dateSet = new Set(data.map(item => item.dDate));
    let arrRows = []
    dateSet.forEach(value => {
      let arrTemp = data.filter(item => item.dDate == value);
      let acc = arrTemp.reduce((acc, incident, index) => {
        const { sAlertContent, iCountAlert, iAlertContentID } = incident;
        if(index == 0){
          const { sDay, iWeek, dDate } = incident;
          acc.sDay = sDay;
          acc.iWeek = iWeek;
          acc.dDate = dDate;
        }
        if(!acc[iAlertContentID]) {
          acc[iAlertContentID] = 0;
        }
        acc[iAlertContentID] += Number(iCountAlert);
        return acc;
      }, {});
      arrRows.push(acc);
    })
    return arrRows;
  }
  
  getNumOfViolationsByDate(row){
    let sum = 0;
    this.arrIncidentsID.forEach(item => {
      sum += row[item];
    })
    return sum;
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
