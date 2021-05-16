import { GlobalDataSummary } from './../models/global-data';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DateWiseData } from '../models/date-wise-data';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private globalDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-02-2021.csv';
  private dateWiseDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';

  constructor(private http: HttpClient) {

  }

  getDatewiseData() {
    return this.http.get(this.dateWiseDataUrl, { responseType: 'text' })
      .pipe(map(result => {
        let rows = result.split('\n');
        let header = rows[0];
        let mainData = {};
        let dates = header.split(/,(?=\S)/);
        dates.splice(0, 4);
        rows.splice(0, 1);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/);
          let con = cols[1];
          cols.splice(0, 4);
          mainData[con] = [];
          cols.forEach((value, index) => {
            let dw: DateWiseData = {
              case: +value,
              country: con,
              date: new Date(Date.parse(dates[index]))
            }
            mainData[con].push(dw);
          })
        })

        // console.log(mainData);

        return mainData;
      }))
  }

  getGlobalData() {
    return this.http.get(this.globalDataUrl, { responseType: 'text' }).pipe(
      map(result => {
        let data: GlobalDataSummary[] = [];
        let raw = {};
        let rows = result.split('\n');
        rows.splice(0, 1);
        rows.forEach(row => {
          let col = row.split(/,(?=\S)/);

          let cs = {
            country: col[3],
            confirmed: +col[7],
            deaths: +col[8],
            recovery: +col[9],
            active: +col[10]
          };

          let temp: GlobalDataSummary = raw[cs.country];

          if (temp) {
            temp.active = cs.active + temp.active;
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovery = cs.recovery + temp.recovery;

            raw[cs.country] = temp;
          } else {
            raw[cs.country] = cs;
          }

        });

        // console.log(raw);


        return <GlobalDataSummary[]>Object.values(raw);
      })
    );
  }
}
