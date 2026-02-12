// Store Imports
import { inject } from '@angular/core'
import {
	patchState,
	signalStore,
	watchState,
	withHooks,
	withMethods,
	withState,
} from '@ngrx/signals'
// This Module Imports
import { ICONS, UiTheme, UI_THEMES } from '../../models'
import { Theme } from '../../services'

export interface ThemeState {
	theme: UiTheme
	iconTheme: typeof ICONS.macLine | typeof ICONS.sunLine | typeof ICONS.moonClearLine
}

export const initialThemeState: ThemeState = {
	theme: UI_THEMES.system,
	iconTheme: ICONS.macLine,
}

export const ThemeStore = signalStore(
	withState(initialThemeState),
	withHooks({
		onInit(store) {
			watchState(store, () => {
				// console.log('[ui-store]', state)
			})
		},
	}),
	withMethods((store, themeService = inject(Theme)) => ({
		changeTheme: ({
			theme,
			iconTheme,
		}: {
			theme: UiTheme
			iconTheme: typeof ICONS.macLine | typeof ICONS.sunLine | typeof ICONS.moonClearLine
		}): void => {
			themeService.changeTheme(theme)
			patchState(store, () => ({ theme, iconTheme }))
		},
	})),
)
