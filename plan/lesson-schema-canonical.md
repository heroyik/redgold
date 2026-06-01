# 📐 Lesson JSON Canonical Schema (lesson1.json 기준)

> **목적:** `data/lesson{N}.json`의 공식 스키마를 정의한다. 모든 새 레슨은 이 스키마를 따라야 한다.
> **기준 파일:** `data/lesson1.json` (최신 리팩토링 완료)
> **작성일:** 2026-06-01
> **버전:** v1.0

---

## 1. 최상위 구조

```typescript
interface LessonData {
  lessonId: number;           // 레슨 번호 (e.g., 1)
  title: string;              // "Lesson 1: 简单的爱情 (Simple Love)"
  vocabulary: VocabItem[];    // 전체 단어 목록
  grammar: GrammarItem[];     // 문법 포인트 목록
  key_sentences: KeySentence[]; // 마스터 문장 (4~5개)
  texts: TextSection[];       // 본문 섹션 배열
  translations: TranslationPack; // 다국어 번역 (KO, JA, EN)
}
```

---

## 2. 타입 정의

### 2.1 VocabItem (단어)

```typescript
interface VocabItem {
  word: string;    // 한자 (e.g., "法律")
  pinyin: string;  // 성조 병음 (e.g., "fǎlǜ")
  meaning: string; // 영어 의미 + 품사 접두어 (e.g., "n. law")
}
```

**규칙:**
- 품사 접두어: `n.`, `v.`, `adj.`, `adv.`, `conj.`, `prep.`, `num.` 중 하나
- 병음 성조: `ā, á, ǎ, à, ē, é, ě, è` 등 정확히 사용
- `ü`는 `ü`로 표기 (v로 대체하지 않음)
- 단어별 띄어쓰기: `nǐ hǎo` (O) / `nǐhǎo` (X)

---

### 2.2 GrammarItem (문법)

```typescript
interface GrammarItem {
  point: string;                // 문법 포인트명 (e.g., "不仅……也/还/而且……")
  explanation: string;          // 용법 설명
  formal_examples: Example[];   // 교재 예문 배열
  colloquial_pattern: string;   // 구어체 대체 패턴 (e.g., "不光……还……")
  colloquial_examples: Example[]; // 구어체 예문 배열
  nuance: string;               // 표준 vs 구어체 뉘앙스 차이 설명
}

interface Example {
  chinese: string;   // 중국어 문장 (<b> 태그로 핵심 패턴 강조)
  pinyin: string;    // 병음
  translation: string; // 영어 번역
}
```

**규칙:**
- `formal_examples`: 교재에 있는 **모든 예문**을 배열로 포함 (단일값이 아님)
- `colloquial_examples`: AI가 독자적으로 생성한 구어체 예문 배열
- 대화 패턴(A: ..., B: ...)은 `<br/>` 태그로 줄바꿈
- `<b>` 태그: Formal은 Imperial Red (#8B0000), Colloquial은 Gold (#DAA520)

> **⚠️ 주의:** `lesson2.json`의 구버전 스키마(`formal_example` 단일 문자열)와는 다름

---

### 2.3 KeySentence (마스터 문장)

```typescript
interface KeySentence {
  sentence: string;                // 표준 문장 (원문)
  pinyin: string;                  // 병음
  translation: string;             // 영어 번역
  colloquial_equivalent: string;   // 구어체 버전
  colloquial_pinyin: string;       // 구어체 병음
  context: string;                 // 사용 상황 태그 (e.g., "Expressing intense happiness")
}
```

**규칙:**
- 4~5개 문장 선정
- 해당 과의 핵심 문법/빈출 표현 포함된 문장 우선
- `<b>` 태그로 핵심 패턴 강조

---

### 2.4 TextSection (본문)

```typescript
interface TextSection {
  id: number;                    // 텍스트 순서 (1부터 시작)
  title: string;                 // 중문 제목 + (영문 번역)
  content: DialogueLine[];       // 대화/독백 내용
  audio: string;                 // 오디오 경로 (e.g., "audio/01-1.mp3")
  proper_nouns?: ProperNoun[];   // 고유명사 (교재에 있을 때만)
  vocabulary?: VocabItem[];      // 해당 텍스트 하단 단어장
}

interface DialogueLine {
  speaker: string;   // 화자 이름 (독백: "独白")
  text: string;      // 본문 한자 (<b> 태그로 문법 패턴 강조)
  pinyin: string;    // 성조 병음
  translation: string; // 영어 번역
}

interface ProperNoun {
  word: string;    // 고유명사 한자
  pinyin: string;  // 병음
  meaning: string; // 의미 (e.g., "name of a person")
}
```

**규칙:**
- 텍스트 수: 교재에 있는 그대로
- `audio` 필드: `audio/{lessonId}-{textId}.mp3` 형식
- 모든 `content[]`에 `pinyin`, `translation` 필수

---

### 2.5 TranslationPack (다국어 번역)

```typescript
interface TranslationPack {
  vocabulary: Record<string, { ko: string; ja: string; en: string }>;
  properNouns: Record<string, { ko: string; ja: string; en: string }>;
  grammar: Record<string, {
    formal_translation: { ko: string; ja: string; en: string };
    colloquial_translation: { ko: string; ja: string; en: string };
  }>;
  keySentences: Record<string, {
    translation: { ko: string; ja: string; en: string };
    colloquial_translation: { ko: string; ja: string; en: string };
    context: { ko: string; ja: string; en: string };
  }>;
  texts: Record<number, {
    lines: Record<number, {
      translation: { ko: string; ja: string; en: string };
    }>;
  }>;
  lessonTitle: { ko: string; ja: string; en: string };
  textTitles: Record<number, { ko: string; ja: string; en: string }>;
}
```

**규칙:**
- translations의 키는 JSON 데이터 필드와 100% 일치
- `lessonTitle`, `textTitles` 필드 포함
- `key_sentences` 최상위에는 `colloquial_translation` 없음 (translations 내부에만 존재)

---

## 3. 하이라이팅 (`<b>` 태그)

| 컨텍스트 | 태그 대상 | UI 색상 |
|:---|:---|:---|
| Formal | 핵심 문법 패턴 | Imperial Red (#8B0000) |
| Colloquial | 구어체 대체 패턴 | Gold (#DAA520) |

**적용 대상:**
- `grammar[].formal_examples[].chinese`
- `grammar[].colloquial_examples[].chinese`
- `key_sentences[].sentence`
- `key_sentences[].colloquial_equivalent`
- `texts[].content[].text`

---

## 4. 검증 항목

| 검증 항목 | 상세 |
|:---|:---|
| 필수 필드 존재 | lessonId, title, vocabulary, grammar, texts 확인 |
| 병음 누락 검사 | 모든 texts[].content[].pinyin, grammar[].formal_examples[].pinyin 등 |
| 스키마 타입 일치 | 필드명/타입이 이 문서와 일치하는지 확인 |
| `<b>` 태그 균형 | 모든 `<b>`가 `</b>`로 닫혀 있는지 확인 |
| 번역 키 일치 | translations의 키가 실제 데이터 필드와 100% 일치 |

---

*기준: data/lesson1.json (2026-06-01 기준)*
