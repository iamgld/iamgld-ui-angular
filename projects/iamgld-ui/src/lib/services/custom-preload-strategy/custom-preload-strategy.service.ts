// Angular Imports
import { Injectable } from '@angular/core'
import { PreloadingStrategy, Route } from '@angular/router'
// Thirdparty Imports
import { Observable, of } from 'rxjs'

// Don't remove providedIn: 'root' decorator, it's important for the custom preloading works
@Injectable({ providedIn: 'root' })
export class CustomPreloadingStrategyService implements PreloadingStrategy {
  public preload(route: Route, load: () => Observable<void>): Observable<void | null> {
    if (route && route.data && route.data['preload']) {
      console.log(`[preloading] Precargando ${route.path}`)
      return load()
    }
    return of(null)
  }
}
