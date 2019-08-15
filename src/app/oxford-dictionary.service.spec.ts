import { TestBed, inject } from '@angular/core/testing';

import { OxfordDictionaryService } from './oxford-dictionary.service';

describe('OxfordDictionaryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OxfordDictionaryService]
    });
  });

  it('should be created', inject([OxfordDictionaryService], (service: OxfordDictionaryService) => {
    expect(service).toBeTruthy();
  }));
});
