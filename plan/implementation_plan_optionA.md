# 🃏 Implementation Plan: Option A (The Card Stack)

## 1. Core Concept: "The Tactile Flow"
이 프로젝트의 핵심은 사용자가 **"실제로 카드를 만지고 있다"**는 물리적 감각을 느끼게 하는 것입니다. 한 번에 하나의 단어에만 집중하게 하며, 성공적인 학습 경험(Success Feedback)을 시각적/동적으로 전달합니다.

## 2. Technical Architecture (Tech Stack)
- **Framework**: TypeScript + Vite (Current)
- **Animation Engine**: `Framer Motion` 또는 `GSAP` (강력한 스와이프 및 물리 엔진을 위해 권장)
- **State Management**: Local-first 상태 관리 (현재는 브라우저 메모리/URL 기반)
- **Target Environment**: Mobile-First (Touch-driven)

## 3. Detailed Interaction Logic (The "How-To")

### A. The Interaction Loop (The Core Cycle)
1.  **Initial State**: 카드 스택의 맨 위 카드가 화면 중앙에 위치.
2.  **Interaction Trigger**:
    - **Tap (Flip)**: 카드를 터치하면 `front` (한자) $\leftrightarrow$ `back` (뜻/예문)이 뒤집힘.
    난이도 조절을 위해 '뜻'을 먼저 보여주거나 '한자'를 보여주는 모드 전환 가능.
    - **Swipe (Right/Left)**: 
        - `Right (Success)`: 카드가 화면 밖으로 사라지며 다음 카드가 올라옴.
        - `Left (Review)`: 카드가 다시 스택 아래로 가거나 별도의 '복습 대기' 영역으로 이동.
3.  **Transition**: 카드가 사라진 자리는 아래에 있는 카드가 부드럽게 올라오며(Spring Physics) 채워짐.

### B. Physics & Motion Requirements
- **Spring Motion**: 카드가 움직일 때 약간의 탄성(Elasticity)이 느껴져야 함.
- **Z-Index Management**: 스택의 아래 카드는 투명도가 낮거나 약간 작게 보여야 하며, 위로 올라올수록 선명해져야 함.
- **Exit/Enter Animation**: 카드가 사라질 때의 속도와 나타날 때의 감속(Ease-out)이 자연스러워야 함.

## 4. Data Structure & State Management

### A. Data Model (lessonX.json)
- `id`: 고유 식별자
- `word`: 한자/단어
- `pinyin`: 발음
- `meaning`: 뜻
- `example`: 예문
- `audio`: 오디오 파일 경로

### B. State Logic
- `currentIndex`: 현재 사용자가 보고 있는 카드의 인덱스.
- `isFlipped`: 현재 카드가 앞면인지 뒷면인지 상태.
- `score`: 학습한 단어 수.

## 5. UI/UX Design Specs (2026 Trend)

- **Glassmorphism**: 카드의 배경은 약간의 투명도와 블러(Blur) 효과가 들어간 유리 같은 질감.
- **Typography-First**: 폰트 크기는 크고 선명하게, 배경은 최대한 절제된 미니멀리즘.
- **Haptic Feedback (Visual)**: 스와이프 시 손가락 끝에 걸리는 듯한 시각적 피드백.
- **Progress Indicator**: 상단에 현재 학습 중인 진행도(예: 1/20)를 아주 얇고 우아한 프로그레스 바(Progress Bar)로 표시.

## 6. Implementation Roadmap (Phases)

### Phase 1: The Skeleton (Structure)
- `VocabCard.ts`의 기본 구조 설계 (HTML/CSS 구조).
- 데이터(JSON)를 불러와서 카드 하나를 렌더링하는 로직 구현.

### Phase 2: The Motion (Interaction)
- 스와이프(Swipe) 로직 구현 (Drag/Release).
- 카드 뒤집기(Flip) 애니메이션 구현.

### Phase 3: The Flow (System)
- 다음 카드로 넘어가는 스택 전환 로직 구현.
- 전체 학습 완료 시 '축하(Celebration)' 연출 구현.

### Phase 4: The Polish (Final)
- 모바일 환경 최적화 (Touch-event 정교화).
- 에셋(Audio/Images) 연동.