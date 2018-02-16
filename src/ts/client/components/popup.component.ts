import { Component, Inject, ChangeDetectorRef } from '@angular/core'
import { SettingsService } from '../services/settings.service'
import { Settings } from '../../common/settings'
import { BrowserModule } from '@angular/platform-browser'
import { DomSanitizer } from '@angular/platform-browser'


@Component({
    selector: 'popup-for-keep',
    template: `
    <div [style.visibility]="isLoading == true ? 'visible' : 'hidden'">
    </div>
    <div *ngIf="error !== null" style="padding: 10px;">
        <h2>Error :-(</h2>
        <p>There has been an error when trying to load data for your Google Keep account.</p>
        <p>What to do:</p>
        <ul>
            <li>Make sure that you are logged into Google Keep</li>
            <li>If the above does not work, contact the developer (check the <a target="_blank" href="options.html">Options page</a> for contact information)</li>
        </ul>
    </div>
    <iframe [style.visibility]="isLoading == false ? 'visible' : 'hidden'" width=500 height=500 [src]="googleKeepURL"></iframe>
    `,
    styles: [`
    iframe {
        border: 0;
    }
    `]
})
export class PopupComponent {
    isLoading: boolean = true
    settings: Settings
    googleKeepURL
    error: string = null

    constructor(
        @Inject(SettingsService) private settingsService: SettingsService,
        @Inject(DomSanitizer) private sanitizer: DomSanitizer,
        @Inject(ChangeDetectorRef) private cd: ChangeDetectorRef
    ) {
        settingsService.getSettings().then((settings: Settings) => {
            this.settings = settings
            this.googleKeepURL = this.sanitizer.bypassSecurityTrustResourceUrl('https://keep.google.com/u/' + settings.lastUsedAccount)
        }).catch((err) => {
            this.error = err
        })
    }

    show() {
        this.isLoading = false
        this.cd.detectChanges()
    }

    ngOnInit() {
        chrome.webRequest.onHeadersReceived.addListener(
            req => {
                console.debug(req)
                if (req.url.indexOf('https://keep.google.com/u/') === 0) {
                    this.show()
                }
                let headers = req.responseHeaders
                for (let i = headers.length -1; i >=0; --i) {
                    let header = headers[i].name.toLowerCase()
                    if (header === 'x-frame-options' || header === 'frame-options') {
                        headers.splice(i, 1)
                    }
                }
                return {
                    responseHeaders: headers
                }
            },
            {
                urls: [
                    '*://*/*'
                ],
                types: [
                    'sub_frame'
                ]
            },
            [
                'blocking',
                'responseHeaders'
            ]
        )
    }
}

