import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Logger } from './logger.service';
import { environment } from '../../environments/environment';
import { Constants } from '../globals/constants';
import { htmlPath } from '../globals/global-variables';

@Injectable({
  providedIn: 'root'
})
export class CoreRestService {

  constructor(
    private http: HttpClient,
    private logger: Logger
  ) {
    // this.myService = AppModule.injector.get(MyService);
  }


  get(endpoint: string): Observable<any> {
    this.logger.log(environment.host + endpoint);
    return this.http.get(environment.host + endpoint)
  }

  getHTML(path: string): Observable<any> {
    this.logger.log(htmlPath + path);
    return this.http.get(htmlPath + path, { responseType: 'text' })
  }

  post(params: any, endpoint: string): Observable<any> {
    this.logger.log(environment.host + endpoint);
    return this.http.post(environment.host + endpoint, params);
  }

  getArrayBuffer(endpoint: string): Observable<any> {
    this.logger.log(environment.host + endpoint);
    return this.http.get(
      environment.host + endpoint, { responseType: 'arraybuffer' }
    );
  }

}
