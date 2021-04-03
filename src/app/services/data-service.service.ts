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
    return this.http.get(this.globalDataUrl, {responseType: 'text'}).pipe(
      map(result => {
        let data: GlobalDataSummary[] = [];
        let rows = result.split('\n');
        rows.splice(0, 1);
        rows.forEach(row => {
          let col = row.split(/,(?=\S)/);

          data.push({
            country: col[3],
            confirmed: +col[7],
            deaths: +col[8],
            recovery: +col[9],
            active: +col[10]
          });
        });

        console.log(data);
        

        return [];
      })
    );
  }
}
