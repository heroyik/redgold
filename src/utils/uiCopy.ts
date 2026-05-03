import type { AppLanguage } from './lessonTranslations';

type UiCopy = {
  chapter: string;
  volume1: string;
  volume2: string;
  exploreLessons: string;
  comingSoon: string;
  loading: string;
  tabVocab: string;
  tabGrammar: string;
  tabTexts: string;
  tabMastery: string;
  tabReview: string;
  footerTagline: string;
  footerBrand: string;
  formalLabel: string;
  colloquialLabel: string;
  colloquialPattern: string;
  tipToColloquial: string;
  tipToBack: string;
  masteryEmpty: string;
  masteryFormal: string;
  masteryColloquial: string;
  listening: string;
  newWords: string;
  properNouns: string;
};

const UI_COPY: Record<AppLanguage, UiCopy> = {
  en: {
    chapter: 'Chapter',
    volume1: 'Volume 1 (上)',
    volume2: 'Volume 2 (下)',
    exploreLessons: `Let's get into it`,
    comingSoon: 'Coming Soon',
    loading: 'Loading...',
    tabVocab: 'Vocab',
    tabGrammar: 'Grammar',
    tabTexts: 'Texts',
    tabMastery: 'Mastery',
    tabReview: 'Review',
    footerTagline: 'MODERN HAN ELEGANT • BLCUP OFFICIAL CURRICULUM',
    footerBrand: 'MODERN HAN ELEGANT',
    formalLabel: 'Textbook Formal',
    colloquialLabel: 'Native Colloquial',
    colloquialPattern: 'Colloquial Pattern',
    tipToColloquial: 'Tap to see colloquial version →',
    tipToBack: 'Tap to go back ←',
    masteryEmpty: 'No mastery sentences available for this chapter.',
    masteryFormal: '✨ Standard Han',
    masteryColloquial: '🔥 Living Language',
    listening: 'Listening',
    newWords: '生词 (New Words)',
    properNouns: '专有名词 (Proper Nouns)'
  },
  ko: {
    chapter: '레슨',
    volume1: '상권 (上)',
    volume2: '하권 (下)',
    exploreLessons: '그럼 바로 시작?',
    comingSoon: '곧 업데이트돼요',
    loading: '불러오는 중...',
    tabVocab: '단어',
    tabGrammar: '표현',
    tabTexts: '본문',
    tabMastery: '마스터',
    tabReview: '복습',
    footerTagline: 'MODERN HAN ELEGANT • BLCUP 공식 커리큘럼',
    footerBrand: 'MODERN HAN ELEGANT',
    formalLabel: '교과서 표현',
    colloquialLabel: '실전 구어체',
    colloquialPattern: '구어체 패턴',
    tipToColloquial: '눌러서 구어체 버전 보기 →',
    tipToBack: '다시 보려면 눌러주세요 ←',
    masteryEmpty: '이 레슨에는 마스터 문장이 아직 없어요.',
    masteryFormal: '✨ 표준 표현',
    masteryColloquial: '🔥 실전 표현',
    listening: '듣기',
    newWords: '생词 (새 단어)',
    properNouns: '专有名词 (고유명사)'
  },
  ja: {
    chapter: 'Lesson',
    volume1: '上巻 (上)',
    volume2: '下巻 (下)',
    exploreLessons: 'さっそくいこう',
    comingSoon: 'まもなく追加',
    loading: '読み込み中...',
    tabVocab: '単語',
    tabGrammar: '文法',
    tabTexts: '本文',
    tabMastery: '定着',
    tabReview: '復習',
    footerTagline: 'MODERN HAN ELEGANT • BLCUP公式カリキュ럼',
    footerBrand: 'MODERN HAN ELEGANT',
    formalLabel: '教科書の表現',
    colloquialLabel: 'ネイティブの口語',
    colloquialPattern: '口語パターン',
    tipToColloquial: 'タップして口語版を見る →',
    tipToBack: 'タップして戻る ←',
    masteryEmpty: 'このレッスンには定着文がまだありません。',
    masteryFormal: '✨ 標準表現',
    masteryColloquial: '🔥 生きた言い方',
    listening: '音声',
    newWords: '生词 (新出単語)',
    properNouns: '专有名词 (固有名詞)'
  }
};

export function getUiCopy(language: AppLanguage): UiCopy {
  return UI_COPY[language];
}
