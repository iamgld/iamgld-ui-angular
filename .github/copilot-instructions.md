# Copilot Instructions for iamgld-ui

Expert in TypeScript, Angular 21, and scalable web application development. Write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Project Architecture

This is a **monorepo** with two main parts:
- **`src/`** - Demo/showcase application (`iamgld.dev`)
- **`projects/iamgld-ui/`** - Publishable UI component library (`@iamgld/ui` on npm)

### Component Library (`projects/iamgld-ui/`)
- Entry point: `src/public-api.ts` - exports all public APIs
- Components: `src/lib/components/` - organized by category (buttons, controls, tables, etc.)
- Models: `src/lib/models/` - TypeScript enums and types (e.g., `ButtonColor`, `ButtonSize`)
- Validators: `src/lib/validators/` - Custom form validators (e.g., `isEmailValidator()`)
- Directives: `src/lib/directives/` - Reusable directives
- Utils: `src/lib/utils/` - Date and string utilities

### Path Aliases
- `@app` → `src/app/index.ts`
- `@environment` → `src/environments/environment.local.ts`
- `@shared/*` → `src/app/shared/*`

## Component Patterns

```typescript
// Standard component structure - see projects/iamgld-ui/src/lib/components/buttons/button/
@Component({
  selector: 'gld-button',  // Always use 'gld-' prefix
  imports: [...components],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  // Required inputs first
  name = input.required<string>()
  // Optional inputs with defaults and transforms
  disabled = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  // Outputs
  clicked = output<void>()
}
```

**Key Rules:**
- Selector prefix: `gld-` for library components
- Do NOT set `standalone: true` - it's the default in Angular 21
- Use `input()` and `output()` functions, never decorators
- Use `booleanAttribute` and `numberAttribute` transforms for HTML attribute compatibility
- Use `host` object in decorator instead of `@HostBinding`/`@HostListener`
- Prefer enums for type-safe options (see `models/buttons/button.model.ts`)

## Forms & Validators

- Always use Reactive Forms with typed `FormControl<T>`
- Form controls implement `ControlValueAccessor` (see `input.component.ts`)
- Custom validators return `ValidatorFn` (see `validators/is-email/`)

## Styling (ITCSS Architecture)

Styles use ITCSS layers in `styles/layers/`:
- `_setting.scss` - CSS custom properties (use `--gld-` prefix in library)
- `_tools.scss` - Mixins and functions
- `_base.scss` - Element defaults
- `_objects.scss` - Layout patterns
- `_trumps.scss` - Utilities and overrides

## Developer Workflows

```bash
pnpm start          # Local dev server (http://localhost:4200)
pnpm test           # Run Vitest unit tests
pnpm build          # Production build
pnpm linters        # Run stylelint + biome (format + lint)
pnpm biome:check    # Check formatting and linting
```

## Testing

Uses **Vitest** (not Karma/Jest). Test files use `.spec.ts` suffix.

```typescript
import { TestBed } from '@angular/core/testing'
// Simple component test pattern
beforeEach(() => {
  TestBed.configureTestingModule({ imports: [ButtonComponent] })
  fixture = TestBed.createComponent(ButtonComponent)
})
```

## Code Quality

- **Biome** for formatting and linting (not ESLint/Prettier for app code)
- **Stylelint** with BEM pattern for SCSS
- **Commitlint** with conventional commits (via Husky)

## State Management

- Local state: Angular signals (`signal()`, `computed()`)
- Global state: `@ngrx/signals` (prepared in `src/app/shared/store/`)
- Never use `mutate()` on signals - use `update()` or `set()`

## SSR Support

App supports Server-Side Rendering:
- `main.server.ts` - Server bootstrap
- `app.config.server.ts` - Server providers
- `server.ts` - Express server entry

## Template Syntax

- Use native control flow: `@if`, `@for`, `@switch`
- Use `class` bindings, not `ngClass`
- Use `style` bindings, not `ngStyle`
- Use `async` pipe for observables
