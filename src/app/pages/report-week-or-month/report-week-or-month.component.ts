import { Component, OnInit, ViewChild } from '@angular/core';
import { TourService } from '../../services/tour.service';
import { CommonService } from '../../services/common.service';
import { ChartService } from '../../services/chart.service';
import Chart from 'chart.js';

@Component({
  selector: 'app-report-week-or-month',
  templateUrl: './report-week-or-month.component.html',
  styleUrls: ['./report-week-or-month.component.scss']
})
export class ReportWeekOrMonthComponent implements OnInit {

  @ViewChild('selectRoute') selectRoute;
  @ViewChild('selectWeek') selectWeek;
  @ViewChild('selectMonth') selectMonth;
  @ViewChild('selectYear') selectYear;
  @ViewChild('alertSuccess') alertSuccess;
  @ViewChild('alertError') alertError;

  arrTourList: any;
  alertErrorContent: string;
  alertSuccessContent: string;

  constructor(private tourService: TourService, 
    private commonService: CommonService, 
    private chartService: ChartService) { }

  ngOnInit() {
    this.showData('week');
  }

  async showData(type){
    let iRouteID = this.selectRoute.currentVal;
    let sentData = { iRouteID, iWeek: 0, iMonth: 0, iYear: 0 };
    // sentData.iWeek = this.selectWeek.currentVal;
    if (type == 'week')
      sentData.iWeek = this.selectWeek.currentVal;
    else if(type == 'month') 
      sentData.iMonth = this.selectMonth.currentVal;
    else if (type == 'year')
      sentData.iYear = this.selectYear.currentVal;
    this.arrTourList = await this.tourService.getTourDetail(sentData);
    if(!this.arrTourList) this.informResult(false, 'No data available!!', 4000);
    this.buildBarChart(this.arrTourList, type);
    this.buildLineChart(this.arrTourList, type);
  }

  buildLineChart(chartData, type){
    let element = document.getElementById('lineChart');
    element.innerHTML = '';
    let chartCanvas = document.createElement('canvas');
    chartCanvas.style.width = '100%';
    chartCanvas.height = 450;
    element.appendChild(chartCanvas);
    let ctx = chartCanvas.getContext('2d');
    if(!chartData) return;
    
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
    if(type.toLowerCase() == 'week') return chartData.map(item => item.sDayName);
    return chartData.map(item => item.iWeek);
  }
  
  buildBarChart(data, type){
    let element = document.getElementById('barChart');
    element.innerHTML = '';
    let chartCanvas = document.createElement('canvas');
    chartCanvas.style.width = '100%';
    chartCanvas.height = 450;
    element.appendChild(chartCanvas);
    if(!data) return;

    let ctx = chartCanvas.getContext('2d');
    let chartData = data.map(item => Number(item.iNumber_of_reports_issued));
    let length = chartData.length;
    let arrLabels = this.getLabelsChart(data, type);
  
    const { arrBgColor1, arrBorderColor1 } = this.chartService.getColorVsBgColor(length);
    var chartTime = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: arrLabels,
        datasets: [{
          label: 'Number of Report Issues',
          data: chartData,
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
          }],
          yAxes: [{
            stacked: true
          }]
        },
        title: {
          display: true,
          text: ''
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
