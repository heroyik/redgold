# 📚 2026 Vocabulary UX/UI Research & Strategy Report

**Project**: RedGold - Mobile-First Chinese Vocabulary App
**Focus**: Optimized Vocabulary Study Section (Lesson-based)
**Date**: 난이도 높은 학습을 위한 최적의 UX 설계

---

## 1. 🎯 Research Objective
사용자가 학습 중 겪는 '인지 과부하(Cognitive Overload)'를 최소화하면서도, 단어 암기 효율을 극대화할 수 있는 **Mobile-First** 단어장 인터페이스를 설계하는 것.

## 2. 🌐 Current Trends (2026 UX/UI)
- **Micro-Interactions**: 카드를 넘기거나 정답을 맞힐 때 발생하는 미세한 애니메이션이 사용자의 도파민을 자극하여 학습 지속력을 높임.
- **Gestural Navigation**: 스와이프(Swipe)와 탭(Tap) 위주의 조작으로 한 손 조작(One-handed operation) 최적화.
- **Minimalist Interface**: 텍스트 밀도가 높은 중국어 학습 특성상, 배경은 깨끗하게 유지하고 글자(Typography)와 여백(Whitespace)의 대비를 극명하게 사용.

## 3. 💡 Proposed UX Strategy: "The Flow State"
우리의 목표는 사용자를 **'몰입 상태(Flow)'**에 머물게 하는 것입니다.

### A. The "Card-Flip" Paradigm (카드형 인터페이스)
- **Front (질문)**: 중국어 한자 + 병음(선택적).
- **Back (정답)**: 뜻 + 예문 + 오디오 버튼.
- **Interaction**: 카드를 터치하면 부드럽게 뒤집히는 3D 효과를 통해 '공부하고 있다'는 물리적 감각을 전달.

### B. Smart Progress Tracking
- 학습 진행률을 상단에 시각적인 프로그레스 바(Progress Bar)로 표시.
- '완료' 버튼을 누를 때마다 획득하는 성취감을 시각적 보상(Confetti 등)으로 연결.

### C. Scaffolding (점진적 난이도)
- **Level 1 (Recognition)**: 눈으로 보고 뜻을 맞히는 단계.
- **Level 2 (Writing/Input)**: 직접 입력하거나 선택하는 단계.
- **Level 3 (Context)**: 예문 속에서 단어의 쓰임새를 확인하는 단계.

## 4. 🛠️ Implementation Plan for RedGold

### Phase 1: The Foundation (Current Focus)
- `lesson1.json` 데이터를 기반으로 한 **`VocabCard`** 컴포넌트 구현.
- 한 화면에 한 단어씩 보여주는 'Focus Mode' UI 구축.

### Phase 2: The Interaction
- 스와이프 동작(알고 있는 단어는 오른쪽, 모르는 단어는 왼쪽)을 통한 분류 기능.
- 오디오 재생과 동시에 텍스트가 강조되는 동기화 UI.

### Phase 3: The Gamification
- 학습 완료 시 'Level Up' 연출.
- 틀린 단어를 따로 모아주는 'Review' 모드 최적화.

---

## 5. 🎯 Conclusion
최고의 단어장은 **"공부가 아니라 게임처럼 느껴지는 인터페이스"**입니다. 텍스트를 읽는 것이 아니라, 정보를 만지는 듯한 경험을 제공하는 것이 우리의 핵심 전략입니다.