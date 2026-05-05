import type { AppLanguage } from './lessonTranslations';
export type { AppLanguage } from './lessonTranslations';

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
  tapToFlipFront: string;
  tapToFlipBack: string;
  audioTooltip: string;
  playAlt: string;
  landingHero: string;
  learned: string;
  done: string;
  sub: string;
  restart: string;
  textTitlePrefix: string;
  langEn: string;
  langKo: string;
  langJa: string;
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
    footerTagline: 'MODERN HAN ELEGANT • HSK 4 MASTER',
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
    properNouns: '专有名词 (Proper Nouns)',
    tapToFlipFront: 'Tap to flip',
    tapToFlipBack: 'Tap to see word',
    audioTooltip: 'Click to hear pronunciation',
    playAlt: 'Play',
    landingHero: `HSK 4 prep, but make it vibe. <strong>Red</strong> is the textbook stuff you need to know. <strong>Gold</strong> is the real-world talk people actually use. <strong>RedGold</strong> brings it all together for the ultimate HSK 4 experience. No robots allowed.`,
    learned: 'Learned',
    done: 'Well Done!',
    sub: "You've mastered this session.",
    restart: 'Restart Session',
    textTitlePrefix: 'Text',
    langEn: 'English',
    langKo: 'Korean',
    langJa: 'Japanese'
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
    footerTagline: 'MODERN HAN ELEGANT • HSK 4급 마스터',
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
    properNouns: '专有名词 (고유명사)',
    tapToFlipFront: '눌러서 뒤집기',
    tapToFlipBack: '다시 단어 보기',
    audioTooltip: '발음 듣기',
    playAlt: '재생',
    landingHero: `HSK 4급, 이제 '진짜'로 배워보자고. <strong>Red</strong>는 우리가 꼭 알아야 할 교과서 정석. <strong>Gold</strong>는 현지인들이 입에 달고 사는 찐 생활 중국어. 이 둘이 만나 <strong>RedGold</strong>가 됐어. 뻔한 공부 말고 진짜 실력을 키워봐.`,
    learned: '학습 완료',
    done: '참 잘했어요!',
    sub: '이번 세션을 모두 완료했습니다.',
    restart: '다시 시작',
    textTitlePrefix: '본문',
    langEn: '영어',
    langKo: '한국어',
    langJa: '일본어'
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
    footerTagline: 'MODERN HAN ELEGANT • HSK 4級マスター',
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
    properNouns: '专有名词 (固有名詞)',
    tapToFlipFront: 'タップで裏返す',
    tapToFlipBack: '単語を再確認',
    audioTooltip: 'クリックで発音を確認',
    playAlt: '再生',
    landingHero: `HSK 4級、もっとエモく学ぼう。<strong>Red</strong>は基本の教科書モード。<strong>Gold</strong>はネイティブがガチで使うリアルな言い回し。この二つが合体して <strong>RedGold</strong>。ロボットみたいな中国語はもう卒業しない？`,
    learned: '学習済み',
    done: 'お疲れ様でした！',
    sub: 'このセッションを完了しました。',
    restart: '再開する',
    textTitlePrefix: '本文',
    langEn: '英語',
    langKo: '韓国語',
    langJa: '日本語'
  }
};

export function getUiCopy(language: AppLanguage): UiCopy {
  return UI_COPY[language];
}
