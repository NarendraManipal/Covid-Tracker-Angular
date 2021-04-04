import { GlobalDataSummary } from './../../models/global-data';
import { Component, OnInit, Input } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData: GlobalDataSummary[];
  pieChart: GoogleChartInterface = {
    chartType: 'PieChart'
  };
  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart'
  };

  constructor(private dataService: DataServiceService) { }

  initChart(casetype: string) {
    let dataTable = [];
    dataTable.push(["Country", "Cases"]);

    this.globalData.forEach(cs => {
      let values: number;

      if (casetype == 'c') {
        if (cs.confirmed > 2000) { values = cs.confirmed; }
      }

      if (casetype == 'a') {
        if (cs.active > 2000) { values = cs.active; }
      }

      if (casetype == 'd') {
        if (cs.deaths > 2000) { values = cs.deaths; }
      }

      if (casetype == 'r') {
        if (cs.recovery > 2000) { values = cs.recovery; }
      }

      dataTable.push([cs.country, values]);
    });

    this.pieChart = {
      chartType: 'PieChart',
      dataTable: dataTable,
      //firstRowIsData: true,
      options: {
        height: 500
      },
    };
    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: dataTable,
      //firstRowIsData: true,
      options: {
        height: 500
      },
    };
  }

  ngOnInit(): void {

    this.dataService.getGlobalData()
      .subscribe(
        {
          next: (result => {
            this.globalData = result;
            result.forEach(cs => {
              if (!Number.isNaN(cs.confirmed)) {
                this.totalConfirmed += cs.confirmed;
                this.totalActive += cs.active;
                this.totalDeaths += cs.deaths;
                this.totalRecovered += cs.recovery;
              }
            })
            this.initChart('c');
          })
        }
      );
  }

  updateChart(input: HTMLInputElement) {
    this.initChart(input.value);
  }
}
