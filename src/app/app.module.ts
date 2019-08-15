import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { TranslatorComponent } from './translator/translator.component';
import { ThesaurusComponent } from './thesaurus/thesaurus.component';

@NgModule({
  declarations: [
    AppComponent,
    DictionaryComponent,
    TranslatorComponent,
    ThesaurusComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
