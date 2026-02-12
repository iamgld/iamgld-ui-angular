// Angular Imports

import { provideHttpClient, withFetch } from '@angular/common/http'
import {
	ApplicationConfig,
	provideBrowserGlobalErrorListeners,
	provideZonelessChangeDetection,
} from '@angular/core'
import {
	provideClientHydration,
	withEventReplay,
	withHttpTransferCacheOptions,
	withIncrementalHydration,
} from '@angular/platform-browser'
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
		provideZonelessChangeDetection(),
		provideClientHydration(
			withEventReplay(),
			withIncrementalHydration(),
			withHttpTransferCacheOptions({ includePostRequests: true }),
		),
		provideRouter(
			routes,
			withComponentInputBinding(),
			withViewTransitions(),
			withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' }),
		),
		provideHttpClient(withFetch()),
	],
}
