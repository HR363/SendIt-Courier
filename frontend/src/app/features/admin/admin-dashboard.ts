import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexStroke, ApexDataLabels, ApexGrid, ApexTitleSubtitle, ApexMarkers, ApexYAxis, ApexTooltip, ApexFill, ApexLegend } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  title: ApexTitleSubtitle;
  markers: ApexMarkers;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
};

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard {
  public chartOptions: ChartOptions = {
    series: [
      {
        name: 'Parcels',
        data: [12, 24, 18, 32, 40, 28, 36]
      }
    ],
    chart: {
      type: 'line',
      height: 380,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    xaxis: {
      categories: ['Jul 19', 'Jul 20', 'Jul 21', 'Jul 22', 'Jul 23', 'Jul 24', 'Jul 25'],
      labels: { style: { colors: '#f97316', fontWeight: 600 } }
    },
    stroke: {
      curve: 'smooth',
      width: 4,
      colors: ['#f97316']
    },
    dataLabels: { enabled: false },
    grid: { borderColor: '#fde68a', row: { colors: ['#fff', 'transparent'], opacity: 0.5 } },
    title: { text: '', align: 'left' },
    markers: { size: 5, colors: ['#f97316'], strokeColors: '#fff', strokeWidth: 2 },
    yaxis: { labels: { style: { colors: '#6b7280' } } },
    tooltip: { enabled: true },
    fill: { type: 'gradient', gradient: { shade: 'light', type: 'vertical', gradientToColors: ['#fdba74'], stops: [0, 100] } },
    legend: { show: false }
  };
} 