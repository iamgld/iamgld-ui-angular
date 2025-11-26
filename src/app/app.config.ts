// Angular Imports

import { provideHttpClient, withFetch } from '@angular/common/http'
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideClientHydration, withEventReplay } from '@angular/platform-browser'
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router'
// This Module Imports
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' }),
    ),
    provideHttpClient(withFetch()),
  ],
}
