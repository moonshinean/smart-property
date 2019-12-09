import {PreloadingStrategy, Route} from '@angular/router';
import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';

// 自定义预加载
@Injectable()
export class PreloadSelectedModules implements PreloadingStrategy {
  preloadModules: string[] = [];
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data.preload ) {
      this.preloadModules.push(route.path);
      return load();
    }
    return of(null);
  }
}
