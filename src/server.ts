import { join } from 'node:path'
import {
	AngularNodeAppEngine,
	createNodeRequestHandler,
	isMainModule,
	writeResponseToNodeResponse,
} from '@angular/ssr/node'
import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

const browserDistFolder = join(import.meta.dirname, '../browser')

const app = express()
const angularApp = new AngularNodeAppEngine()

/**
 * Security headers via Helmet.
 */
app.use(headersHelmet())

/**
 * Rate limiting — protects SSR rendering from DoS abuse.
 * 100 requests per minute per IP.
 */
app.use(
	rateLimit({
		windowMs: 60_000,
		max: 100,
		standardHeaders: true,
		legacyHeaders: false,
	}),
)

function headersHelmet() {
	return helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				scriptSrc: ["'self'"],
				styleSrc: ["'self'", "'unsafe-inline'"],
				fontSrc: ["'self'"],
				imgSrc: ["'self'", 'data:'],
				connectSrc: ["'self'"],
				frameSrc: ["'none'"],
				objectSrc: ["'none'"],
				baseUri: ["'self'"],
				formAction: ["'self'"],
				upgradeInsecureRequests: [],
			},
		},
		referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
		hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
		frameguard: { action: 'deny' },
		noSniff: true,
		xssFilter: true,
		permittedCrossDomainPolicies: false,
	})
}

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
	express.static(browserDistFolder, {
		maxAge: '1y',
		index: false,
		redirect: false,
	}),
)

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
	angularApp
		.handle(req)
		.then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
		.catch(next)
})

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
	const port = process.env['PORT'] || 4000
	app.listen(port, (error) => {
		if (error) {
			throw error
		}

		console.log(`Node Express server listening on http://localhost:${port}`)
	})
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app)
