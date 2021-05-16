import { map } from 'rxjs/operators';
import { DateWiseData } from './../../models/date-wise-data';
import { Component, OnInit } from '@angular/core';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GoogleChartInterface } from 'ng2-google-charts';
import { merge } from 'rxjs';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  data: GlobalDataSummary[];
  countries: string[] = [];

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  dateWiseData;
  selectedCountryData: DateWiseData[];
  lineChart: GoogleChartInterface = {
    chartType: 'LineChart'
  }

  constructor(private service: DataServiceService) { }

  ngOnInit(): void {

    merge(
      this.service.getDatewiseData().pipe(
        map(result => {
          this.dateWiseData = result;
        })
      ),
      this.service.getGlobalData().pipe(
        map(result => {
          this.data = result;
          this.data.forEach(cs => {
            this.countries.push(cs.country);
          })
        })
      )
    ).subscribe(
      {
        complete: () => {
          this.updateValues('Afghanistan')
        }
      }
    )
  }

  updateChart() {
    let dataTable = [];
    dataTable.push(['Date', 'Cases']);
    this.selectedCountryData.forEach(cs => {
      dataTable.push([cs.date, cs.case])
    })
    console.log(dataTable);
    this.lineChart = {
      chartType: 'LineChart',
      dataTable: dataTable,
      //firstRowIsData: true,
      options: {
        height: 500
      },
    }
  }

  updateValues(country: string) {
    this.data.forEach(cs => {
      if (cs.country == country) {
        this.totalActive = cs.active;
        this.totalRecovered = cs.recovery;
        this.totalDeaths = cs.deaths;
        this.totalConfirmed = cs.confirmed;
      }
    })

    this.selectedCountryData = this.dateWiseData[country];
    // console.log(this.selectedCountryData);
    this.updateChart();
  }

}
