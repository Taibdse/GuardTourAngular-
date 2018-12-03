import { Component, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js';
import { TourService } from '../../services/tour.service';
import { CommonService } from '../../services/common.service';
import { ChartService } from '../../services/chart.service';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-report-patrolling',
  templateUrl: './report-patrolling.component.html',
  styleUrls: ['./report-patrolling.component.scss']
})
export class ReportPatrollingComponent implements OnInit {

  @ViewChild('selectRoute') selectRoute;
  @ViewChild('selectWeek') selectWeek;
  @ViewChild('selectMonth') selectMonth;
  @ViewChild('selectYear') selectYear;
  @ViewChild('alertSuccess') alertSuccess;
  @ViewChild('alertError') alertError;
  @ViewChild('chartPatrollingArea') chartPatrollingArea;
  @ViewChild('chartTimeArea') chartTimeArea;

  alertErrorContent: string;
  alertSuccessContent: string;

  arrCriterias = ['Performance Route', 'Performance Timing', 'Performance Routing', 'Overall Performance', 'Working Time', 'Idling Time', 'Spot check'];

  arrReportData: any = [];
  arrHeaders: any = [];
  arrRows: any = [];

  arrDataChartWorkingTimeVsIdlingTime: any = [];
  arrDataChartWeeklyPatrollingPerformance: any = [];
  arrLabelsChartWorkingTimeVsIdlingTime: any = [];

  constructor(private tourService: TourService, 
    private commonService: CommonService, 
    private chartService: ChartService, 
    private reportService: ReportService) { }
  

  ngOnInit() {
    this.showData('week');
  }

  async showData(type){
    let iRouteID = this.selectRoute.currentVal;
    let sentData = { iRouteID, iWeek: 0, iMonth: 0, iYear:0 };
    if(type == 'week')
      sentData.iWeek = this.selectWeek.currentVal;
    else if(type == 'month')
      sentData.iMonth = this.selectMonth.currentVal;
    else if(type == 'year')
      sentData.iYear = this.selectYear.currentVal;
    this.arrReportData = await this.reportService.getReportPerformanceChart(sentData);
    this.getHeaders();
    this.getRowsData()
    this.getChartData(this.arrReportData);
    this.buildChartWeeklyPatrollingPerformance();
    this.buildChartWorkingTimeVsIdlingTime();
    if(!this.arrReportData) this.informResult(false, 'No data available!!', 4000);
  }

  getHeaders(){
    this.arrHeaders.length = 0;
    if(!this.arrReportData) return;
    this.arrHeaders = this.arrReportData.map(item => item.dWeek);
  }

  getRowsData(){
    this.arrRows.length = 0;
    if(!this.arrReportData) return;
    let data = this.arrReportData;
    this.arrCriterias.forEach((item, index) => {
      let rowData = [];
      if(index == 0){
        rowData = data.map(item => item.dPerformance_Routes);
        rowData.unshift(this.arrCriterias[0]);
      }else if(index == 1){
        rowData = data.map(item => item.dPerformance_Timing);
        rowData.unshift(this.arrCriterias[1]);
      }else if(index == 2){
        rowData = data.map(item => item.dPerformance_Routing);
        rowData.unshift(this.arrCriterias[2]);
      }else if(index == 3){
        rowData = data.map(item => item.dOverall_performance);
        rowData.unshift(this.arrCriterias[3]);
      }else if(index == 4){
        rowData = data.map(item => item.dWorking_Time);
        rowData.unshift(this.arrCriterias[4]);
      }else if(index == 5){
        rowData = data.map(item => item.dIdling_Time_in);
        rowData.unshift(this.arrCriterias[5]);
      }else if(index == 6){
        rowData = data.map(item => '');
        rowData.unshift(this.arrCriterias[6]);
      }
      this.arrRows.push(rowData);
    })
  }

  getChartData(data){
    this.arrDataChartWorkingTimeVsIdlingTime.length = 0;
    this.arrDataChartWeeklyPatrollingPerformance.length = 0;
    this.arrLabelsChartWorkingTimeVsIdlingTime.length = 0;
    if(!data) return;
    data.forEach(weekData => {
      const { dIdling_Time_in, dWorking_Time, dWeek, dPerformance_Routes, dPerformance_Timing, dPerformance_Routing, dOverall_performance } = weekData;
  
      this.arrDataChartWorkingTimeVsIdlingTime.push([
        Number(dIdling_Time_in), 
        Number(dWorking_Time)]);
  
      this.arrLabelsChartWorkingTimeVsIdlingTime.push(dWeek);
  
      this.arrDataChartWeeklyPatrollingPerformance.push([
        Number(dPerformance_Routes), 
        Number(dPerformance_Timing), 
        Number(dPerformance_Routing), 
        Number(dOverall_performance)]);
    })
  }
  
  buildChartWeeklyPatrollingPerformance(){
    let { nativeElement } = this.chartPatrollingArea;
    nativeElement.innerHTML = '';
    if(!this.arrReportData) return;
    let chartCanvas = document.createElement('canvas');
    chartCanvas.style.width = '100%';
    chartCanvas.height = 450;
    nativeElement.appendChild(chartCanvas);
    let ctx = chartCanvas.getContext('2d');
    // ctx.height(500);
    let bgColor1 = 'rgba(255, 99, 132, 0.2)';
    let bgColor2 = 'rgba(75, 192, 192, 0.2)';
    let bgColor3 = 'rgba(153, 102, 255, 0.2)';
    let bgColor4 = 'rgba(255, 159, 64, 0.2)';
  
    let borderColor1 = 'rgba(75, 192, 192, 1)';
    let borderColor2 = 'rgba(153, 102, 255, 1)';
    let borderColor3 = 'rgba(255, 159, 64, 1)';
    let borderColor4 = 'red';
  
    var chartPatroll = new Chart(ctx, {
      type: 'line',
      data: {
          labels: this.arrLabelsChartWorkingTimeVsIdlingTime,
          datasets: [{
            label: "Performance Routes",
            backgroundColor: borderColor1,
            borderColor: borderColor1,
            data: this.arrDataChartWeeklyPatrollingPerformance.map(a => a[0]),
            fill: false,
          },{
            label: "Performance Timing",
            backgroundColor: borderColor2,
            borderColor: borderColor2,
            data: this.arrDataChartWeeklyPatrollingPerformance.map(a => a[1]),
            fill: false,
          },{
            label: "Performance Routing",
            backgroundColor: borderColor3,
            borderColor: borderColor3,
            data: this.arrDataChartWeeklyPatrollingPerformance.map(a => a[2]),
            fill: false,
          },{
            label: "Overall Performance",
            backgroundColor: borderColor4,
            borderColor: borderColor4,
            data: this.arrDataChartWeeklyPatrollingPerformance.map(a => a[3]),
            fill: false,
          }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: 'Weekly Patroll Performance',
          fontSize: 15
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: ''
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              // steps: 10,
              // stepValue: 20,
              stepSize: 20,
              max: 110,
              min: 0,
              callback: function(value, index, values) {
                  return value + "%";
              },
            },
            scaleLabel: {
              display: true,
              // labelString: '%'
            }
          }]
        }  
      } 
    });
  }
  
  buildChartWorkingTimeVsIdlingTime(){
    let { nativeElement } = this.chartTimeArea;
    nativeElement.innerHTML = '';
    if(!this.arrReportData) return;

    let chartCanvas = document.createElement('canvas');
    chartCanvas.style.width = '100%';
    chartCanvas.height = 450;
    nativeElement.appendChild(chartCanvas);
    let ctx = chartCanvas.getContext('2d');
    // if(!chartData) return;
    
    let length = this.arrDataChartWorkingTimeVsIdlingTime.length;
    const { arrBgColor1, arrBorderColor1, arrBgColor2, arrBorderColor2 } = this.chartService.getColorVsBgColor(length);
    var chartTime = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.arrLabelsChartWorkingTimeVsIdlingTime,
        datasets: [
          {
            label: 'Working Time',
            data: this.arrDataChartWorkingTimeVsIdlingTime.map(arr => arr[1]),
            backgroundColor: arrBgColor2,
            borderColor: arrBorderColor2,
            borderWidth: 1
          },{
            label: 'Idling Time',
            data: this.arrDataChartWorkingTimeVsIdlingTime.map(arr => arr[0]),
            backgroundColor: arrBgColor1,
            borderColor: arrBorderColor1,
            borderWidth: 1
          }
      ],
      },  
      options:{
        scales: {
          xAxes: [{
            stacked: true,
          }],
          yAxes: [{
            stacked: true
          }]
        },
        title: {
          display: true,
          text: 'Working Time Vs Idling Time',
          fontSize: 15
        },
      },
    });
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
