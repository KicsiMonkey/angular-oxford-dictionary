import { Component, OnInit } from '@angular/core';
import { SlideInOutAnimation } from '../animations';
import { OxfordDictionaryService } from '../oxford-dictionary.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-thesaurus',
  templateUrl: './thesaurus.component.html',
  styleUrls: ['./thesaurus.component.css'],
  animations: [SlideInOutAnimation]
})
export class ThesaurusComponent implements OnInit {
  entry: string = '';
  pastEntries: string[] = [];
  sourceLanguages = [
    { id: 'en', language: 'English' },
    { id: 'es', language: 'Spanish' }
  ];
  selectedSourceLanguage: string = 'en';

  result: string = '';
  isBadInput: boolean = false;
  isLoadingResult: boolean = false;
  isLoggingHistory: boolean = true;

  constructor(private oxfordDictionaryService: OxfordDictionaryService) { }

  ngOnInit() {
    //this.getSourceLanguages();
  }

  onEnter() {
    this.search();
  }

  searchButtonHandler() {
    this.search();
  }

  onBackspace() {
    if (this.entry.length == 0) {
      this.isBadInput = false;
      this.result = '';
    }
  }

  onHistoryEntryClick(pastEntry: string) {
    this.entry = pastEntry;
    this.isLoggingHistory = false;
    this.search();
  }

  clearEntryAndResult() {
    this.entry = '';
    this.result = '';
    this.isBadInput = false;
  }

  search() {
    this.result = '';
    this.isBadInput = false;

    if (this.entry && this.entry.length > 0) {
      this.isLoadingResult = true;
      if (true || this.selectedSourceLanguage == 'en') {
        this.oxfordDictionaryService.getSynonymsAntonyms(this.entry, this.selectedSourceLanguage)
          .subscribe(
            result => {
              this.isLoadingResult = false;
              this.updateResult(this.extractSynonymsAntonyms(result));
            },
            error => {
              this.isLoadingResult = false;
            },
            () => this.isLoadingResult = false
          );
      }

      if (true || this.selectedSourceLanguage == 'en' || this.selectedSourceLanguage == 'es') {
        this.oxfordDictionaryService.getExampleSentences(this.entry, this.selectedSourceLanguage)
          .subscribe(
            result => {
              this.isLoadingResult = false;
              this.updateAndFinishResult(this.extractExampleSentences(result));
            },
            error => {
              this.isLoadingResult = false;
              this.updateAndFinishResult('');
            },
            () => this.isLoadingResult = false
          );
      }
    }
  }

  extractSynonymsAntonyms(result: any): string {
    let resultString: string = '';
    (result as any).results[0]
      .lexicalEntries.forEach(lexicalEntry => {
        resultString += 'as a(n) <em>' + lexicalEntry.lexicalCategory.toLowerCase() + '</em><small>\n';
        let synonymsString: string = '<strong>Synonyms:</strong>\n';
        let antonymsString: string = '<strong>Antonyms:</strong>\n';
        let senses = lexicalEntry.entries.forEach(entry => {
          let senses: any = entry.senses;
          senses.forEach(sense => {
            if (sense.synonyms) {
              sense.synonyms.forEach(synonym => {
                if (synonymsString.search('\n' + synonym.text + ',') == -1 && synonymsString.search(', ' + synonym.text + ',') == -1) {
                  synonymsString += synonym.text + ', ';
                }
              });
            }
          });
          senses.forEach(sense => {
            if (sense.antonyms) {
              sense.antonyms.forEach(antonym => {
                if (antonymsString.search(antonym.text) == -1 && antonymsString.search(', ' + antonym.text + ',') == -1) {
                  antonymsString += antonym.text + ', ';
                }
              });
            }
          });
        });
        if (synonymsString !== '<strong>Synonyms:</strong>\n') {
          resultString += '<BLOCKQUOTE>' + synonymsString.slice(0, synonymsString.length - 2) + '\n\n</BLOCKQUOTE>';
        }
        if (antonymsString !== '<strong>Antonyms:</strong>\n') {
          resultString += '<BLOCKQUOTE>' + antonymsString.slice(0, antonymsString.length - 2) + '\n\n</BLOCKQUOTE>';
        }
        resultString += '</small>\n';
      });
    resultString += '<hr>\n\n';
    return resultString;
  }

  extractExampleSentences(result: any): string {
    let resultString: string = 'Example sentences:<small>\n<BLOCKQUOTE>';
    (result as any).results[0]
      .lexicalEntries[0]
      .sentences.forEach(sentence => {
        resultString += '<em>' + '• ' + sentence.text + '</em>\n';
      });
    resultString += '</BLOCKQUOTE></small>'
    return resultString;
  }

  /**
   * Sets the top of the result area with the parameter.
   * @param result 
   */
  updateResult(result: any) {
    this.result = result + this.result;
  }

  /**
   * Sets the bottom of the result area with the parameter.
   * If the result is empty, signals bad input,
   * if not, updates history.
   * @param result 
   */
  updateAndFinishResult(result: any) {
    this.result += result;
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
    if (this.result == '') {
      this.result = `No match found for "${this.entry}".`;
    }
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
   * the source language of monolingual options.
   */
  getSourceLanguages() {
    if (this.sourceLanguages === undefined || this.sourceLanguages.length == 0) {
      this.oxfordDictionaryService.getLanguages().subscribe(
        result => {
          result.results.forEach(languageResult => {
            if (languageResult.type == 'monolingual'
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

}
