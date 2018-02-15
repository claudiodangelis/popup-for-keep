import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppOptionsModule } from './module'

enableProdMode();

platformBrowserDynamic().bootstrapModule(AppOptionsModule)
