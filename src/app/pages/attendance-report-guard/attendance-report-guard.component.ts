import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { GuardService } from '../../services/guard.service';
import { ChartService } from '../../services/chart.service';
import Chart from 'chart.js';

@Component({
  selector: 'app-attendance-report-guard',
  templateUrl: './attendance-report-guard.component.html',
  styleUrls: ['./attendance-report-guard.component.scss']
})
export class AttendanceReportGuardComponent implements OnInit {
  @ViewChild('datePicker') datePicker;
  @ViewChild('alertSuccess') alertSuccess;
  @ViewChild('alertError') alertError;
  @ViewChild('selectRoute') selectRoute;
  @ViewChild('modalManager') modalManager;
  @ViewChild('modalChart') modalChart;
  @ViewChild('selectGuard') selectGuard;
  @ViewChild('selectWeek') selectWeek;
  @ViewChild('selectMonth') selectMonth;
  @ViewChild('selectYear') selectYear;
  @ViewChild('chartArea') chartArea;
  @ViewChild('barChartArea') barChartArea;

  arrReports: any;
  arrMonths: any;
  alertSuccessContent: string;
  alertErrorContent: string;

  constructor(private commonService: CommonService, 
    private guardService: GuardService, 
    private chartService: ChartService) { 
      this.arrMonths = this.commonService.arrMonths;
    }

  ngOnInit() {
  }

  async showData(type){
    let iGuardID = this.selectGuard.currentVal;
    let sentData = { iGuardID, iKindSearch: 0, iValue: 2018 };
    if (type == 'week'){
      sentData.iValue = this.selectWeek.currentVal;
      sentData.iKindSearch = 1;
    }else if(type == 'month') {
      sentData.iValue = this.selectMonth.currentVal;
      sentData.iKindSearch = 2;
    }else if (type == 'year'){
      sentData.iValue = this.selectYear.currentVal;
      sentData.iKindSearch = 3;
    }
    this.arrReports = await this.guardService.getReportWorkingvsIdlingTimeGuardData(sentData);
    this.buildChartWorkingTimeVsIdlingTime(this.arrReports, type);
    if(!this.arrReports) return this.informResult(false, 'No data available!!', 5000);
  }

  buildLineChart(chartData, type){
    let chartCanvas = document.createElement('canvas');
    chartCanvas.style.width = '100%';
    chartCanvas.height = 450;
    let { nativeElement } = this.lineChartArea;
    nativeElement.innerHTML = '';
    nativeElement.appendChild(chartCanvas);
    let ctx = chartCanvas.getContext('2d');
    
    let bgColor1 = 'rgba(255, 99, 132, 0.2)';
    let bgColor2 = 'rgba(75, 192, 192, 0.2)';
    let bgColor3 = 'rgba(153, 102, 255, 0.2)';
    let bgColor4 = 'rgba(255, 159, 64, 0.2)';
    let bgColor5 = 'rgba(100, 159, 64, 0.2)';
  
    let borderColor1 = 'rgba(75, 192, 192, 1)';
    let borderColor2 = 'rgba(153, 102, 255, 1)';
    let borderColor3 = 'rgba(255, 159, 64, 1)';
    let borderColor4 = 'red';
    let borderColor5 = 'pink';
  
    let arrLabels = this.getLabelsChart(chartData, type);
    
    var chartPatroll = new Chart(ctx, {
      type: 'line',
      data: {
          labels:arrLabels,
          datasets: [{
            label: "Performance Routes",
            backgroundColor: borderColor1,
            borderColor: borderColor1,
            data: chartData.map(item => Number(item.dPerformance_Routes)),
            fill: false,
          }, {
            label: "Performance Routing",
            backgroundColor: borderColor2,
            borderColor: borderColor2,
            data: chartData.map(item => Number(item.dPerformance_Routing)),
            fill: false,
          },{
            label: "Performance Timing",
            backgroundColor: borderColor3,
            borderColor: borderColor3,
            data: chartData.map(item => Number(item.dPerformance_Timing)),
            fill: false,
          },{
            label: "Performance Time",
            backgroundColor: borderColor4,
            borderColor: borderColor4,
            data: chartData.map(item => Number(item.dPerfomance_Time)),
            fill: false,
          },{
            label: "Idling Time",
            backgroundColor: borderColor5,
            borderColor: borderColor5,
            data: chartData.map(item => Number(item.dIdling_Time_in)),
            fill: false,
          }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: ''
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
  
  getLabelsChart(chartData, type){
    if(type.toLowerCase() == 'week') return chartData.map(item => item.sDay);
    if(type.toLowerCase() == 'month') 
      return chartData.map(item => `Week ${item.iWeek}`);
    return chartData.map(item => this.arrMonths[Number(item.iMonth) - 1]);
  }
  
  buildChartWorkingTimeVsIdlingTime(chartData, type){
    let { nativeElement } = this.chartArea;
    nativeElement.innerHTML = '';
    if(!chartData) return;

    let chartCanvas = document.createElement('canvas');
    chartCanvas.style.width = '100%';
    chartCanvas.height = 450;
    nativeElement.appendChild(chartCanvas);
    let ctx = chartCanvas.getContext('2d');

    let labels = this.getLabelsChart(chartData, type);

    let length = chartData.length;
    const { arrBgColor1, arrBorderColor1, arrBgColor2, arrBorderColor2 } = this.chartService.getColorVsBgColor(length);
    var chartTime = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Working Time',
          data: chartData.map(item => Number(item.dWorkingPercent)),
          backgroundColor: arrBgColor2,
          borderColor: arrBorderColor2,
          borderWidth: 1
        },{
          label: 'Idling Time',
          data: chartData.map(item => Number(item.dIdlingPercent)),
          backgroundColor: arrBgColor1,
          borderColor: arrBorderColor1,
          borderWidth: 1
        },
      ],
      },  
      options:{
        scales: {
          xAxes: [{
            stacked: true,
            barPercentage: 0.5,
            ticks: {
              fontSize: 15
            }
          }],
          yAxes: [{
            stacked: true
          }]
        },
        title: {
          display: true,
          text: 'Working Time Vs Idling Time',
          fontSize: 25
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
