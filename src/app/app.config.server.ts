// Angular Imports
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core'
import { provideServerRendering } from '@angular/platform-server'
import { provideServerRoutesConfig } from '@angular/ssr'
// This Component Imports
import { appConfig } from './app.config'
import { serverRoutes } from './app.routes.server'

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(), provideServerRoutesConfig(serverRoutes)],
}

export const config = mergeApplicationConfig(appConfig, serverConfig)
