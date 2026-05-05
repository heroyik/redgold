export type AppLanguage = 'en' | 'ko' | 'ja';

type LocalizedText = string; // Now just a string since we access it via translations[language]

type LocalizedLine = {
  translation?: LocalizedText;
};

type LanguageTranslationPack = {
  vocabulary?: Record<string, LocalizedText>;
  properNouns?: Record<string, LocalizedText>;
  grammar?: Record<string, {
    formal_translation?: LocalizedText;
    colloquial_translation?: LocalizedText;
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

export type LessonTranslations = Partial<Record<Exclude<AppLanguage, 'en'>, LanguageTranslationPack>>;

export function translateLessonData<T extends {
  vocabulary?: any[];
  grammar?: any[];
  key_sentences?: any[];
  texts?: any[];
  translations?: LessonTranslations;
}>(lessonData: T, language: AppLanguage): T {
  if (language === 'en') return lessonData;

  const pack = lessonData.translations?.[language];
  if (!pack) return lessonData;

  return {
    ...lessonData,
    vocabulary: lessonData.vocabulary?.map((item: any) => ({
      ...item,
      meaning: pack.vocabulary?.[item.word] ?? item.meaning
    })),
    grammar: lessonData.grammar?.map((item: any) => ({
      ...item,
      formal_translation: pack.grammar?.[item.point]?.formal_translation ?? item.formal_translation,
      colloquial_translation: pack.grammar?.[item.point]?.colloquial_translation ?? item.colloquial_translation
    })),
    key_sentences: lessonData.key_sentences?.map((item: any) => ({
      ...item,
      translation: pack.keySentences?.[item.text]?.translation ?? item.translation,
      colloquial_translation: pack.keySentences?.[item.text]?.colloquial_translation ?? item.colloquial_translation,
      context: pack.keySentences?.[item.text]?.context ?? item.context
    })),
    texts: lessonData.texts?.map((text: any) => ({
      ...text,
      content: text.content?.map((line: any, index: number) => ({
        ...line,
        translation: pack.texts?.[text.id]?.lines?.[index] ?? line.translation
      })),
      vocabulary: text.vocabulary?.map((item: any) => ({
        ...item,
        meaning: pack.vocabulary?.[item.word] ?? item.meaning
      })),
      proper_nouns: text.proper_nouns?.map((item: any) => ({
        ...item,
        meaning: pack.properNouns?.[item.word] ?? item.meaning
      }))
    }))
  };
}
