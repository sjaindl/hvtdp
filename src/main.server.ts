import { enableProdMode } from '@angular/core'
import { environment } from './environments/environment'
import { defineCustomElements as defineCustomElementsGoogleMaps } from 'web-google-maps/dist/loader'

if (environment.production) {
  enableProdMode()
}

export { AppServerModule } from './app/app.server.module'

defineCustomElementsGoogleMaps(window)
