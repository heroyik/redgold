# 📱 중국어 단어장 앱 UI/UX 디자인 사양서 (Design Specification)

## 🌟 1. 디자인 목표 및 원칙 (Goals & Principles)
* **핵심 목표:** 학습에 몰입도를 높이고, 정보 과부하를 막는 미니멀리즘(Minimalism) 기반의 세련된 경험 제공.
* **디자인 원칙:**
    1. **모바일 우선(Mobile-First):** 모든 요소는 최신 스마트폰 비율(예: 19:9)을 기준으로 최적화한다.
    2. **직관성:** 사용자가 '학습할 내용'에만 집중할 수 있도록 복잡한 메뉴 구조를 배제한다.
    3. **가독성:** 한자, 병음, 한국어 번역의 위계(Hierarchy)를 색상과 크기로 명확히 분리하여 시각적 피로도를 최소화한다.
    4. **긍정적 피드백:** 학습 완료, 목표 달성 시 명확하고 만족스러운 시각적 피드백을 제공한다.

## 🎨 2. 디자인 시스템 (Design System Elements)
* **컬러 팔레트:**
    * **Primary Color (액션):** 학습 목표 달성, 다음 단계 버튼 등 사용자의 행동을 유도하는 핵심 색상 (예: 밝고 활기찬 청록색 계열).
    * **Secondary Color (강조):** 구어체 표현, 중요 문법 강조 등 부가 정보를 강조하는 색상.
    * **Background:** 깨끗하고 눈이 편안한 오프화이트 또는 밝은 회색.
* **타이포그래피:**
    * **폰트:** 모바일 환경에 최적화된 산세리프(Sans-serif) 계열 폰트를 사용한다. (예: Apple San Francisco, Google Roboto 등).
    * **위계:** HSK 단어(가장 중요) > 병음(보조) > 한국어 번역(보조) 순으로 크기와 굵기를 차등 적용한다.

## 📐 3. 핵심 화면 플로우 및 와이어프레임 (Core Screens & Flow)

### A. 메인 학습 화면 (The Learning Flow)
* **흐름:** 단어 제시 $\rightarrow$ 문장/문맥 학습 $\rightarrow$ 구어체 접점 $\rightarrow$ 복습/다음 단어
* **레이아웃:**
    * **상단:** 현재 학습 진도 (예: 5/100) 및 학습 모드 선택 (단어만 / 구문 포함).
    * **중앙 (Focus Area):** 오늘의 핵심 단어 및 발음 듣기 버튼.
    * **하단 (Interaction):** 퀴즈/암기 버튼, 다음 페이지로 이동하는 큰 CTA 버튼.

### B. 콘텐츠 상세 보기 (Context View - 이미지 패턴 대응)
* **목적:** 본문 이미지 캡처를 학습 자료로 재구성.
* **레이아웃:**
    * **원본 이미지 (Background):** 상단에 원본 이미지를 배치하여 문맥을 제시.
    * **분석 영역 (Foreground):** 이미지의 주요 단어와 문법 패턴을 오버레이(Overlay) 형태로 분석하여 보여준다. (예: [단어]를 빨간색으로, [문법 패턴]을 파란색으로 하이라이트).
    * **구어체 분리:** 원본 이미지 문장과 분리된, 구어체 표현 섹션을 별도의 카드 형태로 제시하여 시각적 구분을 확실히 한다.

### C. 복습/피드백 화면 (Review & Feedback)
* **기능:** 오답 노트, 취약 단어 리스트.
* **UX:** 단순한 리스트가 아닌, '사용자가 실수한 문장'을 중심으로 반복 학습을 유도하는 인터페이스가 효과적이다.

## ⚙️ 4. 데이터 모델 구조 (Data Model Blueprint)
*(이 구조는 백엔드 API 설계의 기초가 되며, 'requirements_definition.md'의 내용을 구체화합니다.)*

| 필드명 (Field) | 데이터 타입 | 설명 (Description) | 계층 (Level) |
| :--- | :--- | :--- | :--- |
| `context_id` | UUID | 고유 콘텐츠 식별자 | Top |
| `source_image_url` | URL | 본문 출처 이미지 URL | Context |
| `context_text` | String | 원본 텍스트 (한자/병음) | Context |
| `vocabulary_list` | Array of Objects | 핵심 단어 목록 (HSK 4급 기준) | Word |
| `word.hanzi` | String | 한자 | Word |
| `word.pinyin` | String | 병음 | Word |
| `word.korean_meaning` | String | 한국어 의미 | Word |
| `word.colloquial_use` | Boolean | 해당 단어가 구어체로 사용되는지 여부 (필수 필터링 요소) | Word |
| `grammar_pattern` | Array of Objects | 본문에서 추출된 문법/구문 패턴 | Grammar |
| `grammar.pattern_name` | String | 패턴 이름 (예: A比B) | Grammar |
| `grammar.example_sentence` | String | 패턴 적용 예문 | Grammar |
| `colloquial_expression` | Array of Objects | 구어체 표현 (핵심 차별점) | Colloquial |
| `colloquial.phrase` | String | 구어체 구문 | Colloquial |
| `colloquial.meaning` | String | 의미 | Colloquial |
| `colloquial.context_note` | String | 실제 대화에서 사용되는 뉘앙스 설명 | Colloquial |