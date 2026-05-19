# 📸 교재 이미지 → JSON 변환 파이프라인 설계 명세서 (v1.0)

> **목적:** HSK Standard Course 4A 교재 이미지를 캡처/분석하여 `data/lesson{N}.json` 형식의 학습 데이터로 자동 변환하는 파이프라인 설계

---

## 1. 개요 (Overview)

### 1.1 비전
사용자가 HSK 4 교재의 이미지를 제공하면, AI가 해당 이미지를 분석하여 교재의 **문어체(formal)** 내용과 **구어체(colloquial)** 확장이 포함된 정형화된 JSON 데이터를 생성한다. 생성된 데이터는 RedGold 앱에서 바로 렌더링되어 학습에 활용된다.

### 1.2 핵심 워크플로우
```
사용자 이미지 캡처/제공
       ↓
  AI 이미지 분석 (OCR + 문맥 이해)
       ↓
  구조화된 JSON 생성
   ├── 본문(texts) + 병음 + 번역
   ├── 문법(grammar) + formal/colloquial 예문
   ├── 단어(vocabulary) + 품사
   ├── 마스터 문장(key_sentences) + 구어체 변환
   └── 다국어 번역(translations: KO, JA)
       ↓
  JSON 유효성 자동 검증
       ↓
  기존 lesson{N}.json 덮어쓰기
       ↓
  앱에서 즉시 렌더링
```

### 1.3 대상 데이터
| 항목 | 내용 |
|:---|:---|
| **교재** | HSK Standard Course 4A (4B는 추후) |
| **대상 레슨** | Lesson 3부터 Lesson 10까지 (Lesson 1, 2는 이미 완료) |
| **출력 파일** | `data/lesson{N}.json` (기존 파일 덮어쓰기) |
| **AI 모델** | DeepSeek v4 Flash (현재 Codebuff 모델) |

---

## 2. 이미지 전달 방식 (Image Delivery)

### 2.1 지원 방식

#### 방식 A: 로컬 파일 경로 + 텍스트 설명 (현재 활성 워크플로우)
- 사용자가 로컬에 저장된 교재 이미지 파일 경로를 Codebuff에 전달
- 이미지를 직접 읽을 수 없는 경우, 사용자가 이미지 내용을 텍스트로 설명하여 제공
- 설명 기반으로 AI가 구조화된 JSON 생성
- **장점:** 별도 인프라 없이 즉시 시작 가능

#### 방식 B: MCP 클립보드 서버 (향후 — TBD)
> ⚠️ **TODO:** 사용자가 MCP 클립보드 서버 패키지를 확인 중입니다. 설치 완료 시 이 방식이 1순위로 승격됩니다.
- 사용자가 교재 이미지를 캡처/복사하여 Codebuff CLI에 직접 붙여넣기 (드래그 & 드롭)
- 이미지 데이터가 AI 분석 파이프라인으로 직접 전달됨

#### 방식 C: 웹 업로드 UI (향후 — 확장 계획)
- RedGold 앱 내에 관리자용 이미지 업로드 인터페이스 추가 (추후 개발)
- 브라우저에서 이미지를 드래그 앤 드롭 또는 파일 선택으로 업로드

### 2.2 이미지 유형별 분리 처리
각 레슨의 이미지를 **유형별로 따로** 전달하여 처리한다:

| 유형 | 설명 | 생성되는 JSON 섹션 | 참고 규칙 파일 |
|:---|:---|:---|:---|
| **본문/대화 (课文)** | 교재의 대화문/독백 페이지 | `texts[]` | `plan/image_recognition/1.rules_kewen.md` |
| **문법/노트 (注释)** | 문법 설명 및 예문 페이지 | `grammar[]` | `plan/image_recognition/2.rules_notes.md` |
| **단어장 (生词)** | 신규 단어 목록 페이지 | `vocabulary[]` | `plan/image_recognition/2.rules_notes.md` |
| **(통합)** | 위의 모든 유형 | `key_sentences[]` + `translations` | `plan/image_recognition/3.rules_mastery.md` |

> **Note:** 한 번의 세션에서 모든 유형을 순서대로 처리하여 하나의 완전한 `lesson{N}.json`을 생성한다.

---

## 3. 출력 JSON 스키마 (Output Schema)

### 3.1 최상위 구조
`data/lesson{N}.json` 파일의 전체 구조:

```typescript
{
  lessonId: number;          // 레슨 번호 (e.g., 3)
  title: string;             // "Lesson 3: 经理对我印象不错 (Good Impression on the Manager)"
  vocabulary: VocabItem[];   // 전체 단어 목록
  grammar: GrammarItem[];    // 문법 포인트 목록
  key_sentences: KeySentence[]; // 골든 센텐스 (4~5개)
  texts: TextSection[];      // 본문 섹션 배열
  translations: TranslationPack; // KO/JA 번역 (선택: 'en' 모드면 생략 가능)
}
```

### 3.2 스키마 일관성 주의사항

> ⚠️ **중요:** `lesson1.json`과 `lesson2.json` 사이에 스키마 불일치가 존재합니다.
> - `lesson1.json` (최신 리팩토링 완료): `grammar[].formal_examples[]` (배열, 다중 예문 지원)
> - `lesson2.json` (구버전): `grammar[].formal_example` (단일 문자열), `formal_pinyin`, `formal_translation`
>
> **본 파이프라인은 `lesson1.json`의 최신 스키마를 기준으로 합니다.**
> - `formal_examples: Example[]` — 교재의 **모든 예문**을 배열로 포함
> - `colloquial_examples: Example[]` — 구어체 예문도 배열로 포함
> - `key_sentences`의 `colloquial_translation` 필드는 lesson2.json에만 존재하므로 본 파이프라인에서는 제외

## 3.3 상세 타입 정의

#### VocabItem (단어)
```typescript
{
  word: string;         // 한자
  pinyin: string;       // 성조 병음 (e.g., "shìyìng")
  meaning: string;      // 영어 의미 + 품사 접두어 (e.g., "v. to get used to")
}
```

**규칙:**
- 품사 정보(n., v., adj., adv., conj., prep., num.)는 `meaning` 필드 앞에 접두어로 포함
- 병음 성조 기호(ā, á, ǎ, à, ē, é, ě, è, etc.) 정확히 사용
- `ü`는 `ü`로 표기 (v로 대체하지 않음)

#### GrammarItem (문법)
```typescript
{
  point: string;                // 문법 포인트명 (e.g., "挺")
  explanation: string;          // 설명
  formal_examples: Example[];   // 교재 예문 배열 (ALL examples from textbook)
  colloquial_pattern: string;   // 구어체 대체 패턴
  colloquial_examples: Example[]; // 구어체 예문 배열
  nuance: string;               // 표준 vs 구어체 뉘앙스 차이 설명
}

// Example 타입 (formal_examples / colloquial_examples 내부)
{
  chinese: string;        // 중국어 문장 (<b> 태그로 핵심 패턴 강조)
  pinyin: string;         // 병음
  translation: string;    // 영어 번역
}
```

**규칙:**
- `formal_examples`는 **교재에 있는 모든 예문**을 빠짐없이 포함 (배열)
- 대화 패턴(A: ..., B: ...)은 `<br/>` 태그로 줄바꿈 처리
- 핵심 문법 패턴은 `<b>` 태그로 강조 (UI에서 Imperial Red #8B0000로 렌더링됨)
- 구어체 콜로키얼 예문은 `<b>` 태그로 강조 (UI에서 Gold #DAA520로 렌더링됨)

#### KeySentence (마스터 문장)
```typescript
{
  sentence: string;                   // 표준 문장 (원문, <b> 태그로 패턴 강조)
  pinyin: string;                     // 병음
  translation: string;                // 영어 번역
  colloquial_equivalent: string;      // 구어체 버전 (<b> 태그로 패턴 강조)
  colloquial_pinyin: string;          // 구어체 병음
  context: string;                    // 사용 상황 태그 (e.g., "Asking about adaptation")
}
```

**규칙:**
- 4~5개 문장 선정
- 해당 과의 핵심 문법/빈출 표현 포함된 문장 우선

#### TextSection (본문)
```typescript
{
  id: number;                    // 텍스트 순서 (1부터 시작)
  title: string;                 // 중문 제목 + (영문 번역)
  content: DialogueLine[];       // 대화/독백 내용
  audio: string;                 // 오디오 파일 경로 (e.g., "audio/03-1.mp3")
  proper_nouns?: ProperNoun[];   // 고유명사 (교재에 있을 때만)
  vocabulary?: VocabItem[];      // 해당 텍스트 하단 단어장
}

// DialogueLine
{
  speaker: string;          // 화자 이름 (독백: "独白")
  text: string;             // 본문 한자 (<b> 태그로 문법 패턴 강조)
  pinyin: string;           // 성조 병음
  translation: string;      // 영어 번역
}

// ProperNoun
{
  word: string;       // 고유명사 한자
  pinyin: string;     // 병음
  meaning: string;    // 의미 (e.g., "name of a person")
}
```

**규칙:**
- `audio` 필드: 사용자가 직접 MP3 파일 제공 예정이므로, 정확한 경로(`audio/03-1.mp3`)를 JSON에 기록
- 모든 `content[]`의 각 라인에 `pinyin`과 `translation` 필수 포함
- 본문 텍스트에서 해당 과의 문법 패턴은 `<b>` 태그로 강조

#### TranslationPack (다국어 번역)
`src/utils/lessonTranslations.ts`의 `translateLessonData` 함수와 호환되는 구조:

```typescript
{
  vocabulary: Record<string, { ko: string; ja: string }>;
  properNouns: Record<string, { ko: string; ja: string }>;
  grammar: Record<string, {
    formal_translation: { ko: string; ja: string };
    colloquial_translation: { ko: string; ja: string };
  }>;
  keySentences: Record<string, {
    translation: { ko: string; ja: string };
    colloquial_translation: { ko: string; ja: string };
    context: { ko: string; ja: string };
  }>;
  texts: Record<number, {
    lines: Record<number, {
      translation: { ko: string; ja: string }
    }>
  }>;
}
```

---

## 4. 이미지 분석 규칙 (Processing Rules)

### 4.1 본문 분석 (Texts)
- 참고: `plan/image_recognition/1.rules_kewen.md`
- 화자별 대화를 정확히 분리
- 각 라인의 병음 생성 (단어별 띄어쓰기 준수)
- 번역은 교과서적 직역보다 자연스러운 문체 우선

### 4.2 문법 분석 (Grammar)
- 참고: `plan/image_recognition/2.rules_notes.md`
- **모든 교재 예문**을 `formal_examples` 배열에 포함
- 구어체는 AI가 독자적으로 창의적 생성
  - 트렌디한 어휘 사용 (贼, 给力, 领证, 杠杠的 등)
  - 단순한 문장 변환이 아닌, 원어민 실감 표현

### 4.3 마스터 문장 (Key Sentences)
- 참고: `plan/image_recognition/3.rules_mastery.md`
- 본문에서 학습 가치 높은 4~5개 문장 선정
- 표준 문장 + 구어체 변환 + 맥락 태그 조합

### 4.4 다국어 번역 (Localization)
- 참고: `plan/image_recognition/4.rules_locale.md`
- 한국어(KO): 해요체 기본, 자연스러운 의역
- 일본어(JA): 적절한 한자/가나 혼용, です/ます体 기본

### 4.5 하이라이팅 규칙 (`<b>` 태그)
| 컨텍스트 | 태그 대상 | UI 색상 |
|:---|:---|:---|
| Formal (texts, grammar, key_sentences) | 핵심 문법 패턴 | Imperial Red (#8B0000) |
| Colloquial (grammar, key_sentences) | 구어체 대체 패턴 | Gold (#DAA520) |

---

## 5. JSON 유효성 검증 (Validation)

### 5.1 자동 검증 항목
생성된 `lesson{N}.json`은 다음 항목을 자동 검증한다:

| 검증 항목 | 상세 |
|:---|:---|
| **필수 필드 존재** | lessonId, title, vocabulary, grammar, texts 존재 확인 |
| **병음 누락 검사** | 모든 texts[].content[].pinyin, grammar[].formal_examples[].pinyin 등 확인 |
| **스키마 타입 일치** | lesson1.json의 스키마와 필드명/타입 일치 여부 (배열 vs 단일값 주의) |
| **`<b>` 태그 균형** | 모든 `<b>` 태그가 `</b>`로 닫혀 있는지 확인 |
| **번역 키 일치** | translations의 키가 실제 데이터 필드와 100% 일치하는지 확인 |

### 5.2 검증 실패 시 처리
| 실패 유형 | 처리 |
|:---|:---|
| 경미한 오류 (병음 누락, 태그 불균형) | 자동 수정 후 재검증 (최대 3회) |
| 심각한 오류 (필수 필드 누락, 스키마 불일치) | 사용자에게 알리고 해당 섹션 재처리 요청 |
| 3회 이상 재검증 실패 | 사용자에게 오류 로그와 함께 수동 개입 요청 |

### 5.3 이미지 분석 실패 처리 (Error Handling)
| 상황 | 처리 |
|:---|:---|
| 이미지 품질 불량 (흐림, 저조도) | 가능한 정보만 추출, 누락된 섹션을 사용자에게 표시하여 보충 설명 요청 |
| 텍스트 모호 (OCR 모호) | AI가 최선의 추측으로 생성, 모호한 부분을 플래그하여 사용자 확인 요청 |
| 부분 데이터만 제공 | 해당 유형의 데이터만 JSON에 포함, 나머지 필드는 빈 배열로 초기화 |
| 유형 미지정 이미지 | 사용자에게 이미지 유형(본문/문법/단어) 확인 요청

---

## 6. 실행 워크플로우 (Execution Flow)

### 6.1 단계별 프로세스 (현재 활성 워크플로우)

```
Step 1: 사용자가 교재 이미지 내용을 자연어로 설명 (또는 로컬 파일 경로 전달)
        예: "레슨 3 첫 번째 본문 페이지야. 화자는 리진(李进)과 샤오위(小雨)이고..."

Step 2: AI가 설명 기반으로 데이터 구조화 (유형별 순차 처리)
        2a. 본문 이미지 설명 → texts[] 생성 (pinyin, translation 포함)
        2b. 문법 이미지 설명 → grammar[] 생성 (formal + colloquial)
        2c. 단어장 이미지 설명 → vocabulary[] 추가 (품사 포함)
        2d. 모든 데이터 기반 → key_sentences[] 생성 (4~5개)
        2e. 모든 데이터 기반 → translations 생성 (KO + JA)

Step 3: JSON 생성 및 data/lesson{N}.json 저장 (기존 파일 덮어쓰기)

Step 4: 자동 유효성 검증 실행 (lesson1.json 스키마 기준)
        - 성공: 계속 진행
        - 실패 (경미): 자동 수정 → 재검증 (최대 3회)
        - 실패 (심각): 사용자에게 알리고 재처리 요청

Step 5: 결과 확인 및 앱에서 렌더링 확인
```

> **Note:** MCP 클립보드 서버 설치 완료 시, Step 1이 "이미지를 Codebuff에 직접 붙여넣기"로 대체됩니다.

### 6.2 사용자 입력 형식
자연어 자유 형식으로 이미지 내용을 설명하거나, 이미지를 직접 전달한다.
예시:
```
이거는 레슨 3의 본문 페이지야. 
화자는 리진(李进)과 샤오위(小雨)이고...
[이미지 내용 설명]
```

---

## 7. 기존 시스템과의 관계

### 7.1 호환성
- 생성된 JSON은 현재 `App.ts`의 `normalizeLessonData()` 함수로 정규화 가능
- `translateLessonData()` 함수로 KO/JA 번역 자동 적용 가능
- 기존 Web Components (VocabCard, GrammarCard, TextSection, KeySentences)와 100% 호환

### 7.2 기존 규칙 파일
| 파일 | 역할 | 적용 대상 |
|:---|:---|:---|
| `plan/json_cookbook.md` | JSON 구조 및 인리치먼트 표준 | 모든 섹션 |
| `plan/mapping_rules.md` | 이미지→JSON 매핑 규칙 (Lesson 1 기준) | Texts, Grammar |
| `plan/image_recognition/1.rules_kewen.md` | 본문/대화 분석 규칙 | texts[] |
| `plan/image_recognition/2.rules_notes.md` | 문법/단어 분석 규칙 | grammar[], vocabulary[] |
| `plan/image_recognition/3.rules_mastery.md` | 마스터 문장 규칙 | key_sentences[] |
| `plan/image_recognition/4.rules_locale.md` | 다국어 번역 규칙 | translations |

---

## 8. 추후 확장 고려사항

### 8.1 HSK 4B 지원
- Lesson 11~20까지 동일한 파이프라인으로 확장
- textbook_inventory.md에 정의된 챕터 리스트 참조

### 8.2 배치 처리
- 여러 레슨의 이미지를 한 번에 처리하는 모드
- 연속 레슨 자동 생성 파이프라인

### 8.3 웹 기반 관리자 UI
- 이미지 업로드 / 분석 결과 미리보기 / 수동 편집 인터페이스
- 드래그 앤 드롭 이미지 업로드
- 생성된 JSON 실시간 프리뷰

### 8.4 오디오 파일 연동
- 사용자가 MP3 파일을 제공하면 `audio` 경로 자동 매핑
- 추후 오디오 하이라이트 싱크 데이터 자동 생성

---

## 9. 부록: Lesson 3 사전 정보

`plan/textbook_inventory.md`에 따른 Lesson 3 사전 정보:

| 항목 | 내용 |
|:---|:---|
| **Lesson ID** | 3 |
| **제목** | 经理对我印象不错 (Good Impression on the Manager) |
| **문법 포인트** | 挺, 本来, 另外, 首先...其次, 不管 |
| **비교 문법** | 另外 vs 另 |
| **문화** | Chinese Tunic Suit and Cheongsam |
| **예상 텍스트 수** | 4~5개 (대화 + 독백) |

---

*最后更新: 2026-04-18*
*버전: v1.0*
