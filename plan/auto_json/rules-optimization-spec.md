# 규칙 파일 최적화 스펙 (rules-optimization-spec)

> **작업 입력용 아님:** 이 문서는 규칙 최적화 설계/기록용이다. Lesson JSON 생성 또는 수정 작업 시 로드하지 않는다.
> **실행용 규칙:** 실제 작업 프롬프트에는 `0.rules_common.md`, `1.rules_kewen.md`, `2.rules_notes.md`, `3.rules_mastery.md`만 포함한다.

> **대상:** 현재 폴더의 4개 md 규칙 파일 (`1.rules_kewen.md`, `2.rules_notes.md`, `3.rules_mastery.md`, `4.rules_locale.md`)
> **목적:** 중복 규칙 제거, 토큰 소모 최적화, 유지보수 용이성 향상
> **작성일:** 2026-06-03

---

## 1. 현재 상태 분석

### 1.1 파일 구성

| 파일 | 목적 | 주요 섹션 |
|------|------|-----------|
| `1.rules_kewen.md` | 课文(Texts) JSON 생성 | 데이터 구조, 오디오 동기화, 하이라이트 `<b>`, 이미지 OCR, 번역 품질 |
| `2.rules_notes.md` | Notes(注释) & 生词 JSON 생성 | Grammar 데이터 구조, Vocabulary 구조, 비교/설명형/확장 이미지 처리, 구어체 생성 |
| `3.rules_mastery.md` | Mastery(Golden Sentences) JSON 생성 | 선정 기준, 데이터 구성, `<b>` 태그 |
| `4.rules_locale.md` | 다국어 로케일(KO/JA/EN) | JSON 구조(translations), 동적 로직, 번역 품질 가이드, 마이그레이션 |

### 1.2 발견된 중복 영역

| 중복 영역 | 해당 파일 | 중복 내용 |
|-----------|-----------|-----------|
| `<b>` 태그 & 색상 규칙 | kewen, notes, mastery | Imperial Red/Gold 색상 지정, CSS 자동 렌더링 설명 반복 |
| 병음 정규화 기준 | kewen, notes | 성조 기호(ā,á,ǎ,à), `ü` 표기, 단어별 띄어쓰기, 문장 부호 뒤 공백 |
| JSON 업데이트/병합 정책 | kewen, notes, mastery | 기존 데이터 교체/추가 로직, 중복 체크 기준 |
| 번역 품질 가이드 | kewen, locale | 한국어 번역 기준(자연스러움, 의역), 영어 번역 기준 |
| 기준 스키마 참조 | 전 파일 (4개) | `plan/lesson-schema-canonical.md` 참조 반복 |
| `lesson1.json` 기준 참조 | 전 파일 (4개) | "기준 데이터: data/lesson1.json" 반복 |
| `<br/>` 태그 대화 줄바꿈 | notes 파일 내부 | 대화 패턴(A/B) 처리 시 `<br/>` 삽입 규칙 |
| 구어체 생성 톤 가이드 | notes, mastery | 트렌디 어휘(賊,给力,领证 등) 사용 권장 설명 반복 |

---

## 2. 최적화 방향

### 2.1 목표 파일 구조 (4 → 5개)

```
0.rules_common.md    ← 새로 생성: 공통 규칙 + 로케일 + 코드 참조
1.rules_kewen.md     ← 최적화: 중복 제거, 공통 참조
2.rules_notes.md     ← 최적화: 중복 제거, 공통 참조
3.rules_mastery.md   ← 최적화: 중복 제거, 공통 참조
4.rules_locale.md    ← 삭제: 0.rules_common.md로 통합
```

### 2.2 공통 파일에 통합할 항목

| 항목 | 현재 위치 | 공통 파일 위치 |
|------|-----------|----------------|
| 기준 스키마 참조 (`lesson-schema-canonical.md`) | 전 파일 헤더 | `0.rules_common.md` 상단 1회 언급 |
| 기준 데이터 참조 (`lesson1.json`) | 전 파일 헤더 | `0.rules_common.md` 상단 1회 언급 |
| `<b>` 태그 & 색상 규칙 | kewen, notes, mastery | `## 하이라이트 규칙` 섹션 |
| 병음 정규화 기준 | kewen, notes | `## 병음 표기 규칙` 섹션 |
| JSON 업데이트/병합 정책 | kewen, notes, mastery | `## JSON 병합 로직` 섹션 |
| 번역 품질 가이드 | kewen, locale | `## 번역 품질 기준` 섹션 |
| 코드 참조 (TextSection.ts, GrammarCard.ts, lessonTranslations.ts) | kewen, notes, locale | `## 코드 참조` 섹션 |
| 구어체 생성 톤 가이드 | notes, mastery | `## 구어체 생성 원칙` 섹션 |
| 로케일 전체 (KO/JA/EN 번역 규칙) | locale 파일 | `## 다국어(로케일)` 섹션 |

### 2.3 각 도메인 파일에 유지할 항목

**`1.rules_kewen.md`** (최적화 후):
- 목적 (최소한)
- 텍스트 데이터 구조 (`id`, `title`, `audio`, `content`, `proper_nouns`, `vocabulary`)
- 오디오 동기화 로직 (TextSection.ts 연동)
- 이미지 OCR 및 분석 (텍스트 도메인-specific)

**`2.rules_notes.md`** (최적화 후):
- 목적 (최소한)
- Grammar 데이터 구조 (point, explanation, formal_examples, colloquial_examples, nuance)
- Vocabulary 데이터 구조
- 비교/설명형 이미지 처리 규칙
- 확장/동자어 이미지 처리 규칙
- `<br/>` 대화 줄바꿈 규칙

**`3.rules_mastery.md`** (최적화 후):
- 목적 (최소한)
- Mastery 데이터 구조 (key_sentences)
- 선정 기준 (4~5개 골든 센텐스)

---

## 3. 공통 파일(`0.rules_common.md`) 상세 설계

### 3.1 파일 구조

```markdown
# 🇨🇳 공통 규칙 (AI Sidekick)

> ⚠️ 기준 스키마: plan/lesson-schema-canonical.md
> 기준 데이터: data/lesson1.json

## 1. 하이라이트 규칙 (`<b>` 태그)
- 핵심 문법 패턴은 `<b>` 태그로 강조
- UI 렌더링:
  - 표준/Formal: Imperial Red (#8B0000) — TextSection.ts, GrammarCard.ts 앞면
  - 구어체/Colloquial: Gold (#DAA520) — GrammarCard.ts 뒷면, Mastery
- 모든 도메인(texts, grammar, key_sentences)에서 동일하게 적용

## 2. 병음 표기 규칙
- 성조 기호 정확히 사용 (ā, á, ǎ, à)
- `ü`는 `ü`로 표기 (v로 대체하지 않음)
- 단어별 띄어쓰기 (예: `nǐ hǎo` vs `nǐhǎo`)
- 문장 부호 뒤에는 공백

## 3. JSON 병합 로직
- 기존 파일 읽기 → 해당 ID/point 기준 교체(Replace) 또는 추가(Append)
- `lessonId`와 `title` 유효성 상단 확인
- `grammar`는 `point`를 기준으로 업데이트/생성
- `vocabulary`는 중복 체크 후 끝에 추가
- `translations` 키는 원본 데이터와 100% 일치 확인

## 4. 구어체 생성 원칙
- 원어민이 실제로 사용하는 생생한 표현 (賊, 给力, 领증 등 트렌디 어휘)
- 해당 상황에서 느낄 법한 감정/트렌드 반영
- 비교/확장/동자어 항목에서는 교재 원문 보존 우선
- 구어체는 보조 역할만, 원문 설명이나 교재 예문 대체 불가

## 5. 번역 품질 기준

### 한국어 (KO)
- 중국어 직역보다 일상적 자연스러운 문맥 우선
- 교과서 표현(Formal)은 해요체, 구어체는 친근한 말투
- 중국어 관용구는 한국어 대응 표현으로 의역

### 일본어 (JA)
- 적절한 한자/가나 비중 유지
- Formal: です/ます, Colloquial: だ/ReceiveProps 또는 회화체

### 영어 (EN)
- 자연스러운 영어 문체, 직역 지양

## 6. 코드 참조
- `TextSection.ts`: 한자 수/병음 길이 기반 오디오 하이라이트 타이밍 자동 계산
- `GrammarCard.ts`: 앞면(Formal) ↔ 뒷면(Colloquial) 뒤집기 구조
- `translateLessonData`: translations 필드 기반 동적 로케일 매핑
- `lessonTranslations.ts`: 코드 내 하드코딩 → JSON 동적 처리로 전환

## 7. 다국어(로케일) 규칙

### JSON 구조
- `translations` 객체: vocabulary, properNouns, grammar, keySentences, texts, lessonTitle, textTitles
- `lessonTitle`, `textTitles` 필수
- `translations.texts` line key는 반드시 **0-based index**
- 각 translation 객체는 `ko`, `ja`, `en` 모두 포함

### 동적 로케일 로직
1. `lesson{N}.json` 로드
2. `translateLessonData(data, language)` 호출
3. `translations` 필드에서 해당 언어 번역으로 원본 필드 덮어쓰기
4. 번역 없으면 원본(en) 유지

### 검증 체크리스트
- `translations.texts`는 모든 `texts[].id` 포함
- 각 `texts[].content[i]`마다 `lines[i].translation` 존재
- 독백(`speaker: "独白"`)도 `lines["0"]`에 번역 필수
- 1-based key 사용 금지 (0-based만 허용)
- `ko`, `ja`, `en` 3개 언어 모두 포함
```

---

## 4. 도메인 파일별 최적화 상세

### 4.1 `1.rules_kewen.md` 최적화 후

**제거 대상:**
- ~~`<b>` 태그 & Imperial Red 설명~~ → `0.rules_common.md`로 이동
- ~~병음 성조 기준, 띄어쓰기 규칙~~ → `0.rules_common.md`로 이동
- ~~기준 스키마/기준 데이터 헤더~~ → `0.rules_common.md`에서 1회 참조
- ~~번역 품질(한국어/영어)~~ → `0.rules_common.md`로 이동
- ~~JSON 업데이트 정책 중복~~ → `0.rules_common.md`로 이동

**유지 대상:**
- 텍스트 데이터 구조 (content: speaker, text, pinyin, translation)
- 오디오 동기화 로직 (TextSection.ts 연동, text/pinyin 정확성)
- 이미지 OCR 절차 (텍스트 도메인-specific)
- proper_nouns, vocabulary 필드 설명

**예상 토큰 절감:** ~40%

### 4.2 `2.rules_notes.md` 최적화 후

**제거 대상:**
- ~~`<b>` 태그 & Gold/Imperial Red 설명~~ → `0.rules_common.md`로 이동
- ~~병음 정규화 (성조, ü, 공백)~~ → `0.rules_common.md`로 이동
- ~~구어체 생성 톤 가이드 (賊,给力 등)~~ → `0.rules_common.md`로 이동
- ~~JSON 병합 로직 (point 기준 업데이트, vocabulary 중복 체크)~~ → `0.rules_common.md`로 이동
- ~~이전 구버전 스키마 주의사항 (colloquial_version 등)~~ → **제거** (레거시)
- ~~`<br/>` 대화 줄바꿈 규칙 중복~~ → 도메인 내 1회로 축소

**유지 대상:**
- Grammar 데이터 구조 (point, explanation, formal_examples, colloquial_examples, nuance)
- Vocabulary 데이터 구조 (word, pinyin, meaning)
- 비교/설명형 이미지 처리 규칙 (比一比, A vs B, 区别 등)
- 확장/동자어 이미지 처리 규칙 (扩展, 同字词)
- `formal_examples` vs `colloquial_examples` 배열 차이
- 대화 패턴(A/B) `<br/>` 처리 규칙
- translations同步 규칙 (formal_examples.length 일치)

**예상 토큰 절감:** ~45%

### 4.3 `3.rules_mastery.md` 최적화 후

**제거 대상:**
- ~~`<b>` 태그 & 색상 규칙~~ → `0.rules_common.md`로 이동
- ~~구어체 생성 설명 (트렌디 어휘 권장)~~ → `0.rules_common.md`로 이동
- ~~JSON 업데이트/병합 정책~~ → `0.rules_common.md`로 이동
- ~~기준 스키마/기준 데이터 헤더~~ → `0.rules_common.md`에서 1회 참조

**유지 대상:**
- Mastery 목적 (골든 센텐스, 마스터 탭 렌더링)
- 선정 기준 (4~5개, 핵심 문법/빈출 표현 우선)
- 데이터 구성 (Standard Han, Living Language, Context)
- JSON 저장 위치 (`key_sentences` 배열)

**예상 토큰 절감:** ~50%

### 4.4 `4.rules_locale.md` → `0.rules_common.md`로 통합 후

**통합 대상:**
- JSON 구조 표준 (`translations` 객체 전체)
- Text Line Index 규칙 (0-based)
- 동적 로케일 로직 (`translateLessonData`)
- 번역 품질 가이드 (KO/JA)
- 마이그레이션 절차
- 검증 체크리스트

**기존 파일:** 삭제

---

## 5. 토큰 절감 예상 효과

| 항목 | 현재 (추정 토큰) | 최적화 후 (추정 토큰) | 절감율 |
|------|-----------------|---------------------|--------|
| `1.rules_kewen.md` | ~800 | ~480 | ~40% |
| `2.rules_notes.md` | ~1,500 | ~825 | ~45% |
| `3.rules_mastery.md` | ~600 | ~300 | ~50% |
| `4.rules_locale.md` | ~1,200 | 0 (삭제) | 100% |
| `0.rules_common.md` (신규) | 0 | ~600 | - |
| **합계** | **~4,100** | **~2,205** | **~46%** |

---

## 6. 구현 절차

### Step 1: `0.rules_common.md` 생성
- 공통 규칙 7개 섹션(하이라이트, 병음, 병합, 구어체, 번역, 코드 참조, 로케일) 작성
- 각 섹션은 간결하고 명확하게, 불필요한 예시 최소화

### Step 2: `1.rules_kewen.md` 최적화
- 공통 규칙으로 이동된 항목 제거
- 해당 도메인 고유 규칙만 유지
- 공통 파일 참조 추가 (`⚠️ 공통 규칙: 0.rules_common.md 참조`)

### Step 3: `2.rules_notes.md` 최적화
- 공통 규칙으로 이동된 항목 제거
- 레거시 주의사항 제거
- 해당 도메인 고유 규칙만 유지

### Step 4: `3.rules_mastery.md` 최적화
- 공통 규칙으로 이동된 항목 제거
- 해당 도메인 고유 규칙만 유지

### Step 5: `4.rules_locale.md` 삭제
- 모든 내용이 `0.rules_common.md`에 통합되었으므로 삭제

### Step 6: 최종 검증
- 각 파일이 독립적으로 읽히는지 확인
- 공통 규칙 참조가 정확한지 확인
- 토큰 절감 효과 측정

---

## 7. 주의사항

- **도메인별 독립성:** 각 도메인 파일은 공통 규칙을 참조하지만, 해당 도메인 고유 규칙은 충분히 명시
- **일관성:** 코드 참조(TextSection.ts, GrammarCard.ts 등)는 공통 파일에集中, 각 파일은 "참조: 0.rules_common.md" 형태로 연결
- **확장성:** 향후 새 도메인 규칙 추가 시, 공통 규칙은 재사용 가능
- **검증:** 최적화 후 `lesson1.json`과의 스키마 일치 여부 재확인
