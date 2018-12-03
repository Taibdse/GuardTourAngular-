import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { RouteService } from '../../services/route.service';
import { TimeService } from '../../services/time.service';
import Chart from 'chart.js';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.scss']
})
export class DailyReportComponent implements OnInit {

  chartTime = null;
  chartPatrolling = null;
  arrRoutes = [];

  // arrays
  arrIndex = [];
  arrCriteriaReport: any;
  arrPropsReport: any;
  unitsOfData: any;
  arrReportCal: any;
  arrCurrentReportData: any;

  // data of chart 
  currentDataChartTimePerformance: any = [];
  currentDataChartPatrollingPerformance: any = [];
  currentOverallPerformance: number = 0;
  
  // date value
  currentDateVal: Date;
  currentStartDate: string;
  currentEndDate: string;
  currentRouteName: string;
  currentManager: string;

  //alert content
  alertSuccessContent: string;
  alertErrorContent: string;

  //chart patrolling info
  patrollingChartData: any;
  patrollingChartLabels: any;
  patrollingChartOptions: any;
  patrollingChartColors: any;

  // chart time performance info
  workingTimeChartData: any;
  workingTimeChartLabels: any;
  workingTimeChartOptions: any;
  workingTimeChartColors: any;

  @ViewChild('datePicker') datePicker;
  @ViewChild('alertSuccess') alertSuccess;
  @ViewChild('alertError') alertError;
  @ViewChild('selectRoute') selectRoute;
  @ViewChild('modalManager') modalManager;
  @ViewChild('modalChart') modalChart;

  constructor(private commonService: CommonService, 
    private routeService: RouteService, 
    private timeService: TimeService) {
    let { arrCriteriaReport, arrPropsReport, unitsOfData, arrReportCal } = this.commonService;
    this.arrCriteriaReport = arrCriteriaReport.slice();
    this.arrPropsReport = arrPropsReport.slice();
    this.unitsOfData = unitsOfData.slice();
    this.arrReportCal = arrReportCal.slice();
    this.currentDateVal = new Date();
    this.fillArrayIndex();
  }

  fillArrayIndex(){
    for(let i = 0; i < 20; i++){
      this.arrIndex.push(i);
    }
  }

  ngOnInit() {
   this.showReportData();
  }

  getTimes(d: Date){
    let year = d.getFullYear();
    let month = d.getMonth();
    let day = d.getDate();
    return { year, month, day };
  }

  showTimes(time){
    let { year, month, day } = this.getTimes(time);
    this.currentStartDate = `${month + 1}/${day}/${year} 00:00AM`;
    this.currentEndDate = `${month + 1}/${day}/${year} 11:59PM`;
  }

  showRouteName(){
    let { currentVal, arrRouteList } = this.selectRoute;
    let route = arrRouteList.find(r => r.iRouteID == currentVal);
    this.currentRouteName = route.sRouteName;
  }

  async showReportData(){
    let RouteID = this.selectRoute.currentVal;
    this.showTimes(this.currentDateVal);
    this.showRouteName();
    let dDateTime = this.timeService.getDateToYMD(this.currentDateVal);
    let sentData = { RouteID, dDateTime }
    this.arrCurrentReportData = await this.routeService.reportRoutebydate(sentData);
    this.currentDataChartTimePerformance.length = 0;
    this.currentDataChartPatrollingPerformance.length = 0;
    if(this.arrCurrentReportData){
      const { 
        dIdling_Time_in, 
        dPerfomance_Time, 
        dPerformance_Routes, 
        dPerformance_Routing, 
        dPerformance_Timing, 
        dOverall_performance } = this.arrCurrentReportData[0];
  
      this.currentDataChartTimePerformance = [
        Number(dIdling_Time_in), 
        Number(dPerfomance_Time)
      ];
  
      this.currentDataChartPatrollingPerformance = [
        Number(dPerformance_Routes), 
        Number(dPerformance_Timing), 
        Number(dPerformance_Routing)
      ];
  
      this.currentOverallPerformance = Number(dOverall_performance);
    }
    this.showChartUnderDataTable();
  }


  showModalEnterManager(){
    this.modalManager.show();
  }

  getInfoOfChartPatrolling(){
    let lineData = [ 
      this.currentOverallPerformance, 
      this.currentOverallPerformance, 
      this.currentOverallPerformance 
    ]
    let data = {
      labels: [["Performance", "Routes"], ["Performance", "Timing"], ["Performance", "Routing"]],
      datasets: [{
          label: 'Performance',
          data: this.currentDataChartPatrollingPerformance,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
      },{
        type: 'line',
        label: 'Overall Performance',
        borderColor: 'green',
        backgroundColor: 'green',
        borderWidth: 2,
        fill: false,
        data: lineData
      }]
    }
    let options = {
      title: {
        display: true,
        text: 'Patrolling Performance',
        fontSize: 20
      },
      responsive: true,
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
                display: true,
            }
          }], 
          yAxes: [{
              ticks: {
                beginAtZero: true,
                // steps: 10,
                // stepValue: 20,
                stepSize: 10,
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
          }],
        }
    }
    return { data, options };
  }
  
  getInfoOfChartTimePerformance(){
    let data = {
      labels: [
        "Perfomance Time/ Hiệu suất thời gian %", 
        "Idling Time in %/ Thời gian không làm việc %"
      ],
      datasets: [{
          label: '# of Votes',
          data: this.currentDataChartTimePerformance,
          backgroundColor: [
            '#4286f4',
            '#d82b42',
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1
      }]
    };
  
    let options = {
      // showAllTooltips: true,
      title: {
        display: true,
        text: 'Time Performance',
        fontSize: 20
      },
      legend: {
        display: false
      },
      pieceLabel: {
        render: 'percentage',
        fontColor: 'white',
        fontSize: 20,
        precision: 2
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
    };
    return { data, options };
  }

  buildChartPatrolling(id){
    let element = document.getElementById(id);
    if(this.currentDataChartPatrollingPerformance.length == 0) {
      this.chartPatrolling = null;
      element.innerHTML = '';
      return;
    }
    let chartCanvas = document.createElement('canvas');
    chartCanvas.style.width = '100%';
    chartCanvas.height = 400;
    element.innerHTML = '';
    element.appendChild(chartCanvas);
    let ctx = chartCanvas.getContext('2d');
    let { data, options } = this.getInfoOfChartPatrolling();
    this.chartPatrolling = this.createChart(ctx, 'bar', data, options);
  }

  buildChartTimePerformance(id){
    let element = document.getElementById(id);
    if(this.currentDataChartTimePerformance.length == 0) {
      this.chartTime = null;
      element.innerHTML = '';
      return;
    }
    let chartCanvas = document.createElement('canvas');
    chartCanvas.style.width = '100%';
    chartCanvas.height = 400;
    element.innerHTML = '';
    element.appendChild(chartCanvas);
    let ctx = chartCanvas.getContext('2d');
    let { data, options } = this.getInfoOfChartTimePerformance();
    this.chartTime = this.createChart(ctx, 'pie', data, options);
  }

  createChart(ctx, type, data, options){
    return new Chart(ctx, { type, data, options });
  }

  showModalChartReport(){
    this.buildChartPatrolling('chartPatrollingModal');
    this.buildChartTimePerformance('chartTimeModal');
    this.modalChart.show();
  }

  showChartUnderDataTable(){
    this.buildChartPatrolling('chartPatrollingPrinting');
    this.buildChartTimePerformance('chartTimePrinting');
  }

  showCharts(){
    
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
