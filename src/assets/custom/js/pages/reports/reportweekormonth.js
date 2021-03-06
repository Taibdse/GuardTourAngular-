$(() => {

  $('#btnShowChartVsDataByWeek').click(async () => {
    let data = await getData('week');
    showChart(data, 'week');
    renderTourReportTable(data);
    setDefaultLang();
    if(!data) AlertService.showAlertError('No data available!!!', '');
  })
  $('#btnShowChartVsDataByMonth').click(async () => {
    let data = await getData('month');
    showChart(data, 'month');
    renderTourReportTable(data);
    setDefaultLang();
    if(!data) AlertService.showAlertError('No data available!!!', '');
  })
  $('#btnShowChartVsDataByYear').click(async () => {
    let data = await getData('year');
    showChart(data, 'year');
    renderTourReportTable(data);
    setDefaultLang();
    if(!data) AlertService.showAlertError('No data available!!!', '');
  })

  // showRouteList(true);
  SelectComponentService.renderRouteSelectList(true);
  SelectComponentService.renderMonthSelectList(true);
  SelectComponentService.renderWeekSelectList(true);
  SelectComponentService.renderYearSelectList(true);
  
  setDefaultLoading();

})

async function showChart(data, type){
  if(!data){
    $('#lineChart').html('');
    $('#barChart').html('');
  }else{
    setTimeout(() => {
      buildLineChart(data, type);
      buildBarChart(data, type);
    }, 200);
  }
}

async function getData(type){
  let iRouteID = $('#selectRouteName').val();
  let sentData = { iRouteID, iWeek: 0, iMonth: 0, iYear: 0 };
  if(type.toLowerCase() == 'month') 
    sentData.iMonth = $('#reportMonth').val();
  else if (type.toLowerCase() == 'week')
    sentData.iWeek = $('#reportWeek').val();
  else if (type.toLowerCase() == 'year')
    sentData.iYear = $('#reportYear').val();
  let data = await TourService.getTourDetail(sentData);
  return data;
}

function buildLineChart(chartData, type){
  let $chartCanvas = $('<canvas style="width: 100%" height="450"></canvas>');
  $('#lineChart').html($chartCanvas);
  let ctx = $chartCanvas[0].getContext('2d');
  
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

  let arrLabels = getLabelsChart(chartData, type);
  
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

function getLabelsChart(chartData, type){
  if(type.toLowerCase() == 'week') return chartData.map(item => item.sDayName);
  return chartData.map(item => item.iWeek);
}

function buildBarChart(data, type){
  let $chartCanvas = $('<canvas style="width: 100%" height="450"></canvas>');
  $('#barChart').html($chartCanvas);
  let ctx = $chartCanvas[0].getContext('2d');
  let chartData = data.map(item => Number(item.iNumber_of_reports_issued));
  let length = chartData.length;
  let arrLabels = getLabelsChart(data, type);

  const { arrBgColor1, arrBorderColor1 } = CommonService.getColorVsBgColor(length);
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

function setDefaultLoading(){
  let d = new Date();
  let week = TimeService.getWeek();
  let month = d.getMonth();
  //let year = d.getFullYear();
  $('#reportMonth').val(month + 1);
  $('#reportWeek').val(Number(week));
  //$('#reportYear').val(Number(year));
  //showTourDetailsTable('month');
}

function renderTourReportTable(data) {
  let $table = $('#tblReportTour');
  $table.html('');
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
      <tr>
        <th class="trn">Route</th>
        <th class="trn">Date</th>
        <th class="trn">Day</th>
        <th class="trn">Week</th>
        <th class="trn">Month</th>
        <th class="trn">Per. routes</th>
        <th class="trn">Per. Routing</th>
        <th class="trn">Per. Timing</th>
        <th class="trn">Per. Time</th>
        <th class="trn">Idling Time</th>
        <th class="trn">Number issued</th>        
      </tr>
    `
  )
  $table.append($thead);
  if(!data) return;
  data.forEach((tour) => {
    const {dDateReport, sDayName, iWeek, iMonth, sRouteName, dPerformance_Routes, dPerformance_Routing, dPerformance_Timing, dPerfomance_Time, dIdling_Time_in, iNumber_of_reports_issued} = tour;
    $tbody.append(`
      <tr>
        <td>${sRouteName}</td>
        <td>${dDateReport}</td>
        <td>${sDayName}</td>
        <td>${iWeek}</td>
        <td>${iMonth}</td>
        <td>${dPerformance_Routes} %</td>
        <td>${dPerformance_Routing} %</td>
        <td>${dPerformance_Timing} %</td>
        <td>${dPerfomance_Time} %</td>
        <td>${dIdling_Time_in} %</td>
        <td>${iNumber_of_reports_issued}</td>
      </tr>
    `)
  })
  $table.append($tbody);
}

function getColorVsBgColor(length){
  let arrBgColor1 = [];
  let arrBorderColor1 = [];
  let arrBgColor2 = [];
  let arrBorderColor2 = [];

  let bgColor1 = 'rgba(255, 99, 132, 0.2)';
  let borderColor1 = 'rgba(255,99,132,1)';
  let bgColor2 = 'rgba(255, 159, 64, 0.2)';
  let borderColor2 = 'rgba(255, 159, 64, 1)';

  for(let i = 0; i < length; i++){
    arrBgColor1.push(bgColor1);
    arrBorderColor1.push(borderColor1);
    arrBgColor2.push(bgColor2);
    arrBorderColor2.push(borderColor2);
  }

  return { arrBgColor1, arrBorderColor1, arrBgColor2, arrBorderColor2 };
}