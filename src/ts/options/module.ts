import 'zone.js/dist/zone';
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { OptionsComponent } from './options.component'
import { SettingsService } from '../client/services/settings.service'

@NgModule({
    imports: [
        BrowserModule,
    ],
    declarations: [
        OptionsComponent
    ],
    entryComponents: [
        OptionsComponent
    ],
    providers: [
        SettingsService
    ],
    bootstrap: [
        OptionsComponent
    ]
})
export class AppOptionsModule {}

