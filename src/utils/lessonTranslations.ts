export type AppLanguage = 'en' | 'ko' | 'ja';

type LocalizedText = Partial<Record<Exclude<AppLanguage, 'en'>, string>>;

type LocalizedLine = {
  translation?: LocalizedText;
};

type LessonTranslationPack = {
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

function pickLocalized(baseValue: string | undefined, localized: LocalizedText | undefined, language: AppLanguage) {
  if (language === 'en') return baseValue;
  return localized?.[language] ?? baseValue;
}

export function translateLessonData<T extends {
  vocabulary?: any[];
  grammar?: any[];
  key_sentences?: any[];
  texts?: any[];
  translations?: LessonTranslationPack;
}>(lessonData: T, language: AppLanguage): T {
  if (language === 'en') return lessonData;

  const pack = lessonData.translations;
  if (!pack) return lessonData;

  return {
    ...lessonData,
    vocabulary: lessonData.vocabulary?.map((item: any) => ({
      ...item,
      meaning: pickLocalized(item.meaning, pack.vocabulary?.[item.word], language) ?? item.meaning
    })),
    grammar: lessonData.grammar?.map((item: any) => ({
      ...item,
      formal_translation: pickLocalized(item.formal_translation, pack.grammar?.[item.point]?.formal_translation, language) ?? item.formal_translation,
      colloquial_translation: pickLocalized(item.colloquial_translation, pack.grammar?.[item.point]?.colloquial_translation, language) ?? item.colloquial_translation
    })),
    key_sentences: lessonData.key_sentences?.map((item: any) => ({
      ...item,
      translation: pickLocalized(item.translation, pack.keySentences?.[item.sentence]?.translation, language) ?? item.translation,
      colloquial_translation: pickLocalized(item.colloquial_translation, pack.keySentences?.[item.sentence]?.colloquial_translation, language) ?? item.colloquial_translation,
      context: pickLocalized(item.context, pack.keySentences?.[item.sentence]?.context, language) ?? item.context
    })),
    texts: lessonData.texts?.map((text: any) => ({
      ...text,
      content: text.content?.map((line: any, index: number) => ({
        ...line,
        translation: pickLocalized(line.translation, pack.texts?.[text.id]?.lines?.[index]?.translation, language) ?? line.translation
      })),
      vocabulary: text.vocabulary?.map((item: any) => ({
        ...item,
        meaning: pickLocalized(item.meaning, pack.vocabulary?.[item.word], language) ?? item.meaning
      })),
      proper_nouns: text.proper_nouns?.map((item: any) => ({
        ...item,
        meaning: pickLocalized(item.meaning, pack.properNouns?.[item.word], language) ?? item.meaning
      }))
    }))
  };
}
