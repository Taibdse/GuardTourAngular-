import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { DeviceService } from '../../services/device.service';
import { ChartService } from '../../services/chart.service';
import Chart from 'chart.js';

@Component({
  selector: 'app-attendance-report-device',
  templateUrl: './attendance-report-device.component.html',
  styleUrls: ['./attendance-report-device.component.scss']
})
export class AttendanceReportDeviceComponent implements OnInit {

  @ViewChild('alertSuccess') alertSuccess;
  @ViewChild('alertError') alertError;
  @ViewChild('selectDevice') selectDevice;
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
    private deviceService: DeviceService, 
    private chartService: ChartService) { 
      this.arrColors = this.commonService.arrColors;
      this.arrMonths = this.commonService.arrMonths;
    }

  ngOnInit() {
  }

  async showData(type){
    let iDeviceID = this.selectDevice.currentVal;
    let sentData = { iDeviceID, iKindSearch: 0, iValue: 0 };
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
    this.arrReports = await this.deviceService.getReportWorkingvsIdlingTimeDeviceData(sentData);
    this.buildChartWorkingTimeVsIdlingTime(this.arrReports, type);
    if(!this.arrReports) return this.informResult(false, 'No data available!!', 5000);
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

    let arrLabels = this.getLabelsChart(chartData, type);
    let length = chartData.length;
    const { arrBgColor1, arrBorderColor1, arrBgColor2, arrBorderColor2 } = this.chartService.getColorVsBgColor(length);

    var chartTime = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: arrLabels,
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
            stacked: true,
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
