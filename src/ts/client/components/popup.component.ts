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

    constructor(
        @Inject(SettingsService) private settingsService: SettingsService,
        @Inject(DomSanitizer) private sanitizer: DomSanitizer,
        @Inject(ChangeDetectorRef) private cd: ChangeDetectorRef
    ) {
        settingsService.getSettings().then((settings: Settings) => {
            this.settings = settings
            this.googleKeepURL = this.sanitizer.bypassSecurityTrustResourceUrl('https://keep.google.com/u/' + settings.lastUsedAccount)
        })
    }

    show() {
        this.isLoading = false
        this.cd.detectChanges()
    }

    ngOnInit() {
        chrome.webRequest.onHeadersReceived.addListener(
            req => {
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

