/**
 * Helper class for autocomplete.
 */
export class Language {
    id: string;
    language: string;
}

export class LanguageSet {
    region: string;
    source: string;
    sourceLanguage: Language;
    targetLanguage: Language;
    type: string;
}

export class JsonLanguageSetsMetaData {
    provider: string;
}

export class JsonLanguageSetsResponse {
    metadata: JsonLanguageSetsMetaData;
    results: LanguageSet[]; 
}