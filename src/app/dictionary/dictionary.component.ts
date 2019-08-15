import { Component, OnInit, ViewChild } from '@angular/core';
import { SlideInOutAnimation } from '../animations';
import { Mode } from '../mode';
import { TranslatorComponent } from '../translator/translator.component';
import { ThesaurusComponent } from '../thesaurus/thesaurus.component';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css'],
  animations: [SlideInOutAnimation]
})
export class DictionaryComponent implements OnInit {
  @ViewChild(TranslatorComponent) translator: TranslatorComponent;
  @ViewChild(ThesaurusComponent) thesaurus: ThesaurusComponent;

  mode: Mode = Mode.translator;

  constructor() { }

  ngOnInit() { }
  
  switchModeTo(mode: Mode) {
    this.mode = mode;
  }

  isTranslatorActive(): boolean {
    return this.mode == Mode.translator;
  }

  isThesaurusActive(): boolean {
    return this.mode == Mode.thesaurus;
  }

  getPastEntries(): string[] {
    if(this.translator || this.thesaurus) {
      switch(this.mode) {
        case Mode.translator:
          if(this.translator) {
            return this.translator.pastEntries;
          } else {
            return [];
          }
        case Mode.thesaurus:
          if(this.thesaurus) {
            return this.thesaurus.pastEntries;
          } else {
            return [];
          }
      }  
    } else {
      return [];
    }
  }

  onHistoryEntryClick(pastEntry: string) {
    switch(this.mode) {
      case Mode.translator:
        this.translator.onHistoryEntryClick(pastEntry);
        break;
      case Mode.thesaurus:
        this.thesaurus.onHistoryEntryClick(pastEntry);
        break;
    }
  }
}
