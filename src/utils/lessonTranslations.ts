export type AppLanguage = 'en' | 'ko' | 'ja';

type LocalizedText = Partial<Record<AppLanguage, string>>;

type LocalizedLine = {
  translation?: LocalizedText;
};

type LessonTranslationPack = {
  vocabulary?: Record<string, LocalizedText>;
  properNouns?: Record<string, LocalizedText>;
  lessonTitle?: LocalizedText;
  textTitles?: Record<number, LocalizedText>;
  grammar?: Record<string, {
    formal_translation?: LocalizedText;
    colloquial_translation?: LocalizedText;
    formal_examples?: Array<{ translation?: LocalizedText }>;
    colloquial_examples?: Array<{ translation?: LocalizedText }>;
  }>;
  keySentences?: Record<string, {
    translation?: LocalizedText;
    colloquial_translation?: LocalizedText;
    context?: LocalizedText;
  }>;
  texts?: Record<number, {
    lines?: Record<number, LocalizedLine>;
  }>;
};

function normalizeEnglishText(text: string) {
  return text.replace(/([A-Za-z])\s*[’']\s*([A-Za-z])/g, "$1'$2");
}

function pickLocalized(localized: LocalizedText | undefined, language: AppLanguage) {
  const text = localized?.[language];
  if (language === 'en' && text) {
    return normalizeEnglishText(text);
  }
  return text;
}

export function getTextVocab(data: { texts?: any[] }): any[] {
  const map = new Map<string, any>();
  data.texts?.forEach((t: any) => {
    (t.vocabulary || []).forEach((v: any) => {
      if (!map.has(v.word)) {
        map.set(v.word, v);
      }
    });
  });
  return [...map.values()];
}

export function translateLessonData<T extends {
  vocabulary?: any[];
  grammar?: any[];
  key_sentences?: any[];
  texts?: any[];
  translations?: LessonTranslationPack;
}>(lessonData: T, language: AppLanguage): T {
  const pack = lessonData.translations;
  if (!pack) return lessonData;

  return {
    ...lessonData,
    vocabulary: lessonData.vocabulary?.map((item: any) => ({
      ...item,
      meaning: pickLocalized(pack.vocabulary?.[item.word], language)
    })),
    grammar: lessonData.grammar?.map((item: any) => {
      const grammarPack = pack.grammar?.[item.point];
      return {
        ...item,
        explanation: pickLocalized(grammarPack?.formal_translation, language),
        nuance: pickLocalized(grammarPack?.colloquial_translation, language),
        formal_translation: pickLocalized(grammarPack?.formal_translation, language),
        colloquial_translation: pickLocalized(grammarPack?.colloquial_translation, language),
        formal_examples: item.formal_examples?.map((example: any, index: number) => ({
          ...example,
          translation: pickLocalized(grammarPack?.formal_examples?.[index]?.translation, language)
        })),
        colloquial_examples: item.colloquial_examples?.map((example: any, index: number) => ({
          ...example,
          translation: pickLocalized(grammarPack?.colloquial_examples?.[index]?.translation, language)
        }))
      };
    }),
    key_sentences: lessonData.key_sentences?.map((item: any) => ({
      ...item,
      translation: pickLocalized(pack.keySentences?.[item.sentence]?.translation, language),
      colloquial_translation: pickLocalized(pack.keySentences?.[item.sentence]?.colloquial_translation, language),
      context: pickLocalized(pack.keySentences?.[item.sentence]?.context, language)
    })),
    texts: lessonData.texts?.map((text: any) => {
      // Strip English (last paren group), then extract/strip pinyin (remaining paren group)
      let titlePart = text.title?.replace(/\([^)]*\)\s*$/, '').trim() || text.title;
      const pinyinMatch = titlePart.match(/\(([^)]+)\)\s*$/);
      const titlePinyin = pinyinMatch ? pinyinMatch[1] : '';
      const titleClean = titlePinyin ? titlePart.replace(/\([^)]+\)\s*$/, '').trim() : titlePart;
      return {
        ...text,
        title: titleClean,
        titlePinyin,
        localeTitle: pickLocalized(pack.textTitles?.[text.id], language) || '',
        content: text.content?.map((line: any, index: number) => ({
          ...line,
          translation: pickLocalized(pack.texts?.[text.id]?.lines?.[index]?.translation, language)
        })),
        vocabulary: text.vocabulary?.map((item: any) => ({
          ...item,
          meaning: pickLocalized(pack.vocabulary?.[item.word], language) || item.meaning
        })),
        proper_nouns: text.proper_nouns?.map((item: any) => ({
          ...item,
          meaning: pickLocalized(pack.properNouns?.[item.word], language)
        }))
      };
    })
  };
}
