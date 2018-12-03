import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { GuardGroupService } from '../../services/guard-group.service';
import Chart from 'chart.js';

@Component({
  selector: 'app-attendance-report-group',
  templateUrl: './attendance-report-group.component.html',
  styleUrls: ['./attendance-report-group.component.scss']
})
export class AttendanceReportGroupComponent implements OnInit {

  @ViewChild('alertSuccess') alertSuccess;
  @ViewChild('alertError') alertError;
  @ViewChild('selectGroup') selectGroup;
  @ViewChild('selectWeek') selectWeek;
  @ViewChild('selectMonth') selectMonth;
  @ViewChild('selectYear') selectYear;
  @ViewChild('chartArea') chartArea;

  arrReports: any;
  arrMonths: any;
  arrColors: any;
  alertSuccessContent: string;
  alertErrorContent: string;

  constructor(private commonService: CommonService, 
    private groupService: GuardGroupService) { 
      this.arrColors = this.commonService.arrColors;
      this.arrMonths = this.commonService.arrMonths;
    }

  ngOnInit() {
  }

  async showData(type){
    let iGroupID = this.selectGroup.currentVal;
    let sentData = { iGroupID, iKindSearch: 0, iValue: 0 };
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
    this.arrReports = await this.groupService.getReportWorkingvsIdlingTimeGuardGroup(sentData);
    let arrLabels = this.getLabelsChart(this.arrReports, type);
    let chartData = this.getDataOnGuards(this.arrReports);
    this.buildLineChart(chartData, arrLabels, 'Time Attendance');
    if(!this.arrReports) return this.informResult(false, 'No data available!!', 5000);
  }
  
  buildLineChart(chartData, arrLabels, title){
    let { nativeElement } = this.chartArea;
    nativeElement.innerHTML = '';
    if(!chartData) return;

    let chartCanvas = document.createElement('canvas');
    chartCanvas.style.width = '100%';
    chartCanvas.height = 450;
    nativeElement.appendChild(chartCanvas);
    let ctx = chartCanvas.getContext('2d');

    let datasets = chartData.map((line, index) => {
      return {
        label: line.label,
        backgroundColor: this.arrColors[index],
        borderColor: this.arrColors[index],
        data: line.data,
        fill: false,
      }
    })

    var chartPatroll = new Chart(ctx, {
      type: 'line',
      data: {
          labels: arrLabels,
          datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: title,
          fontSize: 20
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
    if(!chartData) return null;
    if(chartData.length == 0) return null;
    if(type.toLowerCase() == 'week') return chartData.map(item => item.sDay);
    if(type.toLowerCase() == 'month') 
      return chartData.map(item => `Week ${item.iWeek}`);
    return chartData.map(item => this.arrMonths[Number(item.iMonth) - 1]);
  }

  getDataOnGuards(data){
    if(!data) return null;
    if(data.length == 0) return null;
    let guardsSet = new Set(data.map(item => item.iGuardID));
    let arrGuards = Array.from(guardsSet);
    let arrDataGuards = [];
    arrGuards.forEach(g => {
      let arr = data.filter(item => {
        if(item.iGuardID == g) return item;
      });
      arrDataGuards.push(arr);
    })
    let temp = arrDataGuards.map(item => {
      return { 
        label:item[0].sGuardName,
        data: item.map(ele => Number(ele.dPercentWorkingTime))
      }
    })
    return temp;
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
