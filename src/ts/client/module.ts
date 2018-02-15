import 'zone.js/dist/zone';
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { PopupComponent } from './components/popup.component'
import { SettingsService } from './services/settings.service'

@NgModule({
    imports: [
        BrowserModule,
    ],
    declarations: [
        PopupComponent,
    ],
    entryComponents: [
        PopupComponent,
    ],
    providers: [
        SettingsService
    ],
    bootstrap: [
        PopupComponent,
    ]
})
export class AppModule {}

