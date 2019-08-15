import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LanguageSet, JsonLanguageSetsResponse } from './language';

const httpOptions = {
  headers: new HttpHeaders(
    {
      "Accept": "application/json",
      "app_id": "0b30d9db",
      "app_key": "45cccd1cfc921a7b1b863d382a31a38f",
    }
  )
};

@Injectable({
  providedIn: 'root'
})
export class OxfordDictionaryService {
  apiUrl = '/od-api';

  constructor(private http: HttpClient) { }

  getTranslation(entry: string, sourceLanguage: string, targetLanguage: string): Observable<object> {
    return this.http.get(
      `${this.apiUrl}/entries/${sourceLanguage}/${entry.split(' ').join('_')}/translations=${targetLanguage}`,
      httpOptions
    );
  }

  getSynonymsAntonyms(entry: string, sourceLanguage: string): Observable<object> {
    return this.http.get(
      `${this.apiUrl}/entries/${sourceLanguage}/${entry.split(' ').join('_')}/synonyms;antonyms`,
      httpOptions
    );
  }

  getExampleSentences(entry: string, sourceLanguage: string): Observable<object> {
    return this.http.get(
      `${this.apiUrl}/entries/${sourceLanguage}/${entry.split(' ').join('_')}/sentences`,
      httpOptions
    );
  }

  getThesaurusInfo(entry: string, sourceLanguage: string): Observable<object>[] {
    return [
      this.getSynonymsAntonyms(entry, sourceLanguage),
      this.getExampleSentences(entry, sourceLanguage)
    ]
  }

  getLanguages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/languages`, httpOptions);
  }

}
