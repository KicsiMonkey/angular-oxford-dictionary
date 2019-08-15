import { Component, OnInit } from '@angular/core';
import { SlideInOutAnimation } from '../animations';
import { OxfordDictionaryService } from '../oxford-dictionary.service';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.css'],
  animations: [SlideInOutAnimation]
})
export class TranslatorComponent implements OnInit {
  entry: string = '';
  pastEntries: string[] = [];
  sourceLanguages = [];
  targetLanguages = [];
  selectedSourceLanguage: string = 'en';
  selectedTargetLanguage: string = 'es';

  result: string = '';
  isBadInput: boolean = false;
  isLoadingResult: boolean = false;
  isLoggingHistory: boolean = true;

  constructor(private oxfordDictionaryService: OxfordDictionaryService) { }

  ngOnInit() {
    this.getSourceLanguages();
    this.getTargetLanguages();
  }

  /**
   * Handles Enter key press.
   */
  onEnter() {
    this.search();
  }

  /**
   * Handles search button press.
   */
  searchButtonHandler() {
    this.search();
  }

  /**
   * Handles Backspace key press.
   * Clears the result area and error signs if entry becomes empty.
   */
  onBackspace() {
    if (this.entry.length == 0) {
      this.isBadInput = false;
      this.result = '';
    }
  }

  /**
   * Handles click on a history entry.
   * Sets the selected entry as the current one and searches.
   * @param pastEntry
   */
  onHistoryEntryClick(pastEntry: string) {
    this.entry = pastEntry;
    this.isLoggingHistory = false;
    this.search();
  }

  /**
   * Clears entry and the result area.
   */
  clearEntryAndResult() {
    this.entry = '';
    this.result = '';
    this.isBadInput = false;
  }

  /**
   * Clears the result area and error signs,
   * then makes an async call to the dictionary service. 
   */
  search() {
    this.result = '';
    this.isBadInput = false;

    if (this.entry && this.entry.length > 0) {
      this.isLoadingResult = true;
      this.oxfordDictionaryService.getTranslation(this.entry, this.selectedSourceLanguage, this.selectedTargetLanguage)
        .subscribe(
          result => {
            this.isLoadingResult = false;
            this.updateResult(this.extractTranslation(result));
          },
          error => {
            this.isLoadingResult = false;
            this.signalBadInput();
          },
          () => this.isLoadingResult = false
        );
    }
  }

  /**
   * Processes the dictionary service's response
   * by traversing the object looking for translation data to display.
   * @param result
   */
  extractTranslation(result: any): string {
    let resultString: string = '';
    (result as any).results[0]
      .lexicalEntries[0]
      .entries.forEach(entry => {
        entry.senses.forEach(sense => {
          if (sense.translations) {
            sense.translations.forEach(translation => {
              if (resultString.search(translation.text) == -1) {
                resultString += (translation.text + '\n');
              }
            });
          } /* else if (sense.definitions) {
            resultString = sense.definitions[0].text;
          } */
          if (sense.subsenses) {
            sense.subsenses.forEach(subsense => {
              if (subsense.translations) {
                subsense.translations.forEach(translation => {
                  if (resultString.search(translation.text) == -1) {
                    resultString += (translation.text + '\n');
                  }
                });
              }
            });
          }
        })
      });
    return resultString;
  }

  /**
   * Sets the result area with the parameter.
   * If the result is empty, signals bad input,
   * if not, updates history.
   * At the end, turns back history logging.
   * @param result 
   */
  updateResult(result: any) {
    this.result = result;
    if (!this.result) {
      this.signalBadInput();
    } else if (this.isLoggingHistory) {
      this.updateHistory();
    }
    this.isLoggingHistory = true;
  }

  /**
   * Sets the result area with an error message,
   * and sets the input error flag triggering UI response.
   */
  signalBadInput() {
    this.result = `No match found for "${this.entry}".`;
    this.isBadInput = true;
  }

  /**
   * Puts the entry on op of the history log
   * and keeps the log 20 or less elements long.
   */
  updateHistory() {
    if (this.pastEntries.length > 20) {
      this.pastEntries.pop();
    }
    this.pastEntries.unshift(this.entry);
  }

  /**
   * Makes an async call to the dictionary service,
   * then traverses the response data set and saves
   * the source language of bilingual options.
   */
  getSourceLanguages() {
    if (this.sourceLanguages === undefined || this.sourceLanguages.length == 0) {
      this.oxfordDictionaryService.getLanguages().subscribe(
        result => {
          result.results.forEach(languageResult => {
            if (languageResult.type == 'bilingual'
              && !this.sourceLanguages.some(sourceLanguage => sourceLanguage.language === languageResult.sourceLanguage.language)) {
              this.sourceLanguages.push(languageResult.sourceLanguage);
              this.sourceLanguages.sort((l1, l2) => {
                return (l1.language < l2.language) ? -1 : 1;
              });
            }
          })
        }
      )
    }
  }

  /**
   * Makes an async call to the dictionary service,
   * then traverses the response data set and saves
   * the target language of the bilingual options with
   * source language of the currently selected
   * source language.
   */
  getTargetLanguages() {
    this.targetLanguages = [];
    this.oxfordDictionaryService.getLanguages().subscribe(
      result => {
        result.results.forEach(languageResult => {
          if (languageResult.type == 'bilingual' && languageResult.sourceLanguage.id == this.selectedSourceLanguage
            && !this.targetLanguages.some(targetLanguage => targetLanguage.language === languageResult.sourceLanguage.language)) {
            this.targetLanguages.push(languageResult.targetLanguage);
            this.targetLanguages.sort((l1, l2) => {
              return (l1.language < l2.language) ? -1 : 1;
            });
          }
        })
      }
    )
  }
  
}
