# lesson JSON 제작 규칙

이 문서는 앞으로 내가 lesson 번호, 본문 이미지 5개, 문법 표현 설명 몇 개를 순서대로 줄 때, 이 앱에서 바로 사용할 `data/lesson*.json` 파일을 안정적으로 만들기 위한 작업 규칙이다.

목표:
- 매 lesson마다 앱 호환 형식의 `lesson{번호}.json` 생성
- 오프라인 환경에서도 `ollama + gemma4:e4b`로 반복 작업 가능
- 추측보다 이미지 원문을 우선

## 1. 저장 위치와 파일명

- 저장 위치: `data/`
- 파일명: `lesson{번호}.json`
- 예시:
  - `data/lesson1.json`
  - `data/lesson2.json`

## 2. 최상위 JSON 구조

모든 lesson JSON은 아래 구조를 기본으로 한다.

```json
{
  "lessonId": 3,
  "title": "Lesson 3: 中文标题 (English Title)",
  "vocabulary": [],
  "grammar": [],
  "texts": []
}
```

## 3. 필수 필드 규칙

### 3.1 `lessonId`

- 숫자형
- lesson 번호와 반드시 일치

### 3.2 `title`

- 문자열
- 권장 형식:
  - `Lesson {번호}: {중문 제목} ({영문 제목})`
- 만약 교재 표제 제목이 분명하지 않으면:
  - 임시로 `Lesson {번호}` 사용 가능
  - 단, 가능하면 본문/주제에 맞는 중문 제목과 영문 제목을 함께 작성

### 3.3 `vocabulary`

- lesson 전체 단어장
- 배열
- 각 항목 형식:

```json
{
  "word": "词语",
  "pinyin": "cíyǔ",
  "meaning": "n. meaning"
}
```

규칙:
- 가능한 한 교재의 새 단어를 기준으로 정리
- `meaning`은 짧고 앱 카드에 잘 들어가게 작성
- 품사가 분명하면 `n.`, `v.`, `adj.`, `adv.`, `conj.` 등을 붙임
- 병음은 성조 포함
- lesson 전체 `vocabulary`에는 중복 단어를 넣지 않음

### 3.4 `grammar`

- 문법 설명 배열
- 각 항목 형식:

```json
{
  "point": "不仅……也/还/而且……",
  "explanation": "Not only... but also...",
  "formal_example": "他<b>不仅</b>足球踢得好，性格<b>也</b>不错。",
  "formal_pinyin": "Tā bùjǐn zúqiú tī dé hǎo, xìnggé yě bùcuò.",
  "formal_translation": "He not only plays football well, but also has a good personality.",
  "colloquial_pattern": "不光……还……",
  "colloquial_version": "他<b>不光</b>球踢得贼溜，人<b>还</b>挺给力的。",
  "colloquial_pinyin": "Tā bùguāng qiú tī dé zéi liū, rén hái tǐng gěilì de.",
  "colloquial_translation": "He's not just great at football, he's also a really stand-up guy.",
  "nuance": "Short note on register, tone, or native usage."
}
```

규칙:
- 사용자가 주는 문법 표현 설명을 바탕으로 작성
- `formal_example`와 `colloquial_version`에는 핵심 표현을 `<b>...</b>`로 감싸 강조 가능
- 예문은 lesson 본문 맥락과 최대한 연결
- `colloquial_pattern`은 없으면 빈 문자열 대신 자연스럽게 하나 제안
- `nuance`는 너무 길지 않게 1문장 정도

### 3.5 `texts`

- 본문 5개를 기준으로 배열 작성
- 보통 이미지 5개를 주신다고 했으므로 `texts`도 기본적으로 5개
- 각 항목 형식:

```json
{
  "id": 1,
  "title": "中文标题 (English Title)",
  "content": [],
  "audio": "audio/03-1.mp3",
  "proper_nouns": [],
  "vocabulary": []
}
```

규칙:
- `id`는 1부터 시작
- `audio`는 반드시 `audio/{lessonId 2자리}-{text id}.mp3`
- 예:
  - lesson 3, text 1 -> `audio/03-1.mp3`
  - lesson 12, text 5 -> `audio/12-5.mp3`
- `proper_nouns`는 있으면 넣고, 없으면 생략 가능
- `vocabulary`는 해당 본문에 실제 등장하는 단어만 추려서 넣음

## 4. `texts[].content` 작성 규칙

대화문이면 여러 줄, 독백이면 보통 1줄 또는 의미 단위 분할 가능.

각 줄 형식:

```json
{
  "speaker": "王静",
  "text": "你为什么喜欢他？",
  "pinyin": "Nǐ wèishéme xǐhuān tā?",
  "translation": "Why do you like him?"
}
```

규칙:
- `speaker`는 화자 이름 또는 `独白`, `旁白`, `System` 등
- `text`는 이미지 원문 기준
- `pinyin`는 전체 문장 병음
- `translation`은 자연스러운 영어
- 본문 강조가 필요한 부분은 `text` 안에서만 `<b>...</b>` 사용 가능

## 5. `proper_nouns` 규칙

본문별 고유명사는 아래 형식 사용:

```json
[
  {
    "word": "王静",
    "pinyin": "Wáng Jìng",
    "meaning": "Wang Jing, name of a person"
  }
]
```

규칙:
- 사람 이름, 지명, 학교명, 브랜드명 등만 넣기
- 추측으로 넣지 말고 이미지에 실제 등장한 것만 넣기
- 호칭 전체를 넣기보다 성씨만 맞는 경우가 있으면 교재 표기 그대로 유지
- `proper_nouns`가 없으면 필드 생략 가능

## 6. `texts[].vocabulary` 규칙

각 본문 아래의 `vocabulary`는 lesson 전체 단어장 중에서 그 본문에 실제 나오는 단어만 추린 부분집합이다.

예:

```json
[
  {
    "word": "法律",
    "pinyin": "fǎlǜ",
    "meaning": "n. law"
  }
]
```

규칙:
- lesson 전체 `vocabulary`와 표기 일치
- 순서는 본문 등장 순서를 우선
- 해당 본문에 없는 단어는 넣지 않음

## 7. 이미지 기반 작업 원칙

- 가장 중요한 원칙: 이미지 원문이 최우선
- 내가 기억으로 보정하지 말고, 이미지에 보이는 한자를 기준으로 작성
- 잘 안 보이는 글자는 추측하지 말고 표시 후 보류
- 문법 예문도 가능하면 본문 문장을 활용
- 교재식 표현과 구어체 표현은 분리해서 작성

## 8. 오프라인 LLM 작업 원칙

비행기 안에서 `ollama + gemma4:e4b`로 계속 작업하므로 프롬프트와 산출 형식을 단순하게 유지한다.

권장 작업 순서:
1. lesson 번호 확인
2. 이미지 5개에서 본문 원문 추출
3. 각 본문별 화자, 병음, 영어 번역 작성
4. lesson 전체 단어장 정리
5. 본문별 단어장 부분집합 정리
6. proper noun 추출
7. 문법 설명 항목 작성
8. 최종 `lesson{번호}.json` 저장

## 9. 생성 시 지켜야 할 품질 기준

- JSON 문법 100% 유효
- 쉼표, 따옴표, 배열 닫힘 정확히 확인
- UTF-8 한자 그대로 사용
- 병음 성조 누락 최소화
- 영어 번역은 짧고 자연스럽게
- 구어체 설명은 너무 과장하지 말고 실제 중국어 회화 느낌 유지
- 앱에서 읽는 필드명은 절대 바꾸지 않음

## 10. 권장 최종 템플릿

```json
{
  "lessonId": 0,
  "title": "Lesson 0: 中文标题 (English Title)",
  "vocabulary": [
    {
      "word": "",
      "pinyin": "",
      "meaning": ""
    }
  ],
  "grammar": [
    {
      "point": "",
      "explanation": "",
      "formal_example": "",
      "formal_pinyin": "",
      "formal_translation": "",
      "colloquial_pattern": "",
      "colloquial_version": "",
      "colloquial_pinyin": "",
      "colloquial_translation": "",
      "nuance": ""
    }
  ],
  "texts": [
    {
      "id": 1,
      "title": "中文标题 (English Title)",
      "content": [
        {
          "speaker": "",
          "text": "",
          "pinyin": "",
          "translation": ""
        }
      ],
      "audio": "audio/00-1.mp3",
      "proper_nouns": [
        {
          "word": "",
          "pinyin": "",
          "meaning": ""
        }
      ],
      "vocabulary": [
        {
          "word": "",
          "pinyin": "",
          "meaning": ""
        }
      ]
    }
  ]
}
```

## 11. 앞으로의 작업 방식

앞으로 사용자가 아래처럼 주면 된다.

- lesson 번호
- 본문 이미지 5개
- 문법 표현 설명 몇 개

그러면 나는:
- 이 규칙에 맞춰
- 기존 앱 스키마를 유지하면서
- `data/lesson{번호}.json` 파일을 계속 만들어간다

## 12. 추가 메모

- 앱은 `texts[].audio`, `texts[].vocabulary`, `texts[].proper_nouns`를 실제로 사용한다
- `grammar`의 예문 안 HTML `<b>` 태그는 허용된다
- `text` 본문 안의 `<b>`도 허용된다
- 고유명사는 lesson 전체 최상위가 아니라 각 `text` 내부에 넣는다
- 이미지가 5개라도 실제 본문 수가 다르면, 이미지 기준으로 유연하게 `texts` 개수를 조정할 수 있다
