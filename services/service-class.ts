import { ReflectiveInjector } from '@angular/core';
import { Headers, Http, HttpModule, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export  class BaseService {

  http:   Http;

  constructor() {
    let injector = ReflectiveInjector.resolveAndCreate([HttpModule, Http]);
    this.http = injector.get(Http);
  }

  get(url) {
    return this.http.get(url).map(res => res.json()).catch(this.handleError);
  }

  delete(url) {
    return this.http.delete(url).map(res => res.json()).catch(this.handleError);
  }

  extractData(res: Response) {
    const body = res.json();
    return body || {};
  }

  handleError(error: any) {
    const errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  }
}
