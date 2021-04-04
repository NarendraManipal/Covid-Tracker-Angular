import { GlobalDataSummary } from './../models/global-data';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private globalDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-02-2021.csv';

  constructor(private http: HttpClient) {

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

        console.log(raw);


        return <GlobalDataSummary[]>Object.values(raw);
      })
    );
  }
}
