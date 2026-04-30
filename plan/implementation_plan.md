# HSK 4 교재 기반 학습 앱 구현 계획서

## 🎯 프로젝트 목표
사용자가 제공하는 HSK 4급 교재(4A/4B) 이미지를 분석하여, **문어체 기반의 교재 내용**을 **실전 구어체 표현**과 함께 복습할 수 있는 고품질 모바일 웹 앱을 구축합니다.

## 🚀 단계별 구현 계획

### Phase 0: 기반 시스템 구축 (현재 진행 중)
* **Vanilla TS 아키텍처:** 프레임워크 없는 순수 TS + Web Components 구조 확정.
* **디자인 시스템:** `global.css` 및 `App.ts` 기반의 프리미엄 UI 가이드 수립.
* **배포 자동화:** GitHub Actions를 이용한 GitHub Pages 배포 설정 완료.

### Phase 1: AI 콘텐츠 파이프라인 (Next Focus)
* **이미지 분석 엔진 (Vertex AI):** 
    * 교재 캡처 이미지에서 텍스트(한자/병음) 및 문법 요소 추출.
    * 추출된 텍스트를 기반으로 **"구어체 버전"** 예문 자동 생성.
* **Firebase Schema 설계:** 
    * `textbooks/{bookId}/chapters/{chapterId}` 구조로 데이터 관리.
    * 각 항목은 `formal` (교재 내용)과 `colloquial` (추가 표현) 쌍으로 구성.

### Phase 2: MVP 모바일 웹 구현
* **학습 카드 UI:** 
    * 상단: 교재 캡처 이미지 (시각적 기억).
    * 중단: 핵심 단어 및 문법 (Formal).
    * 하단: 구어체 변환 표현 및 뉘앙스 팁 (Colloquial).
* **멀티미디어 플레이어:** MP3 파일이 제공될 경우, 문장별 싱크를 맞춘 재생 기능.

### Phase 3: 고도화 및 최적화
* **오답 노트:** 사용자가 헷갈리는 구어체 표현만 따로 모아보기.
* **진도 관리:** 4A/4B 전체 챕터 중 학습 완료된 섹션 시각화.

## 🛠️ 기술 스택 (업데이트)
* **Frontend:** Vanilla TypeScript, CSS (Glassmorphism), Web Components.
* **AI:** Google Vertex AI (Gemini 1.5 Pro/Flash) - 이미지 분석 및 구어체 생성.
* **Backend:** Firebase Firestore (Data), Storage (Images/MP3).
* **Deployment:** GitHub Pages (Frontend), Cloud Functions (AI Logic).

## 📝 우선순위 작업 (Next Steps)
1. [ ] **AI 프롬프트 설계:** 교재 이미지에서 구어체 표현을 유도하는 최적의 프롬프트 작성.
2. [ ] **Firebase 초기화:** Firestore 데이터 구조 생성.
3. [ ] **이미지 업로드 UI:** 사용자가 캡처본을 올리고 분석을 요청하는 관리자용 UI 또는 로직 구현.