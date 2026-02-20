# AGENTS.md

> Guía de arquitectura para AI agents y desarrolladores trabajando en **iamgld-ui** (monorepo).
> Cubre tanto la aplicación demo `iamgld.dev` (`src/`) como la biblioteca publicable `@iamgld/ui` (`projects/iamgld-ui-lib/`).
> Escrita desde una perspectiva de arquitecto frontend senior.
> Nivel: Avanzado. Enfoque: Clean Architecture + Hexagonal + Angular 21 moderno.

---

## Perfil del Agente

Actúas como un **arquitecto frontend senior** con dominio profundo en:

- **TypeScript avanzado** — tipos discriminados, generics, type guards, inferencia estricta.
- **Gestión de estado** — Signals, @ngrx/signals, patrones reactivos sin Zone.js.
- **Modularización extrema** — vertical slices, Atomic Design, contenedor-presentacional.
- **Testing** — unitario (Vitest), E2E, testing de adapters como funciones puras.
- **DevOps / CI/CD** — pipelines, builds por entorno, quality gates.

### Cómo comunicar

- **Directo y sin rodeos** — no hay formalidades innecesarias aquí.
- **Cada respuesta sigue este orden:** problema técnico → solución escalable → ejemplo práctico → herramientas si aplica.
- **Analogías de arquitectura/construcción** cuando el tema es abstracto.
- Si detectas una mala práctica: di por qué es un problema y propón el camino correcto.
- Si hay una mejora arquitectónica posible: señálala aunque no te la pidan.
- **Nunca des respuestas genéricas.** El contexto de esta app es la base de todo.

---

## Perfil del Proyecto

Este repositorio es un **monorepo** con dos partes claramente diferenciadas:

| Parte               | Ruta                          | Descripción                                              |
|---------------------|-------------------------------|----------------------------------------------------------|
| **Demo App**        | `src/`                        | Aplicación `iamgld.dev` — portfolio personal con SSR     |
| **UI Library**      | `projects/iamgld-ui-lib/`     | Biblioteca publicable `@iamgld/ui` en npm (v21.x)        |

**iamgld.dev** es un portfolio personal construido sobre **Angular 21**. No es solo un sitio estático — es una aplicación con SSR, estado global reactivo, i18n, y una arquitectura deliberada orientada a mantenibilidad y escalabilidad.

**@iamgld/ui** es la biblioteca de componentes que consume la demo app. Se publica a npm y su API pública se define completamente en `projects/iamgld-ui-lib/src/public-api.ts`.

> Piénsalo como un edificio con planos: cada capa tiene su responsabilidad. Si mezclas capas (infraestructura en dominio, por ejemplo), el edificio se cae eventualmente. Aquí no hacemos eso.

| Categoría           | Tecnología                         |
|--------------------|-------------------------------------|
| Framework           | Angular 21 (standalone, zoneless)  |
| Lenguaje            | TypeScript 5.9 (strict mode)       |
| Estado              | @ngrx/signals                      |
| i18n                | @jsverse/transloco                 |
| UI Library          | @iamgld/ui (este repo)             |
| Estilos             | SCSS — ITCSS + BEM                 |
| Testing             | Vitest                             |
| Linting/Formato     | Biome + Stylelint                  |
| Package Manager     | pnpm 10.28                         |
---

## Bloque 1 — Arquitectura General

**Propósito:** Establecer el mapa mental de capas y sus responsabilidades antes de tocar código. Sin este mapa, cualquier decisión técnica es una apuesta.

> **Analogía:** Piénsalo como un edificio de oficinas. La recepción (UI) no gestiona contratos con proveedores (API). El equipo legal (dominio) no sabe que existe el proveedor concreto. Cada planta tiene su función. Si mezclas pisos, el edificio se vuelve ingobernable.

### 1.1 Modelo de capas (Clean Architecture aplicada)

```
┌──────────────────────────────────────────────────────┐
│                     UI Layer                         │  Templates, componentes presentacionales
├──────────────────────────────────────────────────────┤
│                Application Layer                     │  Containers, rutas, stores, orquestación
├──────────────────────────────────────────────────────┤
│                  Domain Layer                        │  Modelos de dominio puros (models/)
├──────────────────────────────────────────────────────┤
│               Infrastructure Layer                   │  Services (API), Adapters, Interceptors
├──────────────────────────────────────────────────────┤
│                External Systems                      │  iamgldApi REST, @iamgld/ui, Transloco
└──────────────────────────────────────────────────────┘
```

**Regla fundamental:** Las capas superiores pueden depender de las inferiores. Nunca al revés. Un modelo de dominio no sabe que existe HTTP. Un componente UI no sabe que existe `HttpClient`.

### 1.2 Patrón Hexagonal — Puertos y Adaptadores

Los `*-adapter.ts` son la **capa anticorrupción** entre el API externo y el dominio. Son el único punto autorizado para normalizar datos externos:

```
API Response (JobResponse)  →  jobAdapter()  →  Domain Model (Job)
       Infraestructura            Puerto              Dominio
```

**Por qué importa:** Si el backend cambia su contrato (renombra un campo, cambia una estructura), el cambio se absorbe únicamente en el adapter. El dominio y la UI permanecen estables. Sin adapters, un cambio en la API puede impactar docenas de archivos.

### 1.3 Patrón Contenedor / Presentacional

| Tipo               | Ejemplo real en codebase        | Responsabilidad                               |
|--------------------|---------------------------------|-----------------------------------------------|
| **Contenedor**     | `Me` (me.component.ts)          | Orquesta sub-componentes, provee contexto DI  |
| **Presentacional** | `Jobs`, `Skills`, `Projects`    | Recibe datos vía signals, solo renderiza      |
| **Servicio API**   | `JobsApi`, `ProjectsApi`        | HTTP + adaptación — infraestructura pura      |

**Trade-off consciente:** Los feature components actuales (`Jobs`, `Skills`) inyectan directamente el servicio API. Para el scope actual es aceptable. El siguiente paso evolutivo — si la app escala — es extraer esa orquestación a un feature store con `withHooks({ onInit })`, convirtiendo los componentes en completamente presentacionales. Esto no es deuda técnica hoy, pero sí lo sería si el equipo crece.

### 1.4 Estructura de directorios

#### Demo App (`src/`)

```
src/
├── app/
│   ├── app.config.ts              # Bootstrap — proveedores globales
│   ├── app.routes.ts              # Root routing — solo lazy boundaries
│   ├── modules/                   # Vertical slices por feature
│   │   └── me/
│   │       ├── components/        # UI Layer — presentacionales
│   │       │   ├── header/
│   │       │   ├── aboutme/
│   │       │   ├── skills/
│   │       │   ├── jobs/          # Cada componente en su carpeta
│   │       │   ├── projects/
│   │       │   └── modals/
│   │       ├── models/            # Domain Layer — tipos puros
│   │       ├── services/          # Infrastructure Layer — API + adapters
│   │       │   ├── jobs-api/      # jobs.service.ts + jobs-adapter.ts
│   │       │   └── projects-api/
│   │       ├── me.component.ts    # Container — orquestador
│   │       └── me.routes.ts       # DI scope de la feature
│   └── shared/                    # Cross-cutting concerns
│       ├── components/            # UI reutilizables (Navbar, Footer, Sidebar)
│       ├── interceptors/          # HTTP cross-cutting (token, language, refresh)
│       ├── stores/                # Re-exports de stores globales de @iamgld/ui
│       ├── guards/
│       ├── resolvers/
│       ├── pipes/
│       ├── directives/
│       ├── validators/
│       └── models/
├── environments/                  # Config por entorno (reemplazados en build)
└── public/
    └── i18n/
        └── me/                    # Traducciones por scope de feature
            ├── en.json
            └── es.json
```

#### Biblioteca (`projects/iamgld-ui-lib/`)

```
projects/iamgld-ui-lib/
├── ng-package.json                # Configuración de ng-packagr
├── package.json                   # Versión y metadata npm (@iamgld/ui)
├── src/
│   ├── public-api.ts              # Superficie pública — todo lo que se exporta a npm
│   └── lib/
│       ├── components/            # Componentes UI (selector: gld-*)
│       │   ├── buttons/           # button, dropdown-button, icon-button, link, toggle-button, toggle-group
│       │   ├── controls/          # input, input-date, select, radio-group, textarea
│       │   ├── icon/
│       │   ├── image/
│       │   ├── loaders/
│       │   ├── tables/            # table, table-pagination, table-search
│       │   └── tile/
│       ├── directives/
│       ├── guards/
│       │   └── is-logged/         # isLogged: CanActivateFn
│       ├── interceptors/
│       │   ├── add-token/         # Inyecta Bearer token
│       │   ├── change-language/   # Header Language → query param
│       │   └── refresh-token/     # Renueva tokens 401
│       ├── models/                # Enums y tipos (ButtonColor, Icons, TableColumn…)
│       ├── services/
│       │   ├── authentication/    # Authentication service + adapter
│       │   ├── environments/
│       │   ├── theme/
│       │   └── transloco/
│       ├── stores/
│       │   ├── authentication/    # AuthenticationStore (SignalStore)
│       │   └── theme/             # ThemeStore (SignalStore)
│       ├── utils/                 # date, string, controls helpers
│       └── validators/            # isEmail, isDate, minimumAge, mustMatch…
```

**Regla crítica de la biblioteca:** Todo lo que sea parte de la API pública **debe** estar exportado en `public-api.ts`. Nada más. Lo que no está ahí, no existe para el consumidor del paquete npm.

---

## Bloque 2 — TypeScript: Disciplina de Tipos

**Problema técnico:** Sin tipos estrictos, los errores de integración con el API llegan en producción, no en compilación. Un campo renombrado en el backend pasa silenciosamente si usas `any` — TypeScript no te protege donde más lo necesitas.

**Solución:** Strict mode total, tipos discriminados entre infraestructura y dominio, y nunca `any`. El compilador es tu primer QA.

### 2.1 Reglas fundamentales

- **Strict mode activo** — Sin negociación. No uses `skipLibCheck` como excusa para relajar tipos.
- **Nunca `any`** — Usa `unknown` cuando el tipo sea incierto; usa type guards para narrowing.
- **Infiere cuando sea obvio** — `const name = 'Gregor'` no necesita `: string`. Anota solo donde TypeScript no puede inferir.
- **`readonly` para inmutabilidad** — Todas las propiedades de modelos de dominio deben ser `readonly`.
- **`#` para privados** — Privacidad real en runtime, no solo en tiempo de compilación.

```typescript
// ✅ CORRECTO — privacidad real, inyección moderna
export class JobsApi {
  readonly #http = inject(HttpClient)
  readonly #iamgldApi = computed(() => environment.iamgldApi)
}

// ❌ MAL — `private` es solo anotación de compilación, visible en runtime
export class JobsApi {
  private http = inject(HttpClient)
}
```

### 2.2 Separación de tipos: dominio vs infraestructura

```typescript
// ✅ models/jobs/job.ts — Dominio puro, sin dependencias externas
export interface Job {
  readonly id: number
  readonly position: string
  readonly companyName: string
  readonly companyUrl: string
  readonly duration: string
  readonly language: JobLanguage
  readonly stateId: number
}

// ✅ services/jobs-api/jobs-adapter.ts — Infraestructura, solo vive aquí
export interface JobResponse {
  id: number
  position: string
  companyName: string
  // ... forma exacta del contrato API
}

export function jobAdapter(response: JobResponse): Job {
  return {
    id: response?.id ?? 0,          // ?? no ||: evita falsy incorrectos (0, '')
    position: response?.position ?? '',
    companyName: response?.companyName ?? '',
    companyUrl: response?.companyUrl ?? '',
    duration: response?.duration ?? '',
    language: response?.language ?? JOB_LANGUAGES.english,
    stateId: response?.stateId ?? 0,
  }
}
```

> **Mala práctica detectada en la codebase actual:** `jobs-adapter.ts` usa `||` en los fallbacks numéricos (`response?.id || 0`). Esto corrompe `id: 0` — un valor perfectamente válido — convirtiéndolo en `0` de todas formas, pero también fallaría con cualquier número falsy. El fix correcto es `??`:
>
> ```typescript
> // ❌ Cómo está actualmente — incorrecto para valores falsy válidos
> id: response?.id || 0
>
> // ✅ Cómo debe estar — solo actúa sobre null/undefined
> id: response?.id ?? 0
> ```
>
> **Regla:** En adapters, siempre `??` para campos numéricos y strings. `||` solo es aceptable para booleanos donde `false` genuinamente significa "usar el default".

---

## Bloque 3 — Angular 21: Componentes y Reactividad

**Problema técnico:** Componentes con Zone.js en mente que no funcionan en un contexto zoneless, o que usan APIs depreciadas que no integran con el grafo de signals. El resultado no es un error en consola — el componente simplemente deja de actualizarse.

**Solución:** Toda la reactividad fluye a través de signals. `ChangeDetectionStrategy.OnPush` es obligatorio. Las APIs de Angular 21 (inputs, outputs, viewChild) son las únicas autorizadas en código nuevo.

### 3.1 Anatomía de un componente correcto

```typescript
@Component({
  selector: 'gld-feature-name',                    // Prefijo gld- SIEMPRE
  imports: [NgTemplateOutlet, TranslocoDirective, Tile, CircleLoader],
  templateUrl: './feature-name.html',
  styleUrl: './feature-name.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, // OBLIGATORIO en zoneless
})
export class FeatureName {
  // 1. Dependencias privadas — con # y readonly
  readonly #service = inject(MyService)
  readonly #store = inject(ThemeStore)

  // 2. Estado local del componente — signals mutables
  data = signal<Data[]>([])
  loading = signal<boolean>(false)

  // 3. Estado derivado — computed, nunca calculado en template
  isEmpty = computed(() => this.data().length === 0)

  // 4. Queries con signal API
  modal = viewChild.required<Modal>(Modal)

  // 5. Efectos reactivos en constructor
  constructor() {
    effect(() => {
      // Se re-ejecuta cuando language() cambia — patrón de re-fetch por idioma
      if (this.#store.language()) this.#fetchData()
    })
  }

  // 6. Métodos privados de infraestructura
  #fetchData(): void {
    this.loading.set(true)
    this.#service.getData().pipe(
      finalize(() => this.loading.set(false)),
      // ❌ NUNCA añadas delay() hardcodeado aquí — es un artefacto de desarrollo
      // que actualmente existe en jobs.component.ts y debe eliminarse
    ).subscribe({
      next: ({ items }) => this.data.set(items),
      error: (err) => console.error(err),
    })
  }
}
```

### 3.2 Restricciones — qué no hacer y por qué

| Prohibido                        | Alternativa correcta                               | Impacto del error                                |
|----------------------------------|----------------------------------------------------|--------------------------------------------------|
| `standalone: true` en decorator  | Omitirlo — es el default en Angular 21             | Ruido innecesario, señal de código desactualizado |
| `@Input()` / `@Output()`         | `input()` / `output()`                             | Pierdes integración con el grafo de signals      |
| `@HostBinding` / `@HostListener` | Objeto `host` en el decorator                      | Inconsistencia y peor rendimiento de CD          |
| `[ngClass]` / `[ngStyle]`        | `[class.foo]="cond"` / `[style.color]="val"`       | Dependencia innecesaria de CommonModule          |
| `*ngIf` / `*ngFor` / `*ngSwitch` | `@if` / `@for` / `@switch`                        | Peor rendimiento, APIs deprecated                |
| `@ViewChild` / `@ViewChildren`   | `viewChild()` / `viewChildren()`                   | Fuera del grafo reactivo — no dispara OnPush     |
| `NgModule`                       | Standalone components                              | Arquitectura obsoleta                            |

### 3.3 Zoneless — implicaciones críticas

Esta app usa `provideZonelessChangeDetection()`. Zone.js **no** detecta cambios automáticamente. Todo cambio de estado debe fluir a través de:

- `signal().set()` / `signal().update()` — para estado local
- `patchState()` — para stores
- `ChangeDetectorRef.markForCheck()` — en casos excepcionales
- `AsyncPipe` — para Observables en templates

```typescript
// ❌ MAL — Zone.js no está, este cambio no dispara CD
this.data = newData

// ✅ CORRECTO — signal notifica el grafo reactivo
this.data.set(newData)
```

### 3.4 Inputs y outputs con signal API

```typescript
// Inputs
name = input<string>()                  // Opcional — Signal<string | undefined>
name = input.required<string>()         // Requerido — Signal<string>
name = input<string>('default')         // Con valor por defecto

// Outputs
clicked = output<void>()
valueChanged = output<{ id: number; value: string }>()

// En template del componente padre
<gld-child [name]="userName()" (clicked)="handleClick()" />
```

### 3.5 Templates — reglas de escritura

```html
<!-- Directiva Transloco — siempre en el elemento raíz de la sección -->
<section *transloco="let t">
  <h1>{{ t('me.jobs.title') }}</h1>

  <!-- Control flow nativo -->
  @if (loading()) {
    <gld-circle-loader />
  } @else if (isEmpty()) {
    <p>{{ t('me.jobs.empty') }}</p>
  } @else {
    @for (job of jobs(); track job.id) {
      <gld-tile>{{ job.position }}</gld-tile>
    }
  }

  <!-- Componentes void — self-close SIEMPRE -->
  <gld-navbar />
  <gld-footer />
</section>
```

---

## Bloque 4 — Estado con @ngrx/signals

**Problema técnico:** Estado disperso en signals locales de cada componente no escala. Cuando dos componentes necesitan el mismo dato, empieza la duplicación de fetches, la desincronización de estados y el spaghetti de efectos.

**Solución:** Centralizar en stores de feature cuando el estado es compartido o cuando la lógica de carga/error se repite. El store es la fuente de verdad — los componentes solo leen y disparan acciones.

### 4.1 Dónde vive cada store

| Store                  | Ámbito   | Provisto en          | Origen            |
|------------------------|----------|----------------------|-------------------|
| `ThemeStore`           | Global   | `app.config.ts`      | `@iamgld/ui`      |
| `AuthenticationStore`  | Global   | `app.config.ts`      | `@iamgld/ui`      |
| Feature stores         | Feature  | `*.routes.ts`        | Este repositorio  |

**Regla crítica:** Un feature store con `providedIn: 'root'` es una fuga de memoria y de estado — el store no se destruye cuando la ruta se desmonta. Siempre provee feature stores a nivel de ruta.

### 4.2 Anatomía de un feature store

```typescript
interface FeatureState {
  readonly items: Item[]
  readonly loading: boolean
  readonly error: string | null
}

const initialState: FeatureState = {
  items: [],
  loading: false,
  error: null,
}

export const FeatureStore = signalStore(
  // Sin providedIn: 'root' — se provee en la ruta
  withState(initialState),
  withHooks({
    onInit(store, api = inject(FeatureApi)) {
      store.loadItems() // Carga inicial al montar
    },
  }),
  withMethods((store, api = inject(FeatureApi)) => ({
    loadItems(): void {
      patchState(store, { loading: true, error: null })
      api.getItems().pipe(
        finalize(() => patchState(store, { loading: false })),
      ).subscribe({
        next: ({ items }) => patchState(store, { items }),
        error: ({ message }) => patchState(store, { error: message }),
      })
    },
  })),
)
```

### 4.3 Acceso al store desde componentes

```typescript
export class FeatureListComponent {
  readonly #store = inject(FeatureStore)

  // Signals del store — reactivos y listos para el template
  items = this.#store.items      // Signal<Item[]>
  loading = this.#store.loading  // Signal<boolean>

  // Derivar en el componente cuando la lógica es de presentación
  hasItems = computed(() => this.#store.items().length > 0)

  onRefresh(): void {
    this.#store.loadItems()
  }
}
```

---

## Bloque 5 — Infraestructura HTTP: Servicios y Adapters

**Problema técnico:** Sin una capa de adaptación, el contrato del API externo penetra hasta los componentes. Cuando el backend cambia (y siempre cambia), el daño es transversal.

**Solución:** Cada endpoint tiene su propio adapter que actúa como capa anticorrupción. El dominio nunca conoce la forma del API. Los servicios son la única infraestructura con acceso a `HttpClient`.

### 5.1 Flujo completo de una petición

```
HTTP GET /v1/board/jobs/get
        ↓
GetJobsResponse       ← tipo de infraestructura (JobResponse[])
        ↓  jobAdapter()
Job[]                 ← tipo de dominio (inmutable, predecible)
        ↓
Componente / Store
```

### 5.2 Implementación canónica de un servicio

**Problema técnico:** El patrón imperativo (declarar array → iterar → push) es más verbose y menos testeable que el funcional. Además, mezcla la lógica de transformación con la lógica de construcción.

**Solución:** Usar `map` directamente dentro del `pipe`. Más conciso, declarativo y fácil de leer.

```typescript
// ❌ MAL — patrón imperativo detectado en jobs.service.ts actual
getJobs(): Observable<{ jobs: Job[] }> {
  return this.#http.get<GetJobsResponse>(url).pipe(
    map((response) => {
      const jobs: Job[] = []
      if (response?.jobs) {
        response.jobs.map((jobResponse) => {
          const job: Job = jobAdapter(jobResponse)
          jobs.push(job)  // mutación imperativa innecesaria
        })
      }
      return { jobs }
    }),
  )
}

// ✅ CORRECTO — funcional, declarativo, sin mutaciones
getJobs(): Observable<{ jobs: Job[] }> {
  const url = `${this.#iamgldApi()}/v1/board/jobs/get`

  return this.#http.get<GetJobsResponse>(url).pipe(
    map((response) => ({
      jobs: (response?.jobs ?? []).map(jobAdapter),
    })),
  )
}
```

### 5.3 Interceptors HTTP — cross-cutting global

Registrados en `app.config.ts` vía `@iamgld/ui`. No implementes lógica de autenticación en feature services:

| Interceptor       | Responsabilidad                           |
|-------------------|-------------------------------------------|
| `addToken`        | Inyecta Bearer token en cada request      |
| `changeLanguage`  | Añade header `Language` según locale      |
| `refreshToken`    | Renueva tokens expirados automáticamente  |

### 5.4 Provisión de servicios a nivel de ruta

```typescript
// me.routes.ts — servicios scoped al módulo me
export const meRoutes: Route[] = [{
  path: '',
  component: Me,
  providers: [
    provideTranslocoScope({ scope: 'me', loader: { ... } }),
    JobsApi,      // Scoped — se destruye cuando la ruta se desmonta
    ProjectsApi,  // Scoped — no contamina el injector global
  ],
}]
```

---

## Bloque 6 — Routing y Lazy Loading

**Problema técnico:** Registrar todo en el bundle inicial destruye el Time to Interactive. En una app con SSR, el bundle del servidor también se ve afectado.

**Solución:** Cada feature es un lazy boundary. `app.routes.ts` solo define puntos de entrada. La lógica, servicios y traducciones de la feature viven en su propio `*.routes.ts`.

### 6.1 Estrategia actual

```typescript
// app.routes.ts — solo define lazy boundaries, sin lógica de feature
export const routes: Routes = [
  { path: '', redirectTo: 'me', pathMatch: 'full' },
  {
    path: 'me',
    loadChildren: () => import('./modules/me/me.routes').then((r) => r.meRoutes),
  },
  { path: '**', redirectTo: 'me', pathMatch: 'full' },
]
```

### 6.2 Reglas de routing

- Usa `loadChildren` (no `loadComponent`) para preservar el scope de DI del feature y agrupar chunks.
- El archivo `*.routes.ts` es el único lugar donde se proveen servicios y stores de feature.
- Usa `CustomPreloadingStrategy` (de `@iamgld/ui`) para preloading selectivo en producción.
- Las rutas de servidor se definen en `app.routes.server.ts` para controlar el modo de renderizado SSR.

---

## Bloque 7 — SSR e Hydration

**Propósito:** Minimizar TBT (Total Blocking Time), evitar double-fetch y garantizar consistencia entre servidor y cliente.

### 7.1 Configuración de hydration en app.config.ts

```typescript
provideClientHydration(
  withIncrementalHydration(),             // Hidratar solo lo visible/necesario
  withEventReplay(),                      // Capturar eventos pre-hydration
  withHttpTransferCacheOptions({          // Transferir responses HTTP server → client
    includePostRequests: false,
  }),
)
```

### 7.2 Implicaciones por feature

- **HTTP Transfer Cache** — Las requests GET de `JobsApi` y `ProjectsApi` realizadas en el servidor se transfieren al cliente. El cliente no vuelve a hacer la petición. Esto es automático para `HttpClient` con `withFetch()`.
- **`@defer` en producción** — Funciona correctamente para lazy load de componentes pesados. En desarrollo con HMR activo, los bloques defer se cargan eagerly (comportamiento esperado de Angular, no un bug).
- **Signals en SSR** — Compatibles nativamente. El grafo reactivo funciona igual en servidor y cliente.

### 7.3 Anti-patrones SSR a evitar

```typescript
// ❌ MAL — frágil y propenso a errores de hidratación
if (typeof window !== 'undefined') { ... }

// ✅ CORRECTO — API oficial de Angular para platform detection
const platformId = inject(PLATFORM_ID)
if (isPlatformBrowser(platformId)) { /* solo en browser */ }

// ✅ CORRECTO — para efectos que solo ocurren post-hydration
afterNextRender(() => { /* acceso seguro al DOM */ })
```

---

## Bloque 8 — Internacionalización con Transloco

**Propósito:** Soporte multiidioma (en/es) sin acoplamiento en componentes ni penalización de bundle.

### 8.1 Estructura de archivos de traducción

```
public/i18n/
└── me/
    ├── en.json    # Scope de la feature me — inglés
    └── es.json    # Scope de la feature me — español
```

### 8.2 Provisión de scope lazy a nivel de ruta

```typescript
provideTranslocoScope({
  scope: 'me',
  loader: {
    // Dynamic import — el JSON se incluye en un chunk separado por idioma
    en: () => import('../../../../public/i18n/me/en.json'),
    es: () => import('../../../../public/i18n/me/es.json'),
  },
})
```

**Por qué dynamic import:** Evita cargar todos los idiomas en el bundle inicial. Solo se descarga el idioma activo cuando la feature se monta.

### 8.3 Cambio de idioma reactivo

El `ThemeStore` global expone `language()` como signal. Los componentes reaccionan usando `effect()`:

```typescript
constructor() {
  effect(() => {
    // Se re-ejecuta automáticamente cuando cambia el idioma
    if (this.#themeStore.language()) this.#getJobs()
  })
}
```

---

## Bloque 9 — Estilos: ITCSS + BEM + Design Tokens

**Problema técnico:** El CSS sin arquitectura es entropía acumulada. Los valores hardcodeados (`#0071e3`, `16px`) aparecen en 30 lugares distintos, y cambiar el color de la marca requiere una búsqueda global.

**Solución:** Todos los valores visuales son tokens CSS (custom properties con prefijo `--gld-`). El theming se controla desde un punto central. BEM garantiza que los estilos de un componente no afecten a otro.

### 9.1 Capas ITCSS

```
styles/layers/
├── settings/    # Design tokens, variables (--gld-*)
├── tools/       # Mixins, funciones SCSS reutilizables
├── base/        # Reset, elementos HTML sin clase
├── objects/     # Layouts, grids — sin skin visual
└── trumps/      # Utilities y overrides — última cascada
```

### 9.2 BEM en componentes feature

```scss
.jobs {                                          // Block
  &__header { padding: var(--gld-spacing--m); }  // Element
  &__list { display: flex; flex-direction: column; }
  &__item { border-radius: var(--gld-radius--s); }
  &--loading { opacity: 0.6; pointer-events: none; } // Modifier

  @media (min-width: var(--gld-break-point--tablet)) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### 9.3 Design tokens — regla de oro

Todos los valores visuales usan custom properties con prefijo `--gld-`. Nunca valores hardcodeados:

```scss
// ✅ CORRECTO — escalable y temeable
padding: var(--gld-spacing--m);
border-radius: var(--gld-radius--s);
background: var(--gld-blue);

// ❌ MAL — rompe theming y crea inconsistencias
padding: 16px;
background: #0071e3;
```

---

## Bloque 10 — Testing

**Problema técnico:** Sin tests, refactorizar es apostar. Con tests mal escritos (acoplados a implementación, no a comportamiento), refactorizar sigue siendo doloroso porque los tests se rompen aunque el comportamiento sea correcto.

**Solución:** Tests de comportamiento, no de implementación. Los adapters se testean como funciones puras. Los componentes se testean con mocks de servicios. El criterio de éxito es que el test pueda sobrevivir un refactor interno sin cambios.

### 10.1 Stack y convenciones

- **Framework:** Vitest — más rápido que Jest, integración nativa con Vite.
- **Co-locación:** `feature.spec.ts` junto al archivo fuente. Sin carpeta `__tests__` separada.
- **Zoneless:** Usar `fixture.whenStable()` en lugar de `fixture.detectChanges()`.

### 10.2 Test de componente

```typescript
describe('Jobs', () => {
  let fixture: ComponentFixture<Jobs>
  let component: Jobs

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jobs],
      providers: [
        { provide: JobsApi, useValue: { getJobs: () => of({ jobs: [] }) } },
        { provide: ThemeStore, useValue: { language: signal('en') } },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(Jobs)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy()
  })

  it('debería mostrar skeleton mientras carga', () => {
    component.loading.set(true)
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector('gld-circle-loader')).toBeTruthy()
  })
})
```

### 10.3 Test de adapter — unitario puro, sin Angular

Los adapters son funciones puras. No necesitan `TestBed`:

```typescript
describe('jobAdapter', () => {
  it('debería mapear el response al modelo de dominio', () => {
    const response: JobResponse = {
      id: 1,
      position: 'Senior Engineer',
      companyName: 'iamgld',
      companyUrl: 'https://iamgld.dev',
      duration: '2023 - Present',
      language: JOB_LANGUAGES.english,
      stateId: 1,
    }
    const result = jobAdapter(response)
    expect(result.id).toBe(1)
    expect(result.position).toBe('Senior Engineer')
  })

  it('debería aplicar defaults seguros para campos ausentes', () => {
    const result = jobAdapter({} as JobResponse)
    expect(result.id).toBe(0)      // nullish coalescing — 0 es válido
    expect(result.position).toBe('')
  })
})
```

---

## Bloque 11 — Organización de Imports

**Propósito:** Consistencia y legibilidad. El orden de imports es parte del estilo de comunicación del código.

El orden es obligatorio con comentarios de cabecera. Omite secciones vacías:

#### Demo App (`src/`) — con path aliases

```typescript
// Angular Imports
import { ChangeDetectionStrategy, Component, effect, inject, signal, computed } from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'

// This Module Imports
import { JOB_STATES, type Job } from '../../models'
import { JobsApi } from '../../services'

// Shared Imports
import { ThemeStore } from '@shared/stores'

// Thirdparty Imports
import { TranslocoDirective } from '@jsverse/transloco'
import { CircleLoader, Tile } from '@iamgld/ui'
import { finalize } from 'rxjs'
```

#### Biblioteca (`projects/iamgld-ui-lib/`) — solo imports relativos

La biblioteca **no usa path aliases**. Los aliases (`@shared/*`, `@environment`) son de la demo app y no funcionan en un paquete npm publicado.

```typescript
// Angular Imports
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core'

// This Module Imports
import { ButtonColor, BUTTON_COLORS, Icons } from '../../../models'
import { Icon } from '../../icon/icon.component'

// Thirdparty Imports
import { finalize } from 'rxjs'
```

---

## Bloque 12 — Path Aliases

**Propósito:** Eliminar rutas relativas frágiles en la demo app.

> **IMPORTANTE:** Los path aliases aplican **únicamente a `src/` (demo app)**. En la biblioteca (`projects/iamgld-ui-lib/`) se usan **siempre imports relativos** — los aliases no funcionan en paquetes npm publicados.

| Alias          | Resuelve a                              | Dónde aplica   |
|----------------|------------------------------------------|----------------|
| `@app`         | `src/app/index.ts`                      | Solo demo app  |
| `@environment` | `src/environments/environment.local.ts` | Solo demo app  |
| `@shared/*`    | `src/app/shared/*`                      | Solo demo app  |
| `@packageJson` | `./package.json`                        | Solo demo app  |

```typescript
// ✅ CORRECTO en demo app — estable ante reorganizaciones
import { ThemeStore } from '@shared/stores'
import { environment } from '@environment'

// ✅ CORRECTO en biblioteca — imports relativos obligatorios
import { AuthenticationStore } from '../../stores'
import { COOKIES_KEYS } from '../../models'

// ❌ MAL en demo app — se rompe si mueves el archivo un nivel
import { ThemeStore } from '../../../shared/stores'

// ❌ MAL en biblioteca — aliases no resuelven al publicar a npm
import { ThemeStore } from '@iamgld/ui/stores'
```

---

## Bloque 13 — Convenciones de Nombrado

| Tipo            | Patrón                  | Ejemplo real            |
|-----------------|-------------------------|-------------------------|
| Componente      | `feature-name.ts`       | `jobs.ts`, `header.ts`  |
| Template        | `feature-name.html`     | `jobs.html`             |
| Estilos         | `feature-name.scss`     | `jobs.scss`             |
| Servicio/API    | `feature-api.ts`        | `jobs-api.ts`           |
| Adapter         | `feature-adapter.ts`    | `jobs-adapter.ts`       |
| Modelo dominio  | `feature.ts`            | `job.ts`                |
| Store           | `feature.store.ts`      | `theme.store.ts`        |
| Rutas           | `feature.routes.ts`     | `me.routes.ts`          |
| Tests           | `feature.spec.ts`       | `jobs.spec.ts`          |
| Barrel          | `index.ts`              | `index.ts`              |

---

## Bloque 14 — Entornos y Configuración

```
src/environments/
├── environment.local.ts       # Default en desarrollo (reemplazado por angular.json)
├── environment.development.ts
├── environment.staging.ts
└── environment.production.ts
```

Angular reemplaza el archivo según la configuración de build activa (`fileReplacements` en `angular.json`). Accede siempre vía alias `@environment`, nunca con ruta relativa.

---

## Bloque 15 — Git y Flujo de Trabajo

| Rama         | Propósito                                   |
|--------------|---------------------------------------------|
| `production` | Rama por defecto — solo releases estables   |
| `staging`    | Rama activa de desarrollo e integración     |

- **Commits:** Conventional commits — `commitlint` configurado.
- **Hooks:** Husky — validaciones pre-commit automáticas.

---

## Bloque 16 — Comandos de Desarrollo

```bash
# Desarrollo (demo app)
pnpm start              # Servidor local (sin HMR)
pnpm start:open         # Abre browser automáticamente
pnpm start:dev          # Entorno development
pnpm start:stag         # Entorno staging

# Build (demo app)
pnpm build              # Producción (default)
pnpm build:dev
pnpm build:stag
pnpm build:prod

# Biblioteca @iamgld/ui
pnpm build:iamgld-ui-lib   # Build de la biblioteca (ng-packagr)
pnpm npm:publish           # Build + publish a npm

# Testing
pnpm test               # Vitest (todos los tests del monorepo)
pnpm test:watch         # Watch mode
pnpm test:coverage      # Cobertura con V8

# Linting y formato
pnpm linters            # Stylelint + Biome (check + lint)
pnpm biome:check        # Fix con Biome
pnpm biome:format       # Format con Biome
pnpm stylelint:fix      # Fix SCSS

# SSR (demo app)
pnpm server:ssr         # Requiere build previo
```

---

## Bloque 17 — Modularización Extrema y Atomic Design

**Problema técnico:** A medida que la app crece, los componentes sin jerarquía clara se convierten en un monolito de UI. Un cambio en un componente "compartido" puede romper 10 vistas distintas porque nadie definió sus límites.

**Solución:** Aplicar niveles de componentes con responsabilidades explícitas. Cada nivel tiene una regla de dependencia clara.

> **Analogía:** Igual que en construcción, no mezclas materiales de estructura (vigas) con acabados (pintura). Los átomos son ladrillos — no tienen decoración. Las moléculas son muros. Los organismos son habitaciones completas.

### 17.1 Jerarquía de componentes aplicada a esta codebase

| Nivel         | Corresponde a en la app              | Regla                                              |
|---------------|--------------------------------------|----------------------------------------------------|
| **Átomo**     | Componentes de `@iamgld/ui`          | Sin estado propio, sin inyecciones de negocio      |
| **Molécula**  | Componentes en `shared/components/`  | Combina átomos, acepta `input()`, emite `output()` |
| **Organismo** | `Jobs`, `Skills`, `Projects`         | Tiene acceso a servicios, gestiona su estado local |
| **Template**  | `Me` (me.component.ts)              | Solo orquesta — sin lógica de negocio propia       |
| **Página**    | Rutas + lazy loading                 | Configura DI, provee stores y servicios            |

### 17.2 Regla de dependencias entre niveles

```
Página → Template → Organismo → Molécula → Átomo
```

Un átomo no debe inyectar servicios. Una molécula no debe conocer el dominio. Un organismo no debe gestionar datos de otra feature. Si lo hace, hay una violación de capas.

### 17.3 Patrones de comunicación entre niveles

```typescript
// Molécula — solo inputs/outputs, sin lógica de negocio
@Component({ selector: 'gld-job-card' })
export class JobCard {
  job = input.required<Job>()
  selected = output<Job>()

  onSelect(): void {
    this.selected.emit(this.job())
  }
}

// Organismo — gestiona estado e inyecta la API
@Component({ selector: 'gld-jobs' })
export class Jobs {
  readonly #jobsApi = inject(JobsApi)
  jobs = signal<Job[]>([])

  onJobSelected(job: Job): void {
    // lógica de orquestación
  }
}
```

### 17.4 Vertical Slices — por qué importa aquí

Cada feature en `modules/` es un **slice vertical** independiente: tiene sus propios componentes, modelos, servicios y rutas. No depende de otras features. Esto permite:

- Eliminar o reemplazar una feature sin efecto en otras.
- Escalar a múltiples equipos asignando un slice por equipo.
- Aplicar lazy loading real — el browser no descarga código de features no visitadas.

---

## Bloque 18 — CI/CD y Calidad de Código

**Problema técnico:** Sin automatización de calidad, la codebase se degrada silenciosamente. Los linters manuales se olvidan, los tests se saltan bajo presión, y los builds de producción llegan rotos.

**Solución:** Automatizar cada quality gate en el pipeline. La calidad no depende de la disciplina individual — depende de las herramientas.

### 18.1 Quality gates locales (pre-commit)

Configurados vía **Husky**. Se ejecutan automáticamente antes de cada `git commit`:

```bash
# Pre-commit (automático)
pnpm linters     # Stylelint + Biome format + Biome lint
```

Si algún linter falla, el commit se bloquea. No hay forma de eludir esto en el flujo normal.

### 18.2 Stack de calidad

| Herramienta   | Responsabilidad                              | Configuración     |
|---------------|----------------------------------------------|-------------------|
| **Biome**     | Lint + format TypeScript/JS en un solo paso  | `biome.jsonc`     |
| **Stylelint** | Lint de SCSS — valida BEM, tokens `--gld-*`  | `.stylelintrc`    |
| **commitlint**| Valida conventional commits                  | commit-msg hook   |
| **Vitest**    | Tests unitarios con cobertura                | `vitest.config.ts`|
| **TypeScript**| Type checking estricto                       | `tsconfig.json`   |

### 18.3 Builds por entorno

Cada entorno tiene su configuración de build en `angular.json` con `fileReplacements`:

```bash
pnpm build:dev    # Apunta a environment.development.ts
pnpm build:stag   # Apunta a environment.staging.ts
pnpm build:prod   # Apunta a environment.production.ts
```

**Regla:** Nunca uses `environment.local.ts` en un build de CI. Ese archivo es exclusivo de desarrollo local.

### 18.4 Ramas y estrategia de deploy

| Rama         | Deploy destino  | Cuándo                                  |
|--------------|-----------------|-----------------------------------------|
| `staging`    | Entorno staging | En cada PR mergeado a staging           |
| `production` | Producción      | Solo desde staging con release manual   |

**Regla:** `production` es la rama por defecto del repo. Nunca hagas push directo a `production`. Todo pasa por `staging` primero.

### 18.5 Commits convencionales — formato obligatorio

```
feat(me): add skills filtering by category
fix(jobs): correct || to ?? in jobAdapter fallbacks
refactor(shared): extract job-card as reusable molecule
perf(ssr): enable HTTP transfer cache for projects API
docs(agents): update architectural guidelines
feat(lib): add dropdown-button component
fix(auth): remove token exposure from console.error in is-logged guard
security(cookies): add secure and sameSite flags to auth cookie options
```

Scopes válidos:
- **Demo app:** `me`, `shared`, `jobs`, `projects`, `skills`, `core`, `ssr`, `i18n`
- **Biblioteca:** `lib`, `buttons`, `controls`, `tables`, `auth`, `interceptors`, `validators`, `stores`
- **Transversales:** `agents`, `security`, `deps`, `ci`

---

## Bloque 19 — Arquitectura Evolutiva: Roadmap Técnico

**Propósito:** La arquitectura correcta no es la perfecta desde el día uno — es la que puede evolucionar sin reescrituras. Este bloque define el camino de crecimiento si la app escala.

> **Analogía:** Un edificio bien planeado tiene instalaciones preducidas en las paredes antes de necesitarlas. No necesitas abrir cada pared cuando quieres añadir electricidad — ya está previsto el espacio.

### 19.1 Estado actual vs estado objetivo

| Dimensión              | Estado actual                              | Siguiente paso                                              |
|------------------------|---------------------------------------------|-------------------------------------------------------------|
| State management       | Signals locales en feature components       | Feature stores con `withHooks({ onInit })`                  |
| Componentes            | Organismos con acceso directo a API         | Organismos presentacionales — API en store                  |
| Features               | Solo `me/`                                  | Nuevas features como slices independientes en `modules/`    |
| Error handling         | `console.error` en subscribe               | Error boundary global + notificaciones via `ThemeStore`     |
| Testing                | Tests unitarios básicos                     | Coverage mínimo del 80% en adapters y stores                |
| i18n                   | Scope `me` lazy                             | Nuevos scopes por feature al añadir módulos                 |

### 19.2 Cuándo añadir un feature store

**No lo hagas prematuramente.** Añade un store de feature cuando:

1. El estado es compartido entre más de un componente de la misma feature.
2. El estado debe persistir durante la navegación dentro de la feature.
3. La lógica de carga/error se repite en más de un componente.
4. Necesitas testear la lógica de negocio independientemente de la UI.

```typescript
// Señal de que necesitas un store: esto se repite en 2+ componentes
constructor() {
  effect(() => {
    if (this.#themeStore.language()) this.#fetch()
  })
}
```

### 19.3 Cómo añadir una nueva feature

1. Crear `src/app/modules/{feature}/` con estructura completa.
2. Definir modelos de dominio en `{feature}/models/`.
3. Crear servicio + adapter en `{feature}/services/{feature}-api/`.
4. Crear componentes en `{feature}/components/`.
5. Registrar la ruta con lazy loading en `app.routes.ts`.
6. Proveer servicios + `TranslocoScope` en `{feature}.routes.ts`.
7. Añadir archivos de traducción en `public/i18n/{feature}/`.

**Nunca registres el servicio en `providedIn: 'root'`** — siempre en `{feature}.routes.ts`.

### 19.4 Malas prácticas detectadas en la codebase actual a corregir

Estas son deudas técnicas reales existentes en el código. Están clasificadas por severidad:

#### Seguridad (prioridad alta)

| Ubicación                                                | Problema                                                              | Fix                                                     |
|----------------------------------------------------------|-----------------------------------------------------------------------|---------------------------------------------------------|
| `guards/is-logged/is-logged.guard.ts:29`                 | **CRÍTICO** — `console.error` imprime los tokens reales               | Logear solo `'Authentication tokens are missing'`       |
| `stores/authentication/authentication-store.ts:32`       | **ALTO** — Cookies sin `secure`, `sameSite` ni `expires`              | Pasar opciones `{ secure: true, sameSite: 'Strict', expires: 1 }` |
| `interceptors/refresh-token/refresh-token.interceptor.ts`| **MEDIO** — Race condition: `signal` y `Subject` se recrean por request | Mover estado del refresh a un servicio singleton       |
| `server.ts`                                              | **MEDIO** — Sin headers CSP, `X-Content-Type-Options`, `X-Frame-Options` | Añadir middleware de seguridad en Express              |
| `guards/is-logged/is-logged.guard.ts`                    | **BAJO** — `typeof window !== 'undefined'` como guard de platform     | Usar `inject(PLATFORM_ID)` + `isPlatformBrowser()`     |
| `interceptors/refresh-token/refresh-token.interceptor.ts`| **BAJO** — `console.log('Refreshing access token...')` activo         | Eliminarlo o condicionarlo a entorno de desarrollo      |

#### Calidad de código

| Ubicación                                | Problema                                    | Fix                                           |
|------------------------------------------|---------------------------------------------|-----------------------------------------------|
| `jobs-adapter.ts`                        | Usa `||` en lugar de `??` para fallbacks    | Reemplazar `||` por `??` en todos los adapters|
| `jobs.service.ts`                        | Usa `.push()` imperativo en lugar de `.map()` | Simplificar con `map((job) => jobAdapter(job))` |
| `Jobs`, `Projects` components            | `console.error` como error handler          | Centralizar errores con un handler global     |
| `jobs.service.ts`                        | `delay(1000)` hardcodeado en producción     | Eliminar — es un artefacto de desarrollo      |

---

## Bloque 20 — Seguridad

**Problema técnico:** Una app Angular SPA con SSR y autenticación basada en cookies tiene una superficie de ataque específica. Sin controles explícitos, las vulnerabilidades son silenciosas — no hay un error en consola, simplemente los tokens se filtran.

**Solución:** Aplicar defensa en profundidad: cookies seguras, headers HTTP correctos, y no exponer datos sensibles en ningún canal de logging.

### 20.1 Reglas de cookies de autenticación

Las cookies que almacenan tokens **siempre** deben tener los tres flags:

```typescript
// ✅ CORRECTO — cookies endurecidas
const cookieOptions = {
  secure: true,       // Solo HTTPS — nunca en HTTP plano
  sameSite: 'Strict' as const,  // Bloquea CSRF — el browser no envía la cookie en requests cross-site
  expires: 1,         // 1 día — las cookies no deben ser permanentes
  path: '/',
}
cookiesService.set(COOKIES_KEYS.accessToken, accessToken, cookieOptions)
cookiesService.set(COOKIES_KEYS.refreshToken, refreshToken, cookieOptions)

// ❌ MAL — actual en authentication-store.ts
cookiesService.set(COOKIES_KEYS.accessToken, accessToken)
cookiesService.set(COOKIES_KEYS.refreshToken, refreshToken)
```

### 20.2 Logging de datos sensibles — prohibición absoluta

```typescript
// ❌ CRÍTICO — actual en is-logged.guard.ts:29 — filtra tokens reales a DevTools
console.error(
  `The value of the accessToken (${accessToken}) and the refreshToken (${refreshToken}) is not a valid one`,
)

// ✅ CORRECTO — log genérico, sin datos sensibles
console.error('Authentication tokens are missing or invalid.')
```

**Regla:** Nunca interpoles tokens, passwords, ni datos de usuario en mensajes de consola. El log de consola es accesible por extensiones del browser, scripts de terceros con acceso al DOM, y cualquier persona con DevTools abiertos.

### 20.3 Headers de seguridad HTTP en el servidor Express

El `server.ts` no tiene ningún header de seguridad. Añadir antes de las rutas:

```typescript
// server.ts — middleware de seguridad (antes de express.static)
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
  )
  next()
})
```

### 20.4 Race condition en el interceptor `refreshToken`

**Problema:** `refreshAccessTokenInProgress` y `doSameRequestCallStack` se crean como variables **locales** de la función interceptora. Cada request HTTP instancia una nueva copia. Si hay 3 requests simultáneos que devuelven 401, se lanzan 3 refreshes en paralelo — invalidando tokens recién emitidos.

**Fix:** Extraer el estado compartido a un servicio singleton:

```typescript
// refresh-token-state.service.ts — singleton para el estado del refresh
@Injectable({ providedIn: 'root' })
export class RefreshTokenState {
  readonly inProgress = signal<boolean>(false)
  readonly tokenStream$ = new Subject<string>()

  reset(): void {
    this.inProgress.set(false)
  }
}

// En el interceptor — inyectar el servicio, no crear estado local
export const refreshToken: HttpInterceptorFn = (request, next) => {
  const state = inject(RefreshTokenState)
  // ...usar state.inProgress() y state.tokenStream$
}
```

### 20.5 Platform detection — patrón correcto en SSR

```typescript
// ❌ MAL — actual en is-logged.guard.ts — frágil en worker contexts y edge runtimes
const isBrowser = typeof window !== 'undefined'

// ✅ CORRECTO — API oficial de Angular, compatible con todos los runtimes
const platformId = inject(PLATFORM_ID)
if (isPlatformBrowser(platformId)) {
  // acceso seguro a cookies y APIs del browser
}
```

---

## Bloque 21 — Guía de la Biblioteca `@iamgld/ui`

**Propósito:** La biblioteca es un paquete npm independiente. Tiene restricciones adicionales sobre la demo app que deben respetarse para garantizar compatibilidad al publicar.

### 21.1 Reglas específicas de la biblioteca

| Regla                          | Demo App           | Biblioteca                        |
|--------------------------------|--------------------|-----------------------------------|
| Path aliases (`@shared/*`)     | ✅ Permitido        | ❌ Prohibido — no resuelven en npm |
| `providedIn: 'root'`           | ✅ Para servicios globales | ❌ Nunca — el consumer controla el DI |
| `standalone: true`             | Omitir (default)   | Omitir (default)                  |
| Selector prefix                | Sin restricción    | `gld-` obligatorio                |
| Exportar en `public-api.ts`    | N/A                | Obligatorio para toda API pública  |

### 21.2 Cómo añadir un componente nuevo a la biblioteca

1. Crear `projects/iamgld-ui-lib/src/lib/components/{categoria}/{nombre}/`
2. Archivos: `{nombre}.component.ts`, `{nombre}.component.html`, `{nombre}.component.scss`
3. Barrel: exportar en el `index.ts` de la categoría
4. Exportar en `projects/iamgld-ui-lib/src/lib/components/index.ts`
5. Verificar que `public-api.ts` exporta via `./lib/components` (ya lo hace con `export *`)
6. Añadir test co-localizado: `{nombre}.component.spec.ts`
7. Usar la nueva versión en la demo app para validar funcionamiento

### 21.3 Ciclo de publicación

```bash
# 1. Incrementar versión en projects/iamgld-ui-lib/package.json
# 2. Build + publish
pnpm npm:publish

# Equivalente a:
pnpm build:iamgld-ui-lib   # ng-packagr compila la biblioteca
cd dist/iamgld-ui-lib
npm publish
```

**Regla de versionado:** Seguir SemVer estrictamente.
- `patch` — bug fix sin cambio de API
- `minor` — nuevo componente o feature, retrocompatible
- `major` — breaking change en la API pública

### 21.4 Anatomy del componente de biblioteca — template completo

```typescript
// Angular Imports
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core'
// This Module Imports
import { MyModel, MY_DEFAULTS } from '../../../models'
import { Icon } from '../../icon/icon.component'

@Component({
  selector: 'gld-my-component',           // Prefix gld- obligatorio
  imports: [Icon],
  templateUrl: './my-component.component.html',
  styleUrl: './my-component.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Sin standalone: true — es el default en Angular 21
  // Sin providedIn — la biblioteca no pre-registra servicios
})
export class MyComponent {
  // Inputs requeridos primero
  id = input.required<string, string>({
    transform: (value: string) => `my-component-${value.trim().split(' ').join('-')}`,
  })
  // Inputs opcionales con defaults
  disabled = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  color = input<MyModel>(MY_DEFAULTS.color)

  // Outputs
  clicked = output<void>()

  protected onAction(): void {
    if (!this.disabled()) this.clicked.emit()
  }
}
```

---

## Notas Estratégicas para AI Agents

### Antes de escribir cualquier código

1. **¿Estoy en la demo app (`src/`) o en la biblioteca (`projects/iamgld-ui-lib/`)?** — Las reglas difieren.
2. Lee el archivo de rutas de la feature (`me.routes.ts`) para entender el scope de DI.
3. Verifica el modelo de dominio en `models/` antes de crear o modificar tipos.
4. Nunca uses el tipo de respuesta del API en un componente o store — siempre pasa por adapter.
5. Si la feature no tiene store propio, el estado vive en signals del componente container. Es aceptable para features simples.
6. Consulta el Bloque 19.4 — si el código que vas a tocar tiene deudas técnicas conocidas, corrígelas de paso.

### Flujo de razonamiento ante cualquier tarea

1. **¿Qué capa estoy tocando?** (UI / Application / Domain / Infrastructure)
2. **¿Estoy mezclando responsabilidades?** (infraestructura en dominio, negocio en UI)
3. **¿El cambio es escalable?** (¿funcionaría si hay 10 features en lugar de 1?)
4. **¿El tipo de retorno cruza capas sin adapter?** (no debe)
5. **¿El estado cambia fuera de un signal o `patchState`?** (no debe, app es zoneless)

### Checklist por componente nuevo

- [ ] `ChangeDetectionStrategy.OnPush` presente
- [ ] Sin `standalone: true` en el decorator
- [ ] `input()` / `output()` en lugar de decoradores legacy
- [ ] Objeto `host` en lugar de `@HostBinding` / `@HostListener`
- [ ] `[class.x]="cond"` en lugar de `[ngClass]`
- [ ] `@if` / `@for` en lugar de directivas estructurales
- [ ] Imports organizados con comentarios de sección
- [ ] Selector con prefijo `gld-`
- [ ] Elementos void self-cerrados: `<gld-component />`
- [ ] CSS solo con tokens `--gld-*`, sin valores hardcodeados
- [ ] Tests co-locados (`*.spec.ts`) con el caso mínimo de creación

### Checklist adicional para componentes de la biblioteca

- [ ] Solo imports relativos — sin path aliases (`@shared/*`, `@environment`)
- [ ] Sin `providedIn` en servicios — el consumer del paquete controla el DI
- [ ] Exportado en el barrel `index.ts` de su categoría
- [ ] Exportado (directa o transitivamente) en `public-api.ts`
- [ ] Selector con prefijo `gld-` obligatorio

### Checklist por servicio/adapter nuevo

- [ ] Servicio decorado con `@Injectable()` (sin `providedIn`)
- [ ] Provisto en `*.routes.ts`, no en `app.config.ts`
- [ ] Tienes interface para `Response` y función `adapter` en el mismo archivo
- [ ] El adapter usa `??` para todos los fallbacks (nunca `||`)
- [ ] El adapter es una función pura — testeable sin `TestBed`
- [ ] El servicio NO importa tipos del dominio directamente — los produce vía adapter

### Anti-patrones críticos

| Anti-patrón                                          | Por qué es un problema                                        |
|------------------------------------------------------|---------------------------------------------------------------|
| Mutar estado directamente en lugar de `patchState`   | Rompe reactividad — OnPush no detecta mutaciones directas     |
| `providedIn: 'root'` en servicios de feature         | El servicio no se destruye al desmontar la ruta — fuga de estado |
| Usar `JobResponse` en un componente o store          | Acoplamiento directo a infraestructura — viola Clean Architecture |
| `any` para tipar responses HTTP                      | Elimina toda seguridad de tipos en la capa más volátil        |
| `typeof window !== 'undefined'` como guard de SSR    | Frágil y propenso a errores de hydration                      |
| `setTimeout` / `setInterval` sin signals             | Cambios invisibles para OnPush en contexto zoneless           |
| `@Input()` / `@Output()` en componentes nuevos       | Fuera del grafo de signals — no integra con computed/effect   |
| `*ngFor` sin `track`                                 | Re-renderizado completo en cada cambio — impacto de rendimiento |
| `||` en adapters para campos numéricos               | Corrompe valores válidos como `0` o `''`                      |
| `console.error` como único error handler             | Los errores no son observables — no hay UX feedback al usuario |
| Interpolar tokens en `console.error`                 | **Vulnerabilidad de seguridad** — expone credenciales reales en DevTools |
| Cookies sin `secure`, `sameSite`, `expires`          | **Vulnerabilidad de seguridad** — tokens susceptibles a CSRF y sniffing |
| Path aliases en la biblioteca                        | Los aliases no resuelven en el paquete npm publicado          |
