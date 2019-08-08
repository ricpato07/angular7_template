import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material';
import { PlatformModule } from '@angular/cdk/platform';


@NgModule({
    declarations: [

    ],
    imports: [
        MatDatepickerModule,
        PlatformModule
    ],
    exports: [
        MatDatepickerModule,
        PlatformModule
    ]
})

export class MaterialModule { }
